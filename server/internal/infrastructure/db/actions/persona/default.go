package persona

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

func (p *PGPersonaRepository) GetAllDefaultPersonas(userID uint, pagination helper.Pagination) ([]models.Persona, uint, error) {
	var personas []models.Persona
	var count int64
	offset := (pagination.Page - 1) * pagination.Limit

	if offset < 0 {
		offset = 0
	}

	// fetch default personas
	db := p.client.Model(&models.Persona{}).Where("created_by_id = ? AND is_default = TRUE", userID)

	if pagination.SearchQuery != "" {
		db = db.Where("name ILIKE ?", "%"+pagination.SearchQuery+"%")
	}

	err := db.Count(&count).Offset(offset).Limit(pagination.Limit).Find(&personas).Error

	if err != nil {
		return nil, 0, err
	}

	return personas, uint(count), nil
}
