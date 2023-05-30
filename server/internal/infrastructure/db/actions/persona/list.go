package persona

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

func (p *PGPersonaRepository) GetAllPersonas(userID uint, pagiantion helper.Pagination) ([]models.Persona, uint, error) {
	var personas []models.Persona
	var count int64
	offset := (pagiantion.Page - 1) * pagiantion.Limit

	if offset < 0 {
		offset = 0
	}

	// fetching all the personas created by the user
	// which are private
	db := p.client.Model(&models.Persona{}).Where(&models.Persona{
		Base: models.Base{
			CreatedByID: userID,
		}})

	// fetcing all the personas which are public
	// and created by other users

	if pagiantion.SearchQuery != "" {
		db = db.Where("name ILIKE ?", "%"+pagiantion.SearchQuery+"%")
	}

	if pagiantion.Queries["visibility"] != "" {
		db = db.Where("visibility = ?", pagiantion.Queries["visibility"])
	}

	err := db.Count(&count).Offset(offset).Limit(pagiantion.Limit).Find(&personas).Error

	if err != nil {
		return nil, 0, err
	}

	return personas, uint(count), nil
}
