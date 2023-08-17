package generative_model

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/pubsub"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/tmc/langchaingo/llms/anthropic"
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

func (a *AnthropicAdapter) GenerateResponse(input *GenerateChatResponse) ([]models.Message, error) {
	if !validateAnthropicModel(input.Model) {
		return nil, ErrIncorrectAnthropicModel
	}

	// optionModel is the option related to model for anthropic
	optionModel := anthropic.WithModel(input.Model)
	// optionToken is the option related to token for antropic
	optionToken := anthropic.WithToken(a.API_KEY)

	llm, err := anthropic.New(optionModel, optionToken)
	if err != nil {
		return nil, err
	}

	prompt := generateRequestText(input.Messages)

	ctx := context.Background()

	completion, err := llm.Call(ctx, prompt)
	if err != nil {
		return nil, err
	}

	latestMessage := models.Message{
		Role:    "assistant",
		Content: completion,
	}

	input.Messages = append(input.Messages, latestMessage)
	// request := anthropicChatRequest{
	// 	Stream:       false,
	// 	Model:        input.Model,
	// 	Temperature:  input.Temperature,
	// 	PromptString: generateRequestText(input.Messages),
	// 	MaxTokens:    2000,
	// }
	// requestBody, err := json.Marshal(request)
	// if err != nil {
	// 	return nil, err
	// }

	// requestURL := a.API_URL + "/v1/complete"
	// req, err := http.NewRequest("POST", requestURL, bytes.NewBuffer(requestBody))
	// if err != nil {
	// 	return nil, err
	// }

	// req.Header.Add("x-api-key", a.API_KEY)

	// resp, err := a.Client.Do(req)
	// if err != nil {
	// 	return nil, err
	// }

	// defer resp.Body.Close()
	// if resp.StatusCode != http.StatusOK {
	// 	errorResponse := make(map[string]interface{})
	// 	_ = json.NewDecoder(resp.Body).Decode(&errorResponse)
	// 	return nil, errors.New("anthropic api returned status code " + resp.Status)
	// }

	// var response anthropicChatResponse
	// err = json.NewDecoder(resp.Body).Decode(&response)
	// if err != nil {
	// 	return nil, err
	// }

	// latestMessage := models.Message{
	// 	Role:    "assistant",
	// 	Content: response.Completion,
	// }

	// input.Messages = append(input.Messages, latestMessage)

	return input.Messages, nil
}

func (a *AnthropicAdapter) GenerateTextUsingChatModel(input *InputForGenerateTextUsingChatModel) (interface{}, string, error) {
	return nil, "", nil
}

func (a *AnthropicAdapter) GenerateTextUsingChatModelStream(input *InputForGenerateTextUsingChatModelStream) {

}

func (a *AnthropicAdapter) GenerateStreamingResponse(input *GenerateChatResponseStream) {
	if !validateAnthropicModel(input.Model) {
		input.ErrChan <- ErrIncorrectAnthropicModel
		return
	}

	request := anthropicChatRequest{
		Stream:       true,
		Model:        input.Model,
		Temperature:  input.Temperature,
		PromptString: generateRequestText(input.Messages),
		MaxTokens:    2000,
	}

	requestBody, err := json.Marshal(request)
	if err != nil {
		input.ErrChan <- err
		return
	}

	requestURL := a.API_URL + "/v1/complete"
	req, err := http.NewRequest("POST", requestURL, bytes.NewBuffer(requestBody))
	if err != nil {
		input.ErrChan <- err
		return
	}
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Accept", "text/event-stream")
	req.Header.Set("Connection", "keep-alive")
	req.Header.Add("x-api-key", a.API_KEY)

	resp, err := a.Client.Do(req)
	if err != nil {
		input.ErrChan <- err
		return
	}

	if resp.StatusCode != http.StatusOK {
		errorResponse := make(map[string]interface{})
		_ = json.NewDecoder(resp.Body).Decode(&errorResponse)

		input.ErrChan <- errors.New("anthropic api returned status code " + resp.Status)
		return
	}

	defer resp.Body.Close()

	latestMessage := models.Message{
		Role: "assistant",
	}
	input.Messages = append(input.Messages, latestMessage)
	// chat is the chat object which will be streamed
	chat := &models.Chat{}
	for {
		data := make([]byte, 1024)
		_, err := resp.Body.Read(data)
		if errors.Is(err, io.EOF) {
			_, dbErr := input.ChatRepo.SaveChat("Chat Title", input.UserID, input.ChatID, input.Model, input.Messages)
			if dbErr != nil {
				input.ErrChan <- dbErr
				return
			}
		}

		if err != nil {
			input.ErrChan <- err
			return
		}

		jsonData := strings.Replace(string(data), "data: ", "", 1)
		jsonData = strings.ReplaceAll(jsonData, "\x00", "")
		if jsonData != "[Done]" {
			eachResponse := anthropicChatResponse{}
			err = json.Unmarshal([]byte(jsonData), &eachResponse)
			if err != nil {
				input.ErrChan <- err
				return
			}
			input.Messages[len(input.Messages)-1].Content = eachResponse.Completion
			msgStream, err := helper.ConvertToJSONB(input.Messages[1:])
			if err != nil {
				input.ErrChan <- err
				return
			}
			chat.Messages = msgStream

			byteStream, err := json.Marshal(chat)
			if err != nil {
				input.ErrChan <- err
				return
			}
			input.DataChan <- string(byteStream)
		}
	}
	// generateRequestText(messages)
}

func generateRequestText(messages []models.Message) string {
	var requestString string
	for _, message := range messages {
		if message.Role == "user" {
			requestString += "\n\nHuman:" + message.Content
		}

		if message.Role == "assistant" {
			requestString += "\n\nAssistant:" + message.Content
		}
	}

	requestString += ". " + messages[0].Content + " \n\nAssistant: "

	return requestString
}

func (a *AnthropicAdapter) GenerateStreamingResponseForPersona(userID, personaID uint, chatID *uint, model string, messages []models.Message, personaRepo repositories.PersonaRepository, dataChan chan<- string, errChan chan<- error, pubsubClient pubsub.PubSub) {

}
