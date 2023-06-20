package persona

import (
	"errors"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
)

func (r *PGPersonaRepository) CreatePersona(userID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY, is_default *bool) (*models.Persona, error) {

	// if visibility is nil, set it to private
	if visibility == nil {
		visibility = new(models.VISIBILITY)
		*visibility = models.VISIBILITY_PRIVATE
	} else {
		valid := models.ValidateVisibility(*visibility)
		if !valid {
			return nil, &custom_errors.CustomError{Context: custom_errors.InvalidVisibility, Err: errors.New("invalid visibility")}
		}
	}

	exists := r.PersonaNameExists(name, nil)
	if exists {
		return nil, custom_errors.ErrNameExists
	}

	if model == "" {
		model = "gpt-4"
	}

	var defaultPersona bool

	if is_default == nil {
		defaultPersona = false
	} else {
		defaultPersona = *is_default
	}

	persona := models.Persona{
		Base: models.Base{
			CreatedByID: userID,
		},
		Provider:    "openai",
		Name:        name,
		Description: description,
		Prompt:      prompt,
		Avatar:      avatar,
		Visibility:  *visibility,
		Model:       model,
		IsDefault:   defaultPersona,
	}
	err := r.client.Create(&persona).Error
	if err != nil {
		return nil, err
	}
	return &persona, nil
}
