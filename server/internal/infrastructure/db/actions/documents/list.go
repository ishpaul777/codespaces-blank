package documents

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

func (p *PGDocumentRepository) GetAllDocuments(userID uint, pagination helper.Pagination) ([]models.Document, uint, error) {
	documents := []models.Document{}
	var total int64

	offset := (pagination.Page - 1) * pagination.Limit
	if offset < 0 {
		offset = 0
	}

	db := p.client.Model(&models.Document{}).Where("created_by_id = ?", userID)

	if pagination.SearchQuery != "" {
		db = db.Where("title ILIKE ?", "%"+pagination.SearchQuery+"%")
	}

	err := db.Count(&total).Offset(offset).Limit(pagination.Limit).Find(&documents).Error
	if err != nil {
		return nil, 0, err
	}

	return documents, uint(total), nil
}
