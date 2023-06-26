package documents

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGDocumentRepository) DeleteDocumentByID(userID, documentID uint) error {
	// documentToBeDeleted stores the reference to the document to be deleted
	documentToBeDeleted := &models.Document{
		Base: models.Base{
			ID: documentID,
		},
	}

	err := p.client.Model(&models.Document{}).Where("created_by_id = ? AND id = ?", userID, documentID).First(&documentToBeDeleted).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.ErrNotFound
		} else {
			return err
		}
	}

	err = p.client.Delete(documentToBeDeleted).Error
	if err != nil {
		return err
	}

	return nil
}
