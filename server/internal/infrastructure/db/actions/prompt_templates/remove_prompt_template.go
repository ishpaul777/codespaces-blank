package prompt_templates

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (pg *PGPromptTemplateRepository) RemovePromptTemplateFromCollection(userID uint, PromptTemplateID uint) error {
	// check if prompt template exists
	promptTemplate := &models.PromptTemplate{}
	if err := pg.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, PromptTemplateID).First(promptTemplate).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.PromptTemplateNotFound
		}
		return err
	}

	// update prompt template collection id to nil
	promptTemplate.PromptTemplateCollectionID = nil

	err := pg.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, PromptTemplateID).Updates(map[string]interface{}{"prompt_template_collection_id": nil}).First(promptTemplate).Error

	if err != nil {
		return err
	}

	return nil
}
