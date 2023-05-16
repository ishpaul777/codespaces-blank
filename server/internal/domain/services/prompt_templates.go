package services

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/pkg/helper"
)

type PromptTemplateService interface {
	CreateNewPromptTemplate(userID uint, title, description, prompt string) (*models.PromptTemplate, error)
	DeletePromptTemplateByID(userID, promptTemplateID uint) error
	GetAllPromptTemplates(userID uint, pagination helper.Pagination) ([]models.PromptTemplate, uint, error)
	GetPromptTemplateByID(userID uint, promptTemplateID uint) (*models.PromptTemplate, error)
	UpdatePromptTemplateByID(userID uint, promptTemplateID uint, title string, description string, prompt string) (*models.PromptTemplate, error)
}

type promptTemplateService struct {
	promptTemplateRepository repositories.PromptTemplateRepository
}

// CreateNewPromptTemplate implements PromptTemplateService
func (ps *promptTemplateService) CreateNewPromptTemplate(userID uint, title string, description string, prompt string) (*models.PromptTemplate, error) {
	return ps.promptTemplateRepository.CreatePromptTemplate(userID, title, description, prompt)
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
func (ps *promptTemplateService) UpdatePromptTemplateByID(userID uint, promptTemplateID uint, title string, description string, prompt string) (*models.PromptTemplate, error) {
	return ps.promptTemplateRepository.UpdatePromptTemplateByID(userID, promptTemplateID, title, description, prompt)
}

func NewPromptTemplateService(repository repositories.PromptTemplateRepository) PromptTemplateService {
	return &promptTemplateService{
		promptTemplateRepository: repository,
	}
}
