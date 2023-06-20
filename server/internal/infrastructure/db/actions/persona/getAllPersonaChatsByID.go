package persona

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

func (p *PGPersonaRepository) GetAllPersonaChatsByUserID(userID, personaID uint, pagination helper.Pagination) ([]models.PersonaChat, uint, error) {
	var total int64
	personaChats := make([]models.PersonaChat, 0)
	offset := (pagination.Page - 1) * pagination.Limit

	if offset < 0 {
		offset = 0
	}

	db := p.client.Model(&models.PersonaChat{}).Where("persona_id = ? AND created_by_id = ?", personaID, userID).Order("updated_at " + pagination.Queries["sort"])
	if pagination.SearchQuery != "" {
		db = db.Where("title ILIKE ?", "%"+pagination.SearchQuery+"%")
	}

	err := db.Count(&total).Offset(offset).Limit(pagination.Limit).Find(&personaChats).Error

	if err != nil {
		return nil, 0, err
	}

	return personaChats, uint(total), nil
}
