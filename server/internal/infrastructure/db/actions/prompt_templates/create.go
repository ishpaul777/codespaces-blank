package prompt_templates

import (
	"errors"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
)

func (p *PGPromptTemplateRepository) CreatePromptTemplate(userID uint, title, description, prompt string, collection_id *uint) (*models.PromptTemplate, error) {
	exists := p.PromptTemplateTitleExists(title, nil)

	if exists {
		return nil, custom_errors.ErrNameExists
	}

	if collection_id != nil {
		// check whether collection exists
		collectionExists := p.PromptTemplateCollectionExists(*collection_id)
		if !collectionExists {
			return nil, &custom_errors.CustomError{Context: custom_errors.InnerEntityNotFound, Err: errors.New("prompt template collection not found")}
		}
	}

	newPromptTemplate := &models.PromptTemplate{
		Base: models.Base{
			CreatedByID: userID,
		},
		Title:                      title,
		Description:                description,
		Prompt:                     prompt,
		PromptTemplateCollectionID: collection_id,
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

	exists := p.PromptTemplateCollectionNameExists(name, nil)

	if exists {
		return nil, custom_errors.ErrNameExists
	}

	err := p.client.Model(&models.PromptTemplateCollection{}).Create(&newPromptTemplateCollection).Error
	if err != nil {
		return nil, err
	}
	return newPromptTemplateCollection, nil
}
