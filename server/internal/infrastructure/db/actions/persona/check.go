package persona

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGPersonaRepository) PersonaNameExists(name string, id *uint) bool {
	// check if id is nil or not
	// if nil then create Where clause without id
	// if not nil then create Where clause with id
	query := p.client.Model(&models.Persona{}).Where("name = ?", name)
	if id != nil {
		query = query.Where("id != ?", *id)
	}

	err := query.First(&models.Persona{}).Error

	if err != nil {
		return false
	}
	return true

}
