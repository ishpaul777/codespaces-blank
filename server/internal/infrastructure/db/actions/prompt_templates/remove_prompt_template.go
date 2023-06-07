package prompt_templates

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (pg *PGPromptTemplateRepository) RemovePromptTemplateFromCollection(userID uint, PromptTemplateID uint, PromptTemplateCollectionID uint) error {
	// check if prompt template exists
	promptTemplate := &models.PromptTemplate{}
	if err := pg.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, PromptTemplateID).First(promptTemplate).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.PromptTemplateNotFound
		}
		return err
	}

	// check if prompt temeplate exists in collection
	if promptTemplate.PromptTemplateCollectionID == nil || promptTemplate.PromptTemplateCollectionID != &PromptTemplateCollectionID {
		return custom_errors.PromptTemplateNotFoundInCollection
	}

	// update prompt template collection id to nil
	promptTemplate.PromptTemplateCollectionID = nil

	err := pg.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, PromptTemplateID).Updates(promptTemplate).Error

	if err != nil {
		return err
	}

	return nil
}
