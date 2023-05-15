package prompt_templates

import (
	"errors"

	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

var (
	ErrPromptTemplateNotFound = errors.New("prompt template not found")
)

func (p *PGPromptTemplateRepository) DeletePromptTemplateByID(userID, promptTemplateID uint) error {

	promptTemplateTOBeDeleted := &models.PromptTemplate{
		Base: models.Base{
			ID: promptTemplateID,
		},
	}

	err := p.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, promptTemplateID).First(&promptTemplateTOBeDeleted).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return ErrPromptTemplateNotFound
		} else {
			return err
		}
	}

	return nil
}
