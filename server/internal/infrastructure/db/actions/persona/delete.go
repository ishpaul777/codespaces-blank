package persona

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGPersonaRepository) DeletePersonaByID(userID, personaID uint) error {
	personaToBeDeleted := &models.Persona{
		Base: models.Base{
			ID: personaID,
		},
	}
	err := p.client.Model(&models.Persona{}).Where("created_by_id = ? AND id = ?", userID, personaID).First(&personaToBeDeleted).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.ErrNotFound
		}
		return err
	}

	err = p.client.Delete(personaToBeDeleted).Error

	if err != nil {
		return err
	}

	return nil
}
