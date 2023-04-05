package generative_model

import "github.com/factly/tagore/server/internal/domain/models"

type GenerativeModel interface {
	LoadConfig() error
	GenerateText(prompt string, maxTokens uint) (interface{}, string, error)
	EditText(input string, instruction string) (interface{}, error)
	GenerateImage(nOfImages int32, prompt string) ([]models.GeneratedImage, error)
	// GenerateImage(prompt string)
}

func New(model string) GenerativeModel {
	switch model {
	case "openai":
		return NewOpenAIAdapter()
	default:
		return NewOpenAIAdapter()
	}
}
