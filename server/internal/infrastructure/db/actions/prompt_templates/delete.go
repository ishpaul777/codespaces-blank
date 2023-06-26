package prompt_templates

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGPromptTemplateRepository) DeletePromptTemplateByID(userID, promptTemplateID uint) error {
	promptTemplateToBeDeleted := &models.PromptTemplate{
		Base: models.Base{
			ID: promptTemplateID,
		},
	}

	err := p.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, promptTemplateID).First(&promptTemplateToBeDeleted).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.ErrNotFound
		} else {
			return err
		}
	}

	err = p.client.Delete(promptTemplateToBeDeleted).Error

	if err != nil {
		return err
	}

	return nil
}

func (p *PGPromptTemplateRepository) DeletePromptTemplateCollectionByID(userID, templateColID uint) error {

	tempColToBeDeleted := &models.PromptTemplateCollection{
		Base: models.Base{
			ID: templateColID,
		},
	}

	err := p.client.Model(&models.PromptTemplateCollection{}).Where("created_by_id = ? AND id = ?", userID, templateColID).First(&tempColToBeDeleted).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.ErrNotFound
		} else {
			return err
		}
	}
	// delete all prompt templates associated with the prompt template collection
	err = p.client.Model(&models.PromptTemplate{}).Where("prompt_template_collection_id = ?", templateColID).Delete(&models.PromptTemplate{}).Error
	if err != nil {
		return err
	}
	err = p.client.Delete(tempColToBeDeleted).Error

	if err != nil {
		return err
	}

	return nil
}
