package generative_model

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"os"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/sashabaranov/go-openai"
)

type OpenAIAdapter struct {
	API_KEY string `json:"API_KEY"`
	Client  *openai.Client
}

func NewOpenAIAdapter() *OpenAIAdapter {
	return &OpenAIAdapter{}
}

var modelDataFile = "./modelData/openAI.json"

func (o *OpenAIAdapter) LoadConfig() error {
	configFile, err := os.Open(modelDataFile)
	if err != nil {
		return err
	}
	defer configFile.Close()

	jsonParser := json.NewDecoder(configFile)
	err = jsonParser.Decode(&o)
	if err != nil {
		return err
	}

	o.Client = openai.NewClient(o.API_KEY)
	return nil
}

func (o *OpenAIAdapter) GenerateText(prompt string, maxTokens uint) (interface{}, string, error) {
	req := openai.CompletionRequest{
		Prompt:    prompt,
		MaxTokens: int(maxTokens),
		Model:     openai.GPT3TextDavinci003,
	}
	ctx := context.Background()
	resp, err := o.Client.CreateCompletion(ctx, req)
	if err != nil {
		return nil, "", err
	}

	return resp.Choices[0].Text, resp.Choices[0].FinishReason, nil
}

func (o *OpenAIAdapter) EditText(input string, instruction string) (interface{}, error) {
	return nil, nil
}

// GenerateImage generates an image using OpenAI's API
// nOfImages is the number of images to be generated
// prompt is the prompt to be used for generating the image
// returns a slice of GeneratedImage and an error
func (o *OpenAIAdapter) GenerateImage(model string, nOfImages int32, prompt string) ([]models.GeneratedImage, error) {
	req := openai.ImageRequest{
		N:      int(nOfImages),
		Prompt: prompt,
		Size:   "512x512",
	}

	ctx := context.Background()
	resp, err := o.Client.CreateImage(ctx, req)
	if err != nil {
		return nil, err
	}

	generatedImages := make([]models.GeneratedImage, 0)
	for _, image := range resp.Data {
		generatedImages = append(generatedImages, models.GeneratedImage{
			URL: image.URL,
		})
	}

	return generatedImages, nil
}

func (o *OpenAIAdapter) GenerateVariation(model string, image *os.File, nOfImages int32) ([]models.GeneratedImage, error) {
	req := openai.ImageVariRequest{
		N:     int(nOfImages),
		Image: image,
		Size:  "512x512",
	}

	ctx := context.Background()
	resp, err := o.Client.CreateVariImage(ctx, req)
	if err != nil {
		return nil, err
	}

	generatedImages := make([]models.GeneratedImage, 0)
	for _, image := range resp.Data {
		generatedImages = append(generatedImages, models.GeneratedImage{
			URL: image.URL,
		})
	}

	return generatedImages, nil
}

func (o *OpenAIAdapter) GenerateResponse(model string, messages []models.Message) ([]models.Message, *models.Usage, error) {
	requestMessages := make([]openai.ChatCompletionMessage, 0)
	for _, message := range messages {
		requestMessages = append(requestMessages, openai.ChatCompletionMessage{
			Role:    message.Role,
			Content: message.Content,
		})
	}

	req := openai.ChatCompletionRequest{
		Model:    model,
		Messages: requestMessages,
	}

	ctx := context.Background()
	resp, err := o.Client.CreateChatCompletion(ctx, req)
	if err != nil {
		return nil, nil, err
	}

	messages = append(messages, models.Message{
		Role:    resp.Choices[0].Message.Role,
		Content: resp.Choices[0].Message.Content,
	})

	usage := &models.Usage{
		PromptTokens:     resp.Usage.PromptTokens,
		CompletionTokens: resp.Usage.CompletionTokens,
		TotalTokens:      resp.Usage.TotalTokens,
	}

	return messages, usage, nil
}

func (o *OpenAIAdapter) GenerateStreamingResponse(model string, chat models.Chat, dataChan chan<- string, errChan chan<- error, chatRepo repositories.ChatRepository) {
	messages := make([]models.Message, 0)

	err := json.Unmarshal([]byte(chat.Messages), &messages)
	if err != nil {
		errChan <- err
		return
	}

	requestMessages := make([]openai.ChatCompletionMessage, 0)
	for _, message := range messages {
		requestMessages = append(requestMessages, openai.ChatCompletionMessage{
			Role:    message.Role,
			Content: message.Content,
		})
	}

	// messages := make([]openai.ChatCompletionMessage, 0)

	req := openai.ChatCompletionRequest{
		Model:    model,
		Messages: requestMessages,
		Stream:   true,
	}

	ctx := context.Background()
	stream, err := o.Client.CreateChatCompletionStream(ctx, req)
	if err != nil {
		errChan <- err
		return
	}

	latestMessage := models.Message{}
	latestMessage.Role = "assistant"

	messages = append(messages, latestMessage)
	for {
		response, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			_, dbErr := chatRepo.SaveChat(chat.CreatedByID, &chat.ID, model, messages, models.Usage{})
			if dbErr != nil {
				errChan <- dbErr
				return
			}
		}

		if err != nil {
			errChan <- err
			return
		}

		messages[len(messages)-1].Content += response.Choices[0].Delta.Content

		msgStream, err := helper.ConvertToJSONB(messages)
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
