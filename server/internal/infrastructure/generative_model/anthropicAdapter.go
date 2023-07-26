package generative_model

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/pubsub"
	"github.com/factly/tagore/server/pkg/helper"
)

type AnthropicAdapter struct {
	API_KEY string `json:"API_KEY"`
	API_URL string `json:"API_URL"`
	Client  *http.Client
}

var (
	ErrIncorrectAnthropicModel = errors.New("incorrect anthropic model")
)

func NewAnthropicAdapter() *AnthropicAdapter {
	return &AnthropicAdapter{}
}

type anthropicChatRequest struct {
	PromptString string  `json:"prompt"`
	Model        string  `json:"model"`
	Temperature  float32 `json:"temperature"`
	Stream       bool    `json:"stream"`
	MaxTokens    int32   `json:"max_tokens_to_sample"`
}

type anthropicChatResponse struct {
	Completion string `json:"completion"`
}

var anthropicDataFile = "./modelData/anthropic.json"

func (o *AnthropicAdapter) GenerateChatTitle(message models.Message) (string, error) {
	return message.Content, nil
}

func (a *AnthropicAdapter) LoadConfig() error {
	configFile, err := os.Open(anthropicDataFile)
	if err != nil {
		return err
	}

	defer configFile.Close()

	jsonParser := json.NewDecoder(configFile)
	err = jsonParser.Decode(&a)
	if err != nil {
		return err
	}

	a.Client = &http.Client{
		Timeout: 30 * time.Second,
	}
	return nil
}

func validateAnthropicModel(model string) bool {
	switch model {
	case "claude-2":
		return true
	default:
		return false
	}
}

func (a *AnthropicAdapter) GenerateResponse(model string, temperature float32, messages []models.Message) ([]models.Message, error) {
	if !validateAnthropicModel(model) {
		return nil, ErrIncorrectAnthropicModel
	}

	request := anthropicChatRequest{
		Stream:       false,
		Model:        model,
		Temperature:  temperature,
		PromptString: generateRequestText(messages),
		MaxTokens:    2000,
	}
	requestBody, err := json.Marshal(request)
	if err != nil {
		return nil, err
	}

	requestURL := a.API_URL + "/v1/complete"
	req, err := http.NewRequest("POST", requestURL, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, err
	}

	req.Header.Add("x-api-key", a.API_KEY)

	resp, err := a.Client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		errorResponse := make(map[string]interface{})
		_ = json.NewDecoder(resp.Body).Decode(&errorResponse)
		fmt.Println(errorResponse)
		return nil, errors.New("anthropic api returned status code " + resp.Status)
	}

	var response anthropicChatResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return nil, err
	}

	latestMessage := models.Message{
		Role:    "assistant",
		Content: response.Completion,
	}

	messages = append(messages, latestMessage)

	return messages, nil
}

func (a *AnthropicAdapter) GenerateStreamingResponse(userID uint, chatID *uint, model string, temperature float32, messages []models.Message, dataChan chan<- string, errChan chan<- error, chatRepo repositories.ChatRepository, pubsubClient pubsub.PubSub) {
	if !validateAnthropicModel(model) {
		errChan <- ErrIncorrectAnthropicModel
		return
	}

	request := anthropicChatRequest{
		Stream:       true,
		Model:        model,
		Temperature:  temperature,
		PromptString: generateRequestText(messages),
		MaxTokens:    2000,
	}

	requestBody, err := json.Marshal(request)
	if err != nil {
		errChan <- err
		return
	}

	requestURL := a.API_URL + "/v1/complete"
	req, err := http.NewRequest("POST", requestURL, bytes.NewBuffer(requestBody))
	if err != nil {
		errChan <- err
		return
	}
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Accept", "text/event-stream")
	req.Header.Set("Connection", "keep-alive")
	req.Header.Add("x-api-key", a.API_KEY)

	resp, err := a.Client.Do(req)
	if err != nil {
		errChan <- err
		return
	}

	if resp.StatusCode != http.StatusOK {
		errorResponse := make(map[string]interface{})
		_ = json.NewDecoder(resp.Body).Decode(&errorResponse)

		errChan <- errors.New("anthropic api returned status code " + resp.Status)
		return
	}

	defer resp.Body.Close()

	latestMessage := models.Message{
		Role: "assistant",
	}
	messages = append(messages, latestMessage)
	// chat is the chat object which will be streamed
	chat := &models.Chat{}
	for {
		data := make([]byte, 1024)
		_, err := resp.Body.Read(data)
		if errors.Is(err, io.EOF) {
			_, dbErr := chatRepo.SaveChat("Chat Title", userID, chatID, model, messages)
			if dbErr != nil {
				errChan <- dbErr
				return
			}
		}

		if err != nil {
			errChan <- err
			return
		}

		jsonData := strings.Replace(string(data), "data: ", "", 1)
		jsonData = strings.ReplaceAll(jsonData, "\x00", "")
		if jsonData != "[Done]" {
			eachResponse := anthropicChatResponse{}
			err = json.Unmarshal([]byte(jsonData), &eachResponse)
			if err != nil {
				errChan <- err
				return
			}
			messages[len(messages)-1].Content = eachResponse.Completion
			msgStream, err := helper.ConvertToJSONB(messages[1:])
			if err != nil {
				errChan <- err
				return
			}
			chat.Messages = msgStream

			byteStream, err := json.Marshal(chat)
			if err != nil {
				errChan <- err
				return
			}
			dataChan <- string(byteStream)
		}
	}
	// generateRequestText(messages)
}

func generateRequestText(messages []models.Message) string {
	requestString := ``
	for _, message := range messages {
		if message.Role == "user" {
			requestString += `\n\nHuman: ` + message.Content
		}

		if message.Role == "assistant" {
			requestString += `\n\nAssistant: ` + message.Content
		}
	}

	requestString += (`. ` + messages[0].Content + ` \n\nAssistant: `)

	return requestString
}

func (a *AnthropicAdapter) GenerateStreamingResponseForPersona(userID, personaID uint, chatID *uint, model string, messages []models.Message, personaRepo repositories.PersonaRepository, dataChan chan<- string, errChan chan<- error, pubsubClient pubsub.PubSub) {

}
