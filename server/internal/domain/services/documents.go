package services

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
)

type DocumentService interface {
	CreateNewDocument(req *models.CreateDocumentReq) (*models.Document, error)
	DeleteDocumentByID(userID, documentID uint) error
	GetAllDocuments(req *models.GetAllDocumentReq) ([]models.Document, uint, error)
	GetDocumentByID(userID uint, documentID uint) (*models.Document, error)
	UpdateDocumentByID(req *models.UpdateDocumentReq) (*models.Document, error)
}

type documentService struct {
	documentRepository repositories.DocumentRepository
}

func NewDocumentService(documentRepository repositories.DocumentRepository) DocumentService {
	return &documentService{documentRepository}
}

func (s *documentService) CreateNewDocument(req *models.CreateDocumentReq) (*models.Document, error) {
	return s.documentRepository.CreateDocument(req)
}

func (s *documentService) GetAllDocuments(req *models.GetAllDocumentReq) ([]models.Document, uint, error) {
	return s.documentRepository.GetAllDocuments(req)
}

func (s *documentService) GetDocumentByID(userID uint, documentID uint) (*models.Document, error) {
	return s.documentRepository.GetDocumentByID(userID, documentID)
}

func (s *documentService) DeleteDocumentByID(userID, documentID uint) error {
	return s.documentRepository.DeleteDocumentByID(userID, documentID)
}

func (s *documentService) UpdateDocumentByID(req *models.UpdateDocumentReq) (*models.Document, error) {
	return s.documentRepository.UpdateDocumentByID(req)
}
