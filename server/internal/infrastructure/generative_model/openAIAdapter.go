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
	"github.com/factly/tagore/server/internal/infrastructure/pubsub"
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

const OPENAI PROVIDER = "openai"

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

func (o *OpenAIAdapter) GenerateChatTitle(message models.Message) (string, error) {
	req := openai.CompletionRequest{
		Prompt: "Generate Chat Title for the following messsage: " + message.Content,
		Model:  openai.GPT3TextDavinci003,
	}
	ctx := context.Background()
	resp, err := o.Client.CreateCompletion(ctx, req)
	if err != nil {
		return "", err
	}

	return resp.Choices[0].Text, nil
}

func (o *OpenAIAdapter) GenerateTextUsingTextModel(input *InputForGenerateTextUsingTextModel) (interface{}, string, error) {
	req := openai.CompletionRequest{
		Prompt:    input.Prompt,
		MaxTokens: int(input.MaxTokens),
		Model:     openai.GPT3TextDavinci003,
	}
	ctx := context.Background()
	resp, err := o.Client.CreateCompletion(ctx, req)
	if err != nil {
		return nil, "", err
	}

	return resp.Choices[0].Text, resp.Choices[0].FinishReason, nil
}

func (o *OpenAIAdapter) GenerateTextUsingChatModel(input *InputForGenerateTextUsingChatModel) (interface{}, string, error) {

	systemMessage := openai.ChatCompletionMessage{
		Role:    "system",
		Content: prompts.SYSTEM_PROMPT_FOR_TEXT_GENERATION,
	}

	textGenerationMessage := openai.ChatCompletionMessage{
		Role:    "user",
		Content: input.Prompt + ". " + input.AdditionalInstructions,
	}

	messages := []openai.ChatCompletionMessage{}
	messages = append(messages, systemMessage)
	messages = append(messages, textGenerationMessage)
	ctx := context.Background()
	req := openai.ChatCompletionRequest{
		Messages: messages,
		Model:    input.Model,
		// MaxTokens: int(maxTokens),
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

func (o *OpenAIAdapter) GenerateTextUsingTextModelStream(input *InputForGenerateTextUsingTextModelStream) {
	if input.Model == "" {
		input.Model = openai.GPT3TextDavinci003
	}

	req := openai.CompletionRequest{
		Prompt:    input.Prompt,
		MaxTokens: int(input.MaxTokens),
		Model:     input.Model,
	}

	ctx := context.Background()

	stream, err := o.Client.CreateCompletionStream(ctx, req)
	if err != nil {
		input.ErrChan <- err
		return
	}
	responseMap := models.GenerateTextResponse{
		Output:       "",
		FinishReason: "",
	}

	for {

		resp, err := stream.Recv()
		if err != nil {
			input.ErrChan <- err
			return
		}

		responseMap.Output = responseMap.Output + resp.Choices[0].Text
		responseMap.FinishReason = resp.Choices[0].FinishReason
		if resp.Choices[0].FinishReason == "length" || resp.Choices[0].FinishReason == "stop" {
			payload := map[string]interface{}{
				"input":    input.Prompt,
				"model":    input.Model,
				"provider": OPENAI,
				"output":   responseMap.Output,
			}

			request := models.RequestUsage{
				UserID:  input.UserID,
				Type:    "generate-text",
				Payload: payload,
			}

			byteData, _ := json.Marshal(request)
			input.PubsubClient.Publish("tagore.usage", byteData)
		}
		respJSON, err := json.Marshal(responseMap)
		if err != nil {
			input.ErrChan <- err
			return
		}

		input.DataChan <- string(respJSON)
	}
}

func (o *OpenAIAdapter) GenerateTextUsingChatModelStream(input *InputForGenerateTextUsingChatModelStream) {
	if input.Model == "" {
		input.Model = openai.GPT3Dot5Turbo
	}

	systemMessage := openai.ChatCompletionMessage{
		Role:    "system",
		Content: prompts.SYSTEM_PROMPT_FOR_TEXT_GENERATION,
	}

	textGenerationMessage := openai.ChatCompletionMessage{
		Role:    "user",
		Content: input.Prompt + ". " + input.AdditionalInstructions,
	}

	messages := []openai.ChatCompletionMessage{}
	messages = append(messages, systemMessage)
	messages = append(messages, textGenerationMessage)
	ctx := context.Background()
	req := openai.ChatCompletionRequest{
		Messages:  messages,
		Model:     input.Model,
		MaxTokens: int(input.MaxTokens),
	}

	stream, err := o.Client.CreateChatCompletionStream(ctx, req)

	if err != nil {
		input.ErrChan <- err
		return
	}
	responseMap := models.GenerateTextResponse{
		Output:       "",
		FinishReason: "",
	}

	for {
		resp, err := stream.Recv()
		if err != nil {
			input.ErrChan <- err
			return
		}

		responseMap.Output = responseMap.Output + resp.Choices[0].Delta.Content
		responseMap.FinishReason = resp.Choices[0].FinishReason
		if resp.Choices[0].FinishReason == "length" || resp.Choices[0].FinishReason == "stop" {
			payload := map[string]interface{}{
				"input":    input.Prompt,
				"output":   responseMap.Output,
				"model":    input.Model,
				"provider": OPENAI,
			}

			request := models.RequestUsage{
				UserID:  input.UserID,
				Type:    "generate-text",
				Payload: payload,
			}

			byteData, _ := json.Marshal(request)
			input.PubsubClient.Publish("tagore.usage", byteData)
		}

		respJson, err := json.Marshal(responseMap)
		if err != nil {
			input.ErrChan <- err
			return
		}

		input.DataChan <- string(respJson)
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

func (o *OpenAIAdapter) GenerateResponse(input *GenerateChatResponse) ([]models.Message, error) {
	requestMessages := make([]openai.ChatCompletionMessage, 0)
	for _, message := range input.Messages {
		requestMessages = append(requestMessages, openai.ChatCompletionMessage{
			Role:    message.Role,
			Content: message.Content,
		})
	}

	req := openai.ChatCompletionRequest{
		Model:       input.Model,
		Messages:    requestMessages,
		Temperature: input.Temperature,
	}

	ctx := context.Background()
	response, err := o.Client.CreateChatCompletion(ctx, req)
	if err != nil {
		return nil, err
	}

	latestMessage := models.Message{}
	latestMessage.Role = "assistant"

	latestMessage.Content = response.Choices[0].Message.Content
	input.Messages = append(input.Messages, latestMessage)

	return input.Messages, nil
}

func (o *OpenAIAdapter) GenerateStreamingResponse(data *GenerateChatResponseStream) {
	requestMessages := make([]openai.ChatCompletionMessage, 0)
	for _, message := range data.Messages {
		requestMessages = append(requestMessages, openai.ChatCompletionMessage{
			Role:    message.Role,
			Content: message.Content,
		})
	}

	req := openai.ChatCompletionRequest{
		Model:       data.Model,
		Messages:    requestMessages,
		Stream:      true,
		Temperature: data.Temperature,
	}

	ctx := context.Background()
	stream, err := o.Client.CreateChatCompletionStream(ctx, req)
	if err != nil {
		data.ErrChan <- err
		return
	}

	latestMessage := models.Message{}
	latestMessage.Role = "assistant"

	data.Messages = append(data.Messages, latestMessage)

	// chat is the chat object which will be streamed
	chat := &models.Chat{}
	for {
		response, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			// generate title for the chat
			var dbErr error
			var title string
			var userMsgs []models.Message
			for _, msg := range data.Messages {
				if msg.Role == "user" {
					userMsgs = append(userMsgs, msg)
				}
			}

			if len(userMsgs) > 0 && data.ChatID == nil {
				title, dbErr = o.GenerateChatTitle(userMsgs[0])
				if dbErr != nil {
					data.ErrChan <- dbErr
					return
				}
			} else {
				title = ""
			}

			// fullChatData is the the chat object with all the details
			chat, dbErr = data.ChatRepo.SaveChat(title, data.UserID, data.ChatID, data.Model, data.Messages)
			if dbErr != nil {
				data.ErrChan <- dbErr
				return
			}
			byteStream, err := json.Marshal(chat)
			if err != nil {
				data.ErrChan <- err
				return
			}
			data.DataChan <- string(byteStream)

			usagePayload := map[string]interface{}{
				"model":    data.Model,
				"provider": OPENAI,
				"chat":     chat,
			}

			request := models.RequestUsage{
				UserID:  data.UserID,
				Type:    "generate-chat",
				Payload: usagePayload,
			}

			byteData, _ := json.Marshal(request)

			data.PubsubClient.Publish("tagore.usage", byteData)
		}

		if err != nil {
			data.ErrChan <- err
			return
		}

		data.Messages[len(data.Messages)-1].Content += response.Choices[0].Delta.Content

		msgStream, err := helper.ConvertToJSONB(data.Messages)
		if err != nil {
			data.ErrChan <- err
			return
		}

		chat.Messages = msgStream

		byteStream, err := json.Marshal(chat)
		if err != nil {
			data.ErrChan <- err
			return
		}

		data.DataChan <- string(byteStream)
	}
}

func (o *OpenAIAdapter) GenerateStreamingResponseForPersona(userID, personaID uint, chatID *uint, model string, messages []models.Message, personaRepo repositories.PersonaRepository, dataChan chan<- string, errChan chan<- error, pubsubClient pubsub.PubSub) {
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
				personaChat, err := personaRepo.CreatePersonaChat(userID, personaID, messages)

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

				payload := map[string]interface{}{
					"model":    model,
					"provider": OPENAI,
					"chat":     personaChat,
				}

				request := models.RequestUsage{
					UserID:  userID,
					Type:    "generate-persona-chat",
					Payload: payload,
				}

				byteData, _ := json.Marshal(request)

				pubsubClient.Publish("tagore.usage", byteData)
			} else {
				personaChat, err := personaRepo.UpdatePersonaChat(userID, personaID, *chatID, messages)
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

				payload := map[string]interface{}{
					"model":    model,
					"provider": OPENAI,
					"chat":     personaChat,
				}

				request := models.RequestUsage{
					UserID:  userID,
					Type:    "generate-persona-chat",
					Payload: payload,
				}

				byteData, _ := json.Marshal(request)

				pubsubClient.Publish("tagore.usage", byteData)
			}
			return
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
