package repositories

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/documents"
)

type DocumentRepository interface {
	// GetDocumentsByUserID(userID uint) ([]models.Document, error)
	CreateDocument(userID uint, title, description string) (*models.Document, error)
	// DeleteDocumentByID(id uint) error
	// GetDocumentByID(documentID uint) (models.Document, error)
}

func NewDocumentRepository(database db.IDatabaseService) (DocumentRepository, error) {
	return documents.NewPGDocumentRepository(database)
}
