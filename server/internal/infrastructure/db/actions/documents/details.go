package documents

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGDocumentRepository) GetDocumentByID(userID uint, documentID uint) (*models.Document, error) {
	document := &models.Document{}
	err := p.client.Model(&models.Document{}).Where("created_by_id = ? AND id = ?", userID, documentID).First(document).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.ErrNotFound
		}
		return nil, err
	}
	return document, nil
}
