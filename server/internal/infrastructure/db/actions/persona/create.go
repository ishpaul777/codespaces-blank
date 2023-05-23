package persona

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
)

func (r *PGPersonaRepository) CreatePersona(userID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY) (*models.Persona, error) {

	// if visibility is nil, set it to private
	if visibility == nil {
		visibility = new(models.VISIBILITY)
		*visibility = models.VISIBILITY_PRIVATE
	} else {
		valid := models.ValidateVisibility(*visibility)
		if !valid {
			return nil, custom_errors.PersonaVisibilityInvalid
		}
	}

	exists := r.PersonaNameExists(name)
	if exists {
		return nil, custom_errors.PersonaNameExists
	}

	if model == "" {
		model = "gpt-3.5-turbo"
	}

	persona := models.Persona{
		Base: models.Base{
			CreatedByID: userID,
		},
		Name:        name,
		Description: description,
		Prompt:      prompt,
		Avatar:      avatar,
		Visibility:  *visibility,
		Model:       model,
	}
	err := r.client.Create(&persona).Error
	if err != nil {
		return nil, err
	}
	return &persona, nil
}
