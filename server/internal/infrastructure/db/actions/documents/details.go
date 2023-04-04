package documents

import (
	"github.com/factly/tagore/server/internal/domain/models"
)

func (p *PGDocumentRepository) GetDocumentByID(userID uint, documentID uint) (*models.Document, error) {
	document := &models.Document{}
	err := p.client.Model(&models.Document{}).Where("created_by_id = ? AND id = ?", userID, documentID).First(document).Error
	if err != nil {
		return nil, err
	}
	return document, nil
}
