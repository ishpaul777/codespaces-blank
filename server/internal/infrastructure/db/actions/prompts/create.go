package prompts

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"gorm.io/gorm"
)

type PGPromptRepository struct {
	client *gorm.DB
}

func NewPGPromptRepository(database db.IDatabaseService) (*PGPromptRepository, error) {
	dbClient, ok := database.GetClient().(*gorm.DB)
	if !ok {
		return nil, db.ErrInvalidDatabaseClient
	}
	return &PGPromptRepository{client: dbClient}, nil
}

func (p *PGPromptRepository) CreatePrompt(userID uint, input, output string) (*models.Prompt, error) {
	newPrompt := &models.Prompt{
		Base: models.Base{
			CreatedByID: userID,
		},
		Input:  input,
		Output: output,
	}

	err := p.client.Model(&models.Prompt{}).Create(&newPrompt).Error
	if err != nil {
		return nil, err
	}
	return newPrompt, nil
}
