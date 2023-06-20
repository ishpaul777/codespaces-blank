package prompt_templates

import (
	"errors"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (pg *PGPromptTemplateRepository) AddPromptTemplateToCollection(userID uint, PromptTemplateID uint, PromptTemplateCollectionID uint) error {
	// check if prompt template exists
	promptTemplate := &models.PromptTemplate{}
	err := pg.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, PromptTemplateID).First(promptTemplate).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.ErrNotFound
		}
		return err
	}

	// check if prompt template collection exists
	var count int64
	err = pg.client.Model(&models.PromptTemplateCollection{}).Where("created_by_id = ? AND id = ?", userID, PromptTemplateCollectionID).Count(&count).Error

	if err != nil {
		return err
	}

	if count == 0 {
		return &custom_errors.CustomError{Context: custom_errors.InnerEntityNotFound, Err: errors.New("Prompt Template Collection Not Found")}
	}

	// update prompt template collection id
	promptTemplate.PromptTemplateCollectionID = &PromptTemplateCollectionID

	err = pg.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, PromptTemplateID).Updates(promptTemplate).Error

	if err != nil {
		return err
	}

	return nil
}
