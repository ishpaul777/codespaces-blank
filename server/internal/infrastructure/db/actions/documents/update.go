package documents

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/x/slugx"
	"gorm.io/gorm"
)

func (p *PGDocumentRepository) UpdateDocumentByID(req *models.UpdateDocumentReq) (*models.Document, error) {
	var count int64
	err := p.client.Model(&models.Document{}).Where(&models.Document{Title: req.Title}).Not("id = ?", req.DocumentID).Count(&count).Error
	if err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, custom_errors.ErrNameExists
	}
	updateMap := map[string]interface{}{}
	if req.Title != "" {
		updateMap["title"] = req.Title
		updateMap["slug"] = slugx.Make(req.Title)
	}

	if req.Description != "" {
		updateMap["description"] = req.Description
	}

	err = p.client.Model(&models.Document{}).Where("created_by_id = ? AND id = ?", req.UserID, req.DocumentID).Updates(&updateMap).Error
	if err != nil {
		return nil, err
	}

	document := &models.Document{}
	err = p.client.Model(&models.Document{}).Where("created_by_id = ? AND id = ?", req.UserID, req.DocumentID).First(&document).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.ErrNotFound
		} else {
			return nil, err
		}
	}

	return document, nil
}
