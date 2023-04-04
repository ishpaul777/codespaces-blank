package repositories

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/documents"
	"github.com/factly/tagore/server/pkg/helper"
)

type DocumentRepository interface {
	// CreateDocument creates a new document
	CreateDocument(userID uint, title, description string) (*models.Document, error)
	// DeleteDocumentByID deletes a document by id
	DeleteDocumentByID(userID, documentID uint) error
	// GetAllDocuments gets all documents for a user with pagination
	GetAllDocuments(userID uint, pagination helper.Pagination) ([]models.Document, uint, error)
	// GetDocumentByID gets a document by id
	GetDocumentByID(userID uint, documentID uint) (*models.Document, error)
	// UpdateDocumentByID updates a document by id
	UpdateDocumentByID(userID uint, documentID uint, title string, description string) (*models.Document, error)
}

func NewDocumentRepository(database db.IDatabaseService) (DocumentRepository, error) {
	return documents.NewPGDocumentRepository(database)
}
