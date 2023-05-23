package persona

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGPersonaRepository) UpdatePersonaByID(userID, personaID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY) (*models.Persona, error) {

	if p.PersonaNameExists(name) {
		return nil, custom_errors.PersonaNameExists
	}
	updateMap := map[string]interface{}{}

	if name != "" {
		updateMap["name"] = name
	}

	if description != "" {
		updateMap["description"] = description
	}

	if prompt != "" {
		updateMap["prompt"] = prompt
	}

	if avatar != "" {
		updateMap["avatar"] = avatar
	}

	if model != "" {
		updateMap["model"] = model
	}

	if visibility != nil {
		valid := models.ValidateVisibility(*visibility)
		if !valid {
			return nil, custom_errors.PersonaVisibilityInvalid
		}
		updateMap["visibility"] = visibility
	}

	persona := &models.Persona{}
	err := p.client.Model(&models.Persona{}).Where("created_by_id = ? AND id = ?", userID, personaID).Updates(updateMap).First(persona).Error

	if err != nil {

		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.PersonaNotFound
		}
		return nil, err
	}

	return persona, nil

}
