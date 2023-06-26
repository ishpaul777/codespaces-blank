package generative_model

import (
	"os"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
)

type ConfigGenerativeModel interface {
	LoadConfig() error
}

type TextGenerativeModel interface {
	ConfigGenerativeModel
	GenerateTextUsingTextModel(prompt, model string, maxTokens uint) (interface{}, string, error)
	GenerateTextUsingChatModel(prompt, model, additionalInstructions string, maxTokens uint) (interface{}, string, error)
	GenerateTextUsingTextModelStream(model string, prompt string, maxTokens uint, dataChan chan<- string, errChan chan<- error)
	GenerateTextUsingChatModelStream(model string, prompt string, maxTokens uint, additionalInstructions string, dataChan chan<- string, errChan chan<- error)
	EditText(input string, instruction string) (interface{}, error)
}

type ImageGenerativeModel interface {
	ConfigGenerativeModel
	GenerateImage(model string, nOfImages int32, prompt string) ([]models.GeneratedImage, error)
	GenerateVariation(model string, image *os.File, nOfImages int32) ([]models.GeneratedImage, error)
}

type ChatGenerativeModel interface {
	ConfigGenerativeModel
	// GenerateResponse(model string, temperature float32, chat models.Chat, chatRepo repositories.ChatRepository) (*models.Chat, error)
	GenerateResponse(model string, temperature float32, messages []models.Message) ([]models.Message, *models.Usage, error)
	GenerateStreamingResponse(userID uint, chatID *uint, model string, temperature float32, messages []models.Message, dataChan chan<- string, errChan chan<- error, chatRepo repositories.ChatRepository)
	GenerateStreamingResponseForPersona(userID, personaID uint, chatID *uint, model string, messages []models.Message, personaRepo repositories.PersonaRepository, dataChan chan<- string, errChan chan<- error)
	GenerateChatTitle(message models.Message) (string, error)
	// GenerateStreamingResponseUsingSSE(userID uint, chatID *uint, model string, temperature float32, messages []models.Message, dataChan chan<- string, errChan chan<- error, chatRepo repositories.ChatRepository)
}

func NewTextGenerativeModel(provider string) TextGenerativeModel {
	switch provider {
	case "openai":
		return NewOpenAIAdapter()
	default:
		return NewOpenAIAdapter()
	}
}

func NewImageGenerativeModel(provider string) ImageGenerativeModel {
	switch provider {
	case "openai":
		return NewOpenAIAdapter()
	case "stableDiffusion":
		return NewStableDiffusionAdapter()
	default:
		return NewOpenAIAdapter()
	}
}

func NewChatGenerativeModel(provider string) ChatGenerativeModel {
	switch provider {
	case "openai":
		return NewOpenAIAdapter()
	case "anthropic":
		return NewAnthropicAdapter()
	default:
		return NewOpenAIAdapter()
	}
}
