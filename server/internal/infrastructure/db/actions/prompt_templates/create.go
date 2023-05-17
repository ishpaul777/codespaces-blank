package prompt_templates

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
)

func (p *PGPromptTemplateRepository) CreatePromptTemplate(userID uint, title, description, prompt string) (*models.PromptTemplate, error) {

	newPromptTemplate := &models.PromptTemplate{
		Base: models.Base{
			CreatedByID: userID,
		},
		Title:       title,
		Description: description,
		Prompt:      prompt,
	}

	exists := p.PromptTemplateTitleExists(title)

	if exists {
		return nil, custom_errors.PromptTemplateTitleExists
	}

	err := p.client.Model(&models.PromptTemplate{}).Create(&newPromptTemplate).Error
	if err != nil {
		return nil, err
	}
	return newPromptTemplate, nil
}

func (p *PGPromptTemplateRepository) CreatePromptTemplateCollection(userID uint, name string) (*models.PromptTemplateCollection, error) {
	newPromptTemplateCollection := &models.PromptTemplateCollection{
		Base: models.Base{
			CreatedByID: userID,
		},
		Name: name,
	}

	exists := p.PromptTemplateCollectionNameExists(name)

	if exists {
		return nil, custom_errors.PromptTemplateCollectionNameExists
	}

	err := p.client.Model(&models.PromptTemplateCollection{}).Create(&newPromptTemplateCollection).Error
	if err != nil {
		return nil, err
	}
	return newPromptTemplateCollection, nil
}
