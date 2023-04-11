package services

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
)

type PromptService interface {
	GenerateText(provider string, userID uint, input, generateFor string, maxTokens uint) (*models.Prompt, error)
}

type promptService struct {
	promptRepository repositories.PromptRepository
}

func NewPromptService(repository repositories.PromptRepository) PromptService {
	return &promptService{
		promptRepository: repository,
	}
}

func GetPromptPrefix(generateFor string) string {
	promptObject := map[string]string{
		"Summary":           "Summarize the text ",
		"Blog Post":         "Write a blog post about ",
		"Brainstorm":        "Brainstorm ideas on ",
		"Outline":           "Write an outline about for ",
		"Social Media Post": "Write a social media post about ",
		"Essay":             "Write an essay about ",
		"Job Description":   "Write a job description for ",
		"Poem":              "Write a poem about ",
	}
	if val, ok := promptObject[generateFor]; ok {
		return val
	}

	return ""
}

func constructPrompt(input, generateFor string) string {
	return GetPromptPrefix(generateFor) + input
}

func (p *promptService) GenerateText(provider string, userID uint, input, generateFor string, maxTokens uint) (*models.Prompt, error) {
	generativeModel := generative_model.NewTextGenerativeModel(provider)

	err := generativeModel.LoadConfig()
	if err != nil {
		return nil, err
	}

	prompt := constructPrompt(input, generateFor)

	output, finishReason, err := generativeModel.GenerateText(prompt, maxTokens)
	if err != nil {
		return nil, err
	}
	return p.promptRepository.CreatePrompt(userID, input, output.(string), finishReason)
}
