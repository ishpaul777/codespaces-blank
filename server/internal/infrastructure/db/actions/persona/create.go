package persona

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
)

func (r *PGPersonaRepository) CreatePersona(userID uint, name, description, prompt, avatar string, visibility models.VISIBILITY) (*models.Persona, error) {

	valid := models.ValidateVisibility(visibility)
	if !valid {
		return nil, custom_errors.PersonaVisibilityInvalid
	}

	exists := r.PersonaNameExists(name)
	if exists {
		return nil, custom_errors.PersonaNameExists
	}

	persona := models.Persona{
		Base: models.Base{
			CreatedByID: userID,
		},
		Name:        name,
		Description: description,
		Prompt:      prompt,
		Avatar:      avatar,
		Visibility:  visibility,
	}
	err := r.client.Create(&persona).Error
	if err != nil {
		return nil, err
	}
	return &persona, nil
}
