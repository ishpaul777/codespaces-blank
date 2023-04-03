package services

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
)

type DocumentService interface {
	CreateNewDocument(userID uint, title, description string) (*models.Document, error)
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
