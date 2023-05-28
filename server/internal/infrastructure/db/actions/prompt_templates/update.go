package prompt_templates

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGPromptTemplateRepository) UpdatePromptTemplateByID(userID, promptTemplateID uint, title, description, prompt string, collection_id *uint) (*models.PromptTemplate, error) {

	if collection_id != nil {
		// check if collection exists
		collectionExists := p.PromptTemplateCollectionExists(*collection_id)

		if !collectionExists {
			return nil, custom_errors.PromptTemplateCollectionNotFound
		}
	}


	updateMap := map[string]interface{}{}

	if title != "" {
		updateMap["title"] = title
	}

	if description != "" {
		updateMap["description"] = description
	}

	if prompt != "" {
		updateMap["prompt"] = prompt
	}

	if collection_id != nil {
		updateMap["prompt_template_collection_id"] = collection_id
	}

	promptTemplate := &models.PromptTemplate{}
	err := p.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, promptTemplateID).Updates(updateMap).First(promptTemplate).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.PromptTemplateNotFound
		}
		return nil, err
	}

	return promptTemplate, nil
}

func (p *PGPromptTemplateRepository) UpdatePromptTemplateCollectionByID(userID, tempColID uint, name string) (*models.PromptTemplateCollection, error) {
	updateMap := map[string]interface{}{}

	if name != "" {
		updateMap["name"] = name
	}

	tempCol := &models.PromptTemplateCollection{}
	err := p.client.Model(&models.PromptTemplateCollection{}).Where("created_by_id = ? AND id = ?", userID, tempColID).Updates(updateMap).First(tempCol).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.PromptTemplateCollectionNotFound
		}
		return nil, err
	}

	return tempCol, nil
}
