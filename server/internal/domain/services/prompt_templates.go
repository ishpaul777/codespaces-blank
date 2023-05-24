package services

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/pkg/helper"
)

type PromptTemplateService interface {
	CreateNewPromptTemplate(userID uint, title, description, prompt string, collection_id *uint) (*models.PromptTemplate, error)
	DeletePromptTemplateByID(userID, promptTemplateID uint) error
	GetAllPromptTemplates(userID uint, pagination helper.Pagination) ([]models.PromptTemplate, uint, error)
	GetPromptTemplateByID(userID uint, promptTemplateID uint) (*models.PromptTemplate, error)
	UpdatePromptTemplateByID(userID uint, promptTemplateID uint, title string, description string, prompt string, collection_id *uint) (*models.PromptTemplate, error)
	CreateNewPromptTemplateCollection(userID uint, name string) (*models.PromptTemplateCollection, error)
	DeletePromptTemplateCollectionByID(userID, promptTemplateCollectionID uint) error
	GetAllPromptTemplateCollections(userID uint, pagination helper.Pagination) ([]models.PromptTemplateCollection, uint, error)
	GetPromptTemplateCollectionByID(userID uint, promptTemplateCollectionID uint) (*models.PromptTemplateCollection, error)
	UpdatePromptTemplateCollectionByID(userID uint, promptTemplateCollectionID uint, name string) (*models.PromptTemplateCollection, error)
}

type promptTemplateService struct {
	promptTemplateRepository repositories.PromptTemplateRepository
}

// CreateNewPromptTemplate implements PromptTemplateService
func (ps *promptTemplateService) CreateNewPromptTemplate(userID uint, title string, description string, prompt string, collection_id *uint) (*models.PromptTemplate, error) {
	return ps.promptTemplateRepository.CreatePromptTemplate(userID, title, description, prompt, collection_id)
}

// DeletePromptTemplateByID implements PromptTemplateService
func (ps *promptTemplateService) DeletePromptTemplateByID(userID uint, promptTemplateID uint) error {
	return ps.promptTemplateRepository.DeletePromptTemplateByID(userID, promptTemplateID)
}

// GetAllPromptTemplateByID implements PromptTemplateService
func (ps *promptTemplateService) GetPromptTemplateByID(userID uint, promptTemplateID uint) (*models.PromptTemplate, error) {
	return ps.promptTemplateRepository.GetPromptTemplateByID(userID, promptTemplateID)
}

// GetAllPromptTemplates implements PromptTemplateService
func (ps *promptTemplateService) GetAllPromptTemplates(userID uint, pagination helper.Pagination) ([]models.PromptTemplate, uint, error) {
	return ps.promptTemplateRepository.GetAllPromptTemplates(userID, pagination)
}

// UpdatePromptTemplateByID implements PromptTemplateService
func (ps *promptTemplateService) UpdatePromptTemplateByID(userID uint, promptTemplateID uint, title string, description string, prompt string, collection_id *uint) (*models.PromptTemplate, error) {
	return ps.promptTemplateRepository.UpdatePromptTemplateByID(userID, promptTemplateID, title, description, prompt, collection_id)
}

func (ps *promptTemplateService) CreateNewPromptTemplateCollection(userID uint, name string) (*models.PromptTemplateCollection, error) {
	return ps.promptTemplateRepository.CreatePromptTemplateCollection(userID, name)
}

func (ps *promptTemplateService) DeletePromptTemplateCollectionByID(userID uint, promptTemplateCollectionID uint) error {
	return ps.promptTemplateRepository.DeletePromptTemplateCollectionByID(userID, promptTemplateCollectionID)
}

func (ps *promptTemplateService) GetAllPromptTemplateCollections(userID uint, pagination helper.Pagination) ([]models.PromptTemplateCollection, uint, error) {
	return ps.promptTemplateRepository.GetAllPromptTemplateCollections(userID, pagination)
}

func (ps *promptTemplateService) GetPromptTemplateCollectionByID(userID uint, promptTemplateCollectionID uint) (*models.PromptTemplateCollection, error) {
	return ps.promptTemplateRepository.GetPromptTemplateCollectionByID(userID, promptTemplateCollectionID)
}

func (ps *promptTemplateService) UpdatePromptTemplateCollectionByID(userID uint, promptTemplateCollectionID uint, name string) (*models.PromptTemplateCollection, error) {
	return ps.promptTemplateRepository.UpdatePromptTemplateCollectionByID(userID, promptTemplateCollectionID, name)
}

func NewPromptTemplateService(repository repositories.PromptTemplateRepository) PromptTemplateService {
	return &promptTemplateService{
		promptTemplateRepository: repository,
	}
}
