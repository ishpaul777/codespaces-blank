package services

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/pkg/helper"
)

type DocumentService interface {
	CreateNewDocument(userID uint, title, description string) (*models.Document, error)
	DeleteDocumentByID(userID, documentID uint) error
	GetAllDocuments(userID uint, pagination helper.Pagination) ([]models.Document, uint, error)
	GetDocumentByID(userID uint, documentID uint) (*models.Document, error)
	UpdateDocumentByID(userID uint, documentID uint, title string, description string) (*models.Document, error)
}

type documentService struct {
	documentRepository repositories.DocumentRepository
}

func NewDocumentService(documentRepository repositories.DocumentRepository) DocumentService {
	return &documentService{documentRepository}
}

func (s *documentService) CreateNewDocument(userID uint, title, description string) (*models.Document, error) {
	return s.documentRepository.CreateDocument(userID, title, description)
}

func (s *documentService) GetAllDocuments(userID uint, pagination helper.Pagination) ([]models.Document, uint, error) {
	return s.documentRepository.GetAllDocuments(userID, pagination)
}

func (s *documentService) GetDocumentByID(userID uint, documentID uint) (*models.Document, error) {
	return s.documentRepository.GetDocumentByID(userID, documentID)
}

func (s *documentService) DeleteDocumentByID(userID, documentID uint) error {
	return s.documentRepository.DeleteDocumentByID(userID, documentID)
}

func (s *documentService) UpdateDocumentByID(userID uint, documentID uint, title string, description string) (*models.Document, error) {
	return s.documentRepository.UpdateDocumentByID(userID, documentID, title, description)
}
