package usage

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"gorm.io/gorm"
)

type PGUsageRepository struct {
	client *gorm.DB
}

func NewPGUsageRepository(database db.IDatabaseService) (*PGUsageRepository, error) {
	dbClient, ok := database.GetClient().(*gorm.DB)

	if !ok {
		return nil, db.ErrInvalidDatabaseClient
	}

	return &PGUsageRepository{client: dbClient}, nil
}

func (p *PGUsageRepository) GetUsage(userID uint) (models.Usage, error) {
	var usage models.Usage
	err := p.client.Model(&models.Usage{}).Where("user_id = ?", userID).First(&usage).Error
	if err != nil {
		return models.Usage{}, err
	}
	return usage, nil
}
