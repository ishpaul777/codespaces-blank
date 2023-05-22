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
			return custom_errors.PromptTemplateNotFound
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
