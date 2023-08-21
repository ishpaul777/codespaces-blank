package generative_model

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/tmc/langchaingo/llms"
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

// type anthropicChatRequest struct {
// 	PromptString string  `json:"prompt"`
// 	Model        string  `json:"model"`
// 	Temperature  float32 `json:"temperature"`
// 	Stream       bool    `json:"stream"`
// 	MaxTokens    int32   `json:"max_tokens_to_sample"`
// }

// type anthropicChatResponse struct {
// 	Completion string `json:"completion"`
// }

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

	completion, err := llm.Call(ctx, prompt, llms.WithTemperature(float64(input.Temperature)))
	if err != nil {
		return nil, err
	}

	latestMessage := models.Message{
		Role:    "assistant",
		Content: completion,
	}

	input.Messages = append(input.Messages, latestMessage)

	return input.Messages, nil
}

func (a *AnthropicAdapter) GenerateTextUsingTextModel(input *InputForGenerateTextUsingTextModel) (interface{}, string, error) {
	if !validateAnthropicModel(input.Model) {
		return nil, "", ErrIncorrectAnthropicModel
	}

	// optionModel is the option related to model for anthropic
	optionModel := anthropic.WithModel(input.Model)
	// optionToken is the option related to token for antropic
	optionToken := anthropic.WithToken(a.API_KEY)

	llm, err := anthropic.New(optionModel, optionToken)
	if err != nil {
		return nil, "", err
	}

	prompt := "\n\nHuman: " + input.Prompt + ". \n\nAssistant: "

	ctx := context.Background()

	completion, err := llm.Call(ctx, prompt, llms.WithMaxLength(int(input.MaxTokens)))

	if err != nil {
		return nil, "", err
	}

	return completion, "stop", nil
}

func (a *AnthropicAdapter) GenerateTextUsingChatModel(input *InputForGenerateTextUsingChatModel) (interface{}, string, error) {
	if !validateAnthropicModel(input.Model) {
		return nil, "", ErrIncorrectAnthropicModel
	}

	// optionModel is the option related to model for anthropic
	optionModel := anthropic.WithModel(input.Model)
	// optionToken is the option related to token for antropic
	optionToken := anthropic.WithToken(a.API_KEY)

	llm, err := anthropic.New(optionModel, optionToken)
	if err != nil {
		return nil, "", err
	}

	prompt := "\n\nHuman: " + input.Prompt + ". " + input.AdditionalInstructions + ". \n\nAssistant: "

	ctx := context.Background()

	completion, err := llm.Call(ctx, prompt, llms.WithMaxLength(int(input.MaxTokens)))

	if err != nil {
		return nil, "", err
	}

	return completion, "stop", nil
}

func (a *AnthropicAdapter) GenerateTextUsingTextModelStream(input *InputForGenerateTextUsingTextModelStream) {
	if !validateAnthropicModel(input.Model) {
		input.ErrChan <- ErrIncorrectAnthropicModel
		return
	}

	// optionModel is the option related to model for anthropic
	optionModel := anthropic.WithModel(input.Model)
	// optionToken is the option related to token for antropic
	optionToken := anthropic.WithToken(a.API_KEY)

	llm, err := anthropic.New(optionModel, optionToken)
	if err != nil {
		input.ErrChan <- err
		return
	}

	prompt := "\n\nHuman: " + input.Prompt + ". \n\nAssistant: "

	ctx := context.Background()
	responseMap := models.GenerateTextResponse{
		Output:       "",
		FinishReason: "",
	}

	streamingFunc := func(ctx context.Context, chunk []byte) error {
		responseMap.Output += string(chunk)
		responseMap.FinishReason = "finish"
		return nil
	}

	_, err = llm.Call(ctx,
		prompt,
		llms.WithMaxLength(int(input.MaxTokens)),
		llms.WithStreamingFunc(streamingFunc),
	)

	if err != nil {
		input.ErrChan <- err
		return
	}

	payload := map[string]interface{}{
		"input":    input.Prompt,
		"model":    input.Model,
		"provider": "anthropic",
		"output":   responseMap.Output,
	}

	request := models.RequestUsage{
		OrgID:   input.OrgID,
		UserID:  input.UserID,
		Type:    "generate-text",
		Payload: payload,
	}

	byteData, _ := json.Marshal(request)
	input.PubsubClient.Publish("tagore.usage", byteData)
	input.ErrChan <- errors.New("end of file")
}

func (a *AnthropicAdapter) GenerateTextUsingChatModelStream(input *InputForGenerateTextUsingChatModelStream) {
	if !validateAnthropicModel(input.Model) {
		input.ErrChan <- ErrIncorrectAnthropicModel
		return
	}

	// optionModel is the option related to model for anthropic
	optionModel := anthropic.WithModel(input.Model)
	// optionToken is the option related to token for antropic
	optionToken := anthropic.WithToken(a.API_KEY)

	llm, err := anthropic.New(optionModel, optionToken)
	if err != nil {
		input.ErrChan <- err
		return
	}

	prompt := "\n\nHuman: " + input.Prompt + " " + input.AdditionalInstructions + ". \n\nAssistant: "

	ctx := context.Background()
	responseMap := models.GenerateTextResponse{
		Output:       "",
		FinishReason: "",
	}

	streamingFunc := func(ctx context.Context, chunk []byte) error {
		responseMap.Output += string(chunk)
		responseMap.FinishReason = "finish"
		return nil
	}

	_, err = llm.Call(ctx,
		prompt,
		llms.WithMaxLength(int(input.MaxTokens)),
		llms.WithStreamingFunc(streamingFunc),
	)

	if err != nil {
		input.ErrChan <- err
		return
	}

	payload := map[string]interface{}{
		"input":    input.Prompt,
		"model":    input.Model,
		"provider": "anthropic",
		"output":   responseMap.Output,
	}

	request := models.RequestUsage{
		OrgID:   input.OrgID,
		UserID:  input.UserID,
		Type:    "generate-text",
		Payload: payload,
	}

	byteData, _ := json.Marshal(request)
	input.PubsubClient.Publish("tagore.usage", byteData)
	input.ErrChan <- errors.New("end of file")
}

func (a *AnthropicAdapter) GenerateStreamingResponse(input *GenerateChatResponseStream) {
	if !validateAnthropicModel(input.Model) {
		input.ErrChan <- ErrIncorrectAnthropicModel
		return
	}

	// optionModel is the option related to model for anthropic
	optionModel := anthropic.WithModel(input.Model)
	// optionToken is the option related to token for antropic
	optionToken := anthropic.WithToken(a.API_KEY)

	llm, err := anthropic.New(optionModel, optionToken)
	if err != nil {
		input.ErrChan <- err
		return
	}

	prompt := generateRequestText(input.Messages)

	ctx := context.Background()

	latestMsg := models.Message{}
	latestMsg.Role = "assistant"

	input.Messages = append(input.Messages, latestMsg)
	chat := &models.Chat{}

	streamingFunc := func(ctx context.Context, chunk []byte) error {
		input.Messages[len(input.Messages)-1].Content += string(chunk)
		msgStream, err := helper.ConvertToJSONB(input.Messages)
		if err != nil {
			return err
		}

		chat.Messages = msgStream

		byteStream, err := json.Marshal(chat)
		if err != nil {
			return err
		}

		input.DataChan <- string(byteStream)
		return nil
	}

	_, err = llm.Call(ctx, prompt, llms.WithTemperature(float64(input.Temperature)), llms.WithStreamingFunc(streamingFunc))
	if err != nil {
		input.ErrChan <- err
		return
	}

	chat, err = input.ChatRepo.SaveChat("this is title anthropic", input.UserID, input.ChatID, input.Model, input.Messages)
	if err != nil {
		input.ErrChan <- err
		return
	}

	byteStream, err := json.Marshal(chat)
	if err != nil {
		input.ErrChan <- err
		return
	}
	input.DataChan <- string(byteStream)
	usagePayload := map[string]interface{}{
		"model":    input.Model,
		"provider": "anthropic",
		"chat":     chat,
	}

	request := models.RequestUsage{
		OrgID:   input.OrgID,
		UserID:  input.UserID,
		Type:    "generate-chat",
		Payload: usagePayload,
	}

	byteData, _ := json.Marshal(request)

	input.PubsubClient.Publish("tagore.usage", byteData)
	input.ErrChan <- errors.New("end of file")
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

func (a *AnthropicAdapter) GenerateStreamingResponseForPersona(input *models.PersonaChatStream, personaRepo repositories.PersonaRepository) {

}
