package generative_model

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
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
	case "claude-v1.3":
		return true
	case "claude-v1.2":
		return true
	case "claude-v1.3-100k":
		return true
	default:
		return false
	}
}

func (a *AnthropicAdapter) GenerateResponse(model string, temperature float32, chat models.Chat, chatRepo repositories.ChatRepository) (*models.Chat, error) {
	if !validateAnthropicModel(model) {
		return nil, ErrIncorrectAnthropicModel
	}

	messages := make([]models.Message, 0)

	err := json.Unmarshal([]byte(chat.Messages), &messages)
	if err != nil {
		return nil, err
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

	chat.Messages, err = json.Marshal(messages)
	if err != nil {
		return nil, err
	}

	updatedChat, err := chatRepo.SaveChat(chat.CreatedByID, &chat.ID, model, messages, models.Usage{})
	if err != nil {
		return nil, err
	}

	return updatedChat, nil
}

func (a *AnthropicAdapter) GenerateStreamingResponse(model string, temperature float32, chat models.Chat, dataChan chan<- string, errChan chan<- error, chatRepo repositories.ChatRepository) {
	if !validateAnthropicModel(model) {
		errChan <- ErrIncorrectAnthropicModel
		return
	}

	messages := make([]models.Message, 0)

	err := json.Unmarshal([]byte(chat.Messages), &messages)
	if err != nil {
		errChan <- err
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

	defer resp.Body.Close()

	latestMessage := models.Message{
		Role: "assistant",
	}
	messages = append(messages, latestMessage)
	for {
		data := make([]byte, 1024)
		_, err := resp.Body.Read(data)
		if err != nil {
			errChan <- err
			return
		}

		jsonData := strings.Replace(string(data), "data: ", "", 1)
		jsonData = strings.ReplaceAll(jsonData, "\x00", "")
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
	// generateRequestText(messages)
}

func generateRequestText(messages []models.Message) string {
	requestString := ``
	for _, message := range messages {
		if message.Role == "user" {
			requestString += `\n\n Human: ` + message.Content
		}

		if message.Role == "assistant" {
			requestString += `\n\n Assistant: ` + message.Content
		}
	}

	requestString += (`. ` + messages[0].Content + ` \n\n Assitant: `)

	return requestString
}
