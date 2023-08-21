package documents

import (
	"github.com/factly/tagore/server/internal/domain/models"
)

func (p *PGDocumentRepository) GetAllDocuments(req *models.GetAllDocumentReq) ([]models.Document, uint, error) {
	documents := []models.Document{}
	var total int64

	offset := (req.Page - 1) * req.Limit
	if offset < 0 {
		offset = 0
	}

	db := p.client.Model(&models.Document{}).Where("created_by_id = ?", req.UserID)

	if req.SearchQuery != "" {
		db = db.Where("title ILIKE ?", "%"+req.SearchQuery+"%")
	}

	err := db.Count(&total).Offset(offset).Limit(req.Limit).Order("updated_at " + req.Queries["sort"]).Find(&documents).Error
	if err != nil {
		return nil, 0, err
	}

	return documents, uint(total), nil
}
