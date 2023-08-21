package repositories

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/documents"
)

type DocumentRepository interface {
	// CreateDocument creates a new document
	CreateDocument(req *models.CreateDocumentReq) (*models.Document, error)
	// DeleteDocumentByID deletes a document by id
	DeleteDocumentByID(userID, documentID uint) error
	// GetAllDocuments gets all documents for a user with pagination
	GetAllDocuments(req *models.GetAllDocumentReq) ([]models.Document, uint, error)
	// GetDocumentByID gets a document by id
	GetDocumentByID(userID uint, documentID uint) (*models.Document, error)
	// UpdateDocumentByID updates a document by id
	UpdateDocumentByID(req *models.UpdateDocumentReq) (*models.Document, error)
}

func NewDocumentRepository(database db.IDatabaseService) (DocumentRepository, error) {
	return documents.NewPGDocumentRepository(database)
}
