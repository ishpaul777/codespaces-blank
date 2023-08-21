package generative_model

import (
	"os"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/pubsub"
)

type ConfigGenerativeModel interface {
	LoadConfig() error
}

type PROVIDER string

type (
	GenerateChatResponse struct {
		Model       string
		Temperature float32
		Messages    []models.Message
	}

	GenerateChatResponseStream struct {
		OrgID uint
		UserID       uint
		ChatID       *uint
		Model        string
		Temperature  float32
		Messages     []models.Message
		DataChan     chan<- string
		ErrChan      chan<- error
		ChatRepo     repositories.ChatRepository
		PubsubClient pubsub.PubSub
	}

	InputForGenerateTextUsingTextModel struct {
		Prompt    string
		Model     string
		MaxTokens uint
	}

	InputForGenerateTextUsingChatModel struct {
		Prompt                 string
		Model                  string
		AdditionalInstructions string
		MaxTokens              uint
	}

	InputForGenerateTextUsingTextModelStream struct {
		OrgID        uint
		UserID       uint
		Model        string
		Prompt       string
		MaxTokens    uint
		DataChan     chan<- string
		ErrChan      chan<- error
		PubsubClient pubsub.PubSub
	}

	InputForGenerateTextUsingChatModelStream struct {
		OrgID                  uint
		UserID                 uint
		Model                  string
		Prompt                 string
		AdditionalInstructions string
		MaxTokens              uint
		DataChan               chan<- string
		ErrChan                chan<- error
		PubsubClient           pubsub.PubSub
	}
)

type TextGenerativeModel interface {
	ConfigGenerativeModel
	GenerateTextUsingTextModel(input *InputForGenerateTextUsingTextModel) (interface{}, string, error)
	GenerateTextUsingChatModel(input *InputForGenerateTextUsingChatModel) (interface{}, string, error)
	GenerateTextUsingTextModelStream(input *InputForGenerateTextUsingTextModelStream)
	GenerateTextUsingChatModelStream(input *InputForGenerateTextUsingChatModelStream)
	// EditText(input string, instruction string) (interface{}, error)
}

type ImageGenerativeModel interface {
	ConfigGenerativeModel
	GenerateImage(model string, nOfImages int32, prompt string) ([]models.GeneratedImage, error)
	GenerateVariation(model string, image *os.File, nOfImages int32) ([]models.GeneratedImage, error)
}

type ChatGenerativeModel interface {
	ConfigGenerativeModel
	// GenerateResponse(model string, temperature float32, chat models.Chat, chatRepo repositories.ChatRepository) (*models.Chat, error)
	GenerateResponse(input *GenerateChatResponse) ([]models.Message, error)
	// GenerateStreamingResponse(userID uint, chatID *uint, model string, temperature float32, messages []models.Message, dataChan chan<- string, errChan chan<- error, chatRepo repositories.ChatRepository, pubsubClient pubsub.PubSub)
	GenerateStreamingResponse(data *GenerateChatResponseStream)
	GenerateStreamingResponseForPersona(userID, personaID uint, chatID *uint, model string, messages []models.Message, personaRepo repositories.PersonaRepository, dataChan chan<- string, errChan chan<- error, pubsubClient pubsub.PubSub)
	GenerateChatTitle(message models.Message) (string, error)
	// GenerateStreamingResponseUsingSSE(userID uint, chatID *uint, model string, temperature float32, messages []models.Message, dataChan chan<- string, errChan chan<- error, chatRepo repositories.ChatRepository)
}

func NewTextGenerativeModel(provider string) TextGenerativeModel {
	switch provider {
	// case "anthropic":
	// 	return NewAnthropicAdapter()
	default:
		return NewOpenAIAdapter()
	}
}

func NewImageGenerativeModel(provider string) ImageGenerativeModel {
	switch provider {
	case "stableDiffusion":
		return NewStableDiffusionAdapter()
	default:
		return NewOpenAIAdapter()
	}
}

func NewChatGenerativeModel(provider string) ChatGenerativeModel {
	switch provider {
	case "anthropic":
		return NewAnthropicAdapter()
	case "google":
		return NewGoogleAdapter()
	default:
		return NewOpenAIAdapter()
	}
}
