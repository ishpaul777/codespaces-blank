package services

import (
	"fmt"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
)

type PromptService interface {
	GenerateText(provider string, userID uint, input, generateFor, additionalInstructions string, maxTokens uint) (*models.GenerateTextResponse, error)
	GenerateTextStream(provider, model string, userID uint, input, generateFor, additionalInstructions string, maxTokens uint, dataChan chan<- string, errChan chan<- error)
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
		"Blog Post":         "```I want you to act as an essay writer. You will need to research a given topic, formulate a thesis statement, and create a persuasive piece of work that is both informative and engaging. Write a essay on %s.```",
		"Brainstorm":        "Brainstorm ideas on ",
		"Outline":           "Write an outline about for ",
		"Social Media Post": "Write a social media post about ",
		"Essay":             "Write an essay about ",
		"Job Description":   "Write a job description for ",
		"Poem":              "Write a poem about ",
	}
	if value, ok := promptObject[generateFor]; ok {
		return value
	}

	return "Generate Text for given input."
}

func constructPrompt(input, generateFor, additionalInstructions string) string {
	prompt := fmt.Sprintf(GetPromptPrefix(generateFor), input)
	fmt.Println("this is main ", generateFor)
	if prompt != "" {
		prompt += ". " + additionalInstructions
	}
	return prompt
}

func (p *promptService) GenerateText(provider string, userID uint, input, generateFor, additionalInstructions string, maxTokens uint) (*models.GenerateTextResponse, error) {
	if provider == "" {
		provider = "openai"
	}

	generativeModel := generative_model.NewTextGenerativeModel(provider)

	err := generativeModel.LoadConfig()
	if err != nil {
		return nil, err
	}

	prompt := constructPrompt(input, generateFor, additionalInstructions)
	fmt.Println(prompt)
	output, finishReason, err := generativeModel.GenerateText(prompt, maxTokens)
	if err != nil {
		return nil, err
	}

	return &models.GenerateTextResponse{
		Output:       output.(string),
		FinishReason: finishReason,
	}, nil

	// return p.promptRepository.CreatePrompt(userID, input, output.(string), finishReason)
}

func (p *promptService) GenerateTextStream(provider, model string, userID uint, input, generateFor, additionalInstructions string, maxTokens uint, dataChan chan<- string, errChan chan<- error) {
	if provider == "" {
		provider = "openai"
	}
	generativeModel := generative_model.NewTextGenerativeModel(provider)

	err := generativeModel.LoadConfig()
	if err != nil {
		errChan <- err
		return
	}

	prompt := constructPrompt(input, generateFor, additionalInstructions)
	fmt.Println(prompt)
	generativeModel.GenerateTextStream(model, prompt, maxTokens, dataChan, errChan)
}
