package repositories

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/prompts"
)

type PromptRepository interface {
	// GetPromptsByUserID(userID uint) ([]models.Prompt, error)
	CreatePrompt(userID uint, input, output string) (*models.Prompt, error)
	// DeletePromptByID(id uint) error
	// GetPromptByID(promptID uint) (models.Prompt, error)
}

func NewPromptRepository(database db.IDatabaseService) (PromptRepository, error) {
	return prompts.NewPGPromptRepository(database)
}

