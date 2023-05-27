package persona

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGPersonaRepository) GetPersonaByID(userID, personaID uint) (*models.Persona, error) {
	persona := &models.Persona{}
	err := p.client.Model(&models.Persona{}).Where("created_by_id = ? AND id = ?", userID, personaID).Or(
		"id = ? AND visibility = ?", personaID, models.VISIBILITY_PUBLIC).First(&persona).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.PersonaNotFound
		}
		return nil, err
	}
	return persona, nil
}
