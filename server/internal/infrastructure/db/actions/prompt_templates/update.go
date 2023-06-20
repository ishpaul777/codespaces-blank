package prompt_templates

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGPromptTemplateRepository) UpdatePromptTemplateByID(userID, promptTemplateID uint, title, description, prompt string) (*models.PromptTemplate, error) {

	exists := p.PromptTemplateTitleExists(title, &promptTemplateID)
	if exists {
		return nil, custom_errors.ErrNameExists
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

	promptTemplate := &models.PromptTemplate{}
	err := p.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, promptTemplateID).Updates(updateMap).First(promptTemplate).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.ErrNotFound
		}
		return nil, err
	}

	return promptTemplate, nil
}

func (p *PGPromptTemplateRepository) UpdatePromptTemplateCollectionByID(userID, tempColID uint, name string) (*models.PromptTemplateCollection, error) {
	exists := p.PromptTemplateCollectionNameExists(name, &tempColID)

	if exists {
		return nil, custom_errors.ErrNameExists
	}

	updateMap := map[string]interface{}{}

	if name != "" {
		updateMap["name"] = name
	}

	tempCol := &models.PromptTemplateCollection{}
	err := p.client.Model(&models.PromptTemplateCollection{}).Where("created_by_id = ? AND id = ?", userID, tempColID).Updates(updateMap).First(tempCol).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.ErrNotFound
		}
		return nil, err
	}

	return tempCol, nil
}
