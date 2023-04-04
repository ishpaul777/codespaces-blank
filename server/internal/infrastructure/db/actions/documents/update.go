package documents

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/x/slugx"
	"gorm.io/gorm"
)

func (p *PGDocumentRepository) UpdateDocumentByID(userID uint, documentID uint, title string, description string) (*models.Document, error) {
	updateMap := map[string]interface{}{}
	if title != "" {
		updateMap["title"] = title
		updateMap["slug"] = slugx.Make(title)
	}

	if description != "" {
		updateMap["description"] = description
	}

	err := p.client.Model(&models.Document{}).Where("created_by_id = ? AND id = ?", userID, documentID).Updates(&updateMap).Error
	if err != nil {
		return nil, err
	}

	document := &models.Document{}
	err = p.client.Model(&models.Document{}).Where("created_by_id = ? AND id = ?", userID, documentID).First(&document).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrDocumentNotFound
		} else {
			return nil, err
		}
	}

	return document, nil
}
