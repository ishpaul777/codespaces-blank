package generative_model

import (
	"os"

	"github.com/factly/tagore/server/internal/domain/models"
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
