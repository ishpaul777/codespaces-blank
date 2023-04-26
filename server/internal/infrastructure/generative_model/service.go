package generative_model

import (
	"os"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
)

type TextGenerativeModel interface {
	LoadConfig() error
	GenerateText(prompt string, maxTokens uint) (interface{}, string, error)
	EditText(input string, instruction string) (interface{}, error)
}

type ImageGenerativeModel interface {
	LoadConfig() error
	GenerateImage(model string, nOfImages int32, prompt string) ([]models.GeneratedImage, error)
	GenerateVariation(model string, image *os.File, nOfImages int32) ([]models.GeneratedImage, error)
}

type ChatGenerativeModel interface {
	LoadConfig() error
	GenerateResponse(model string, messages []models.Message) ([]models.Message, *models.Usage, error)
	GenerateStreamingResponse(model string, chat models.Chat, dataChan chan<- string, errChan chan<- error, chatRepo repositories.ChatRepository)
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
	default:
		return NewOpenAIAdapter()
	}
}
