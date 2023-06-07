package persona

import (
	"github.com/factly/tagore/server/internal/domain/models"
)

func (p *PGPersonaRepository) GetAllDefaultPersonas() ([]models.Persona, error) {
	var personas []models.Persona

	// fetch default personas
	err := p.client.Model(&models.Persona{}).Where("is_default = ?", true).Find(&personas).Error
	if err != nil {
		return nil, err
	}
	return personas, nil
}
