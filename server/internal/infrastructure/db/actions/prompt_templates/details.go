package prompt_templates

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGPromptTemplateRepository) GetPromptTemplateByID(userID uint, promptTemplateID uint) (*models.PromptTemplate, error) {
	promptTemplate := &models.PromptTemplate{}
	err := p.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, promptTemplateID).Preload("PromptTemplateCollection").First(promptTemplate).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.ErrNotFound
		}
		return nil, err
	}
	return promptTemplate, nil
}

func (p *PGPromptTemplateRepository) GetPromptTemplateCollectionByID(userID, tempColID uint) (*models.PromptTemplateCollection, error) {
	tempCol := &models.PromptTemplateCollection{}

	err := p.client.Model(&models.PromptTemplateCollection{}).Where("created_by_id = ? AND id = ?", userID, tempColID).Preload("PromptTemplates").First(tempCol).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.ErrNotFound
		}
		return nil, err
	}

	return tempCol, nil
}
