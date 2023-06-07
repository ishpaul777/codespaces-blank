package repositories

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/prompt_templates"
	"github.com/factly/tagore/server/pkg/helper"
)

type PromptTemplateRepository interface {
	CreatePromptTemplate(userID uint, title, description, prompt string, collection_id *uint) (*models.PromptTemplate, error)
	DeletePromptTemplateByID(userID, PromptTemplateID uint) error
	GetAllPromptTemplates(userID uint, pagination helper.Pagination) ([]models.PromptTemplate, uint, error)
	GetPromptTemplateByID(userID uint, PromptTemplateID uint) (*models.PromptTemplate, error)
	UpdatePromptTemplateByID(userID uint, PromptTemplateID uint, title string, description string, prompt string) (*models.PromptTemplate, error)
	PromptTemplateTitleExists(title string) bool
	CreatePromptTemplateCollection(userID uint, name string) (*models.PromptTemplateCollection, error)
	DeletePromptTemplateCollectionByID(userID, PromptTemplateCollectionID uint) error
	GetAllPromptTemplateCollections(userID uint, pagination helper.Pagination) ([]models.PromptTemplateCollection, uint, error)
	GetPromptTemplateCollectionByID(userID uint, PromptTemplateCollectionID uint) (*models.PromptTemplateCollection, error)
	UpdatePromptTemplateCollectionByID(userID uint, PromptTemplateCollectionID uint, name string) (*models.PromptTemplateCollection, error)
	PromptTemplateCollectionNameExists(name string) bool
	AddPromptTemplateToCollection(userID uint, PromptTemplateID uint, PromptTemplateCollectionID uint) error
	RemovePromptTemplateFromCollection(userID uint, PromptTemplateID uint, PromptTemplateCollectionID uint) error
}

func NewPromptTemplateRepository(database db.IDatabaseService) (PromptTemplateRepository, error) {
	return prompt_templates.NewPGPromptTemplateRepository(database)
}
