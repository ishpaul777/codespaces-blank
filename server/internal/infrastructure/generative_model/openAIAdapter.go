package generative_model

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"os"

	"github.com/factly/tagore/server/internal/domain/constants/prompts"
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

func (o *OpenAIAdapter) GenerateTextUsingTextModel(prompt, model string, maxTokens uint) (interface{}, string, error) {
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

func (o *OpenAIAdapter) GenerateTextUsingChatModel(prompt, model, additionalInstructions string, maxTokens uint) (interface{}, string, error) {

	systemMessage := openai.ChatCompletionMessage{
		Role:    "system",
		Content: prompts.SYSTEM_PROMPT_FOR_TEXT_GENERATION,
	}

	textGenerationMessage := openai.ChatCompletionMessage{
		Role:    "user",
		Content: prompt + ". " + additionalInstructions,
	}

	messages := []openai.ChatCompletionMessage{}
	messages = append(messages, systemMessage)
	messages = append(messages, textGenerationMessage)
	ctx := context.Background()
	req := openai.ChatCompletionRequest{
		Messages:  messages,
		Model:     model,
		MaxTokens: int(maxTokens),
	}

	resp, err := o.Client.CreateChatCompletion(ctx, req)
	if err != nil {
		return nil, "", err
	}

	return resp.Choices[0].Message.Content, resp.Choices[0].FinishReason, nil
}

// GenerateTextUsintTextModelStream generates text stream using OpenAI's API
// it takes :
// 		prompt: the prompt to be used for generating the text
// 		maxTokens: the maximum number of tokens to be generated
// 		dataChan: a channel to send the generated text
// 		errChan: a channel to send the error

func (o *OpenAIAdapter) GenerateTextUsingTextModelStream(model string, prompt string, maxTokens uint, dataChan chan<- string, errChan chan<- error) {
	if model == "" {
		model = openai.GPT3TextDavinci003
	}

	req := openai.CompletionRequest{
		Prompt:    prompt,
		MaxTokens: int(maxTokens),
		Model:     model,
	}

	ctx := context.Background()

	stream, err := o.Client.CreateCompletionStream(ctx, req)
	if err != nil {
		errChan <- err
		return
	}
	responseMap := models.GenerateTextResponse{
		Output:       "",
		FinishReason: "",
	}

	for {

		resp, err := stream.Recv()
		if err != nil {
			errChan <- err
			return
		}

		responseMap.Output = responseMap.Output + resp.Choices[0].Text
		responseMap.FinishReason = resp.Choices[0].FinishReason
		respJSON, err := json.Marshal(responseMap)
		if err != nil {
			errChan <- err
			return
		}

		dataChan <- string(respJSON)
	}
}

func (o *OpenAIAdapter) GenerateTextUsingChatModelStream(model string, prompt string, maxTokens uint, additionalInstructions string, dataChan chan<- string, errChan chan<- error) {
	if model == "" {
		model = openai.GPT3Dot5Turbo
	}

	systemMessage := openai.ChatCompletionMessage{
		Role:    "system",
		Content: prompts.SYSTEM_PROMPT_FOR_TEXT_GENERATION,
	}

	textGenerationMessage := openai.ChatCompletionMessage{
		Role:    "user",
		Content: prompt + ". " + additionalInstructions,
	}

	messages := []openai.ChatCompletionMessage{}
	messages = append(messages, systemMessage)
	messages = append(messages, textGenerationMessage)
	ctx := context.Background()
	req := openai.ChatCompletionRequest{
		Messages:  messages,
		Model:     model,
		MaxTokens: int(maxTokens),
	}

	stream, err := o.Client.CreateChatCompletionStream(ctx, req)

	if err != nil {
		errChan <- err
		return
	}
	responseMap := models.GenerateTextResponse{
		Output:       "",
		FinishReason: "",
	}

	for {
		resp, err := stream.Recv()
		if err != nil {
			errChan <- err
			return
		}

		responseMap.Output = responseMap.Output + resp.Choices[0].Delta.Content
		responseMap.FinishReason = resp.Choices[0].FinishReason
		respJson, err := json.Marshal(responseMap)
		if err != nil {
			errChan <- err
			return
		}

		dataChan <- string(respJson)
	}

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

func (o *OpenAIAdapter) GenerateResponse(model string, temperature float32, messages []models.Message) ([]models.Message, *models.Usage, error) {
	requestMessages := make([]openai.ChatCompletionMessage, 0)
	for _, message := range messages {
		requestMessages = append(requestMessages, openai.ChatCompletionMessage{
			Role:    message.Role,
			Content: message.Content,
		})
	}

	req := openai.ChatCompletionRequest{
		Model:       model,
		Messages:    requestMessages,
		Temperature: temperature,
	}

	ctx := context.Background()
	response, err := o.Client.CreateChatCompletion(ctx, req)
	if err != nil {
		return nil, nil, err
	}

	latestMessage := models.Message{}
	latestMessage.Role = "assistant"

	latestMessage.Content = response.Choices[0].Message.Content
	messages = append(messages, latestMessage)

	return messages, &models.Usage{
		TotalTokens:      0,
		CompletionTokens: 0,
		PromptTokens:     0,
	}, nil
}

func (o *OpenAIAdapter) GenerateStreamingResponse(userID uint, chatID *uint, model string, temperature float32, messages []models.Message, dataChan chan<- string, errChan chan<- error, chatRepo repositories.ChatRepository) {
	requestMessages := make([]openai.ChatCompletionMessage, 0)
	for _, message := range messages {
		requestMessages = append(requestMessages, openai.ChatCompletionMessage{
			Role:    message.Role,
			Content: message.Content,
		})
	}

	req := openai.ChatCompletionRequest{
		Model:       model,
		Messages:    requestMessages,
		Stream:      true,
		Temperature: temperature,
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

	// chat is the chat object which will be streamed
	chat := &models.Chat{}
	for {
		response, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			// fullChatData is the the chat object with all the details
			var dbErr error
			chat, dbErr = chatRepo.SaveChat(userID, chatID, model, messages, models.Usage{})
			if dbErr != nil {
				errChan <- dbErr
				return
			}
			byteStream, err := json.Marshal(chat)
			if err != nil {
				errChan <- err
				return
			}
			dataChan <- string(byteStream)
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

func (o *OpenAIAdapter) GenerateStreamingResponseForPersona(userID, personaID uint, chatID *uint, model string, messages []models.Message, personaRepo repositories.PersonaRepository, dataChan chan<- string, errChan chan<- error) {
	const temperature = 0.9
	requestMessages := make([]openai.ChatCompletionMessage, 0)
	for _, message := range messages {
		requestMessages = append(requestMessages, openai.ChatCompletionMessage{
			Role:    message.Role,
			Content: message.Content,
		})
	}

	req := openai.ChatCompletionRequest{
		Model:       model,
		Messages:    requestMessages,
		Stream:      true,
		Temperature: temperature,
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
			if chatID == nil {
				personaChat, err := personaRepo.CreatePersonaChat(userID, personaID, messages, models.Usage{
					PromptTokens:     0,
					TotalTokens:      0,
					CompletionTokens: 0,
				})

				if err != nil {
					errChan <- err
					return
				}

				byteStream, err := json.Marshal(personaChat)
				if err != nil {
					errChan <- err
					return
				}

				dataChan <- string(byteStream)
				errChan <- io.EOF
				return
			} else {
				personaChat, err := personaRepo.UpdatePersonaChat(userID, personaID, *chatID, messages, models.Usage{
					PromptTokens:     0,
					TotalTokens:      0,
					CompletionTokens: 0,
				})
				if err != nil {
					errChan <- err
					return
				}

				byteStream, err := json.Marshal(personaChat)
				if err != nil {
					errChan <- err
					return
				}

				dataChan <- string(byteStream)
				errChan <- io.EOF
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

		personaChat := models.PersonaChat{
			Messages: msgStream,
		}

		byteStream, err := json.Marshal(personaChat)
		if err != nil {
			errChan <- err
			return
		}

		dataChan <- string(byteStream)
	}
}
