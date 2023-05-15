package prompt_templates

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGPromptTemplateRepository) CreatePromptTemplate(userID uint, title, description, prompt string) (*models.PromptTemplate, error) {

	newPromptTemplate := &models.PromptTemplate{
		Base: models.Base{
			CreatedByID: userID,
		},
		Title:       title,
		Description: description,
		Prompt:      prompt,
	}

	err := p.client.Model(&models.PromptTemplate{}).Create(&newPromptTemplate).Error
	if err != nil {
		return nil, err
	}
	return newPromptTemplate, nil
}
