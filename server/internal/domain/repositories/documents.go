package repositories

import "github.com/factly/tagore/server/internal/domain/models"

type DocumentRepository interface {
	GetDocumentsByUserID(userID uint) ([]models.Document, error)
	CreateDocument(userID uint, slug, description string) (*models.Document, error)
	DeleteDocumentByID(id uint) error
	GetDocumentByID(documentID uint) (models.Document, error)
}
