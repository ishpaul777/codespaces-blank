package services

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

type PromptTemplateService interface {
	CreateNewPromptTemplate(userID uint, title, description, prompt string) (*models.PromptTemplate, error)
	DeletePromptTemplateByID(userID, PromptTemplateID uint) error
	GetAllPromptTemplates(userID uint, pagination helper.Pagination) ([]models.PromptTemplate, uint, error)
	GetAllPromptTemplateByID(userID uint, PromptTemplateID uint) (*models.PromptTemplate, error)
	UpdatePromptTemplateByID(userID uint, PromptTemplateID uint, title string, description string, prompt string) (*models.PromptTemplate, error)
}
