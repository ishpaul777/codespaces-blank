package documents

import (
	"errors"
	"fmt"

	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

var (
	// ErrDocumentNotFound is returned when the document is not found
	ErrDocumentNotFound = errors.New("document not found")
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
			fmt.Printf("I am here")
			return ErrDocumentNotFound
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
