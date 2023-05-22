package persona

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGPersonaRepository) PersonaNameExists(name string) bool {
	err := p.client.Model(&models.Persona{}).Where("name = ?", name).First(&models.Persona{}).Error
	if err != nil {
		return false
	}
	return true
}
