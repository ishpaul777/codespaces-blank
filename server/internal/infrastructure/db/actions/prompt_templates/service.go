package prompt_templates

import (
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"gorm.io/gorm"
)

type PGPromptTemplateRepository struct {
	client *gorm.DB
}

func NewPGPromptTemplateRepository(database db.IDatabaseService) (*PGPromptTemplateRepository, error) {
	dbClient, ok := database.GetClient().(*gorm.DB)

	if !ok {
		return nil, db.ErrInvalidDatabaseClient
	}

	return &PGPromptTemplateRepository{client: dbClient}, nil
}
