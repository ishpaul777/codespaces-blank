package documents

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/x/slugx"
)

func (p *PGDocumentRepository) CreateDocument(userID uint, title, description string) (*models.Document, error) {
	slug := slugx.Make(title)
	newDocument := &models.Document{
		Base: models.Base{
			CreatedByID: userID,
		},
		Title:       title,
		Description: description,
		Slug:        slug,
	}

	err := p.client.Model(&models.Document{}).Create(&newDocument).Error
	if err != nil {
		return nil, err
	}
	return newDocument, nil
}
