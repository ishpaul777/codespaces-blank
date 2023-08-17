package persona

import (
	"errors"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
)

func (r *PGPersonaRepository) CreatePersona(input *models.InputForCreatePersona) (*models.Persona, error) {

	// if visibility is nil, set it to private
	if input.Visbility == nil {
		input.Visbility = new(models.VISIBILITY)
		*input.Visbility = models.VISIBILITY_PRIVATE
	} else {
		valid := models.ValidateVisibility(*input.Visbility)
		if !valid {
			return nil, &custom_errors.CustomError{Context: custom_errors.InvalidVisibility, Err: errors.New("invalid visibility")}
		}
	}

	exists := r.PersonaNameExists(input.Name, nil)
	if exists {
		return nil, custom_errors.ErrNameExists
	}

	if input.Model == "" {
		input.Model = "gpt-4"
	}

	var defaultPersona bool

	defaultPersona = false
	if input.IsDefault == nil {
	} else {
		defaultPersona = *input.IsDefault
	}

	persona := models.Persona{
		Base: models.Base{
			CreatedByID: input.UserID,
		},
		Provider:    "openai",
		Name:        input.Name,
		Description: input.Description,
		Prompt:      input.Prompt,
		Avatar:      input.Avatar,
		Visibility:  *input.Visbility,
		Model:       input.Model,
		IsDefault:   defaultPersona,
	}
	err := r.client.Create(&persona).Error
	if err != nil {
		return nil, err
	}
	return &persona, nil
}
