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

func (p *PGUsageRepository) SaveGenerateUsage(userID uint, inputToken, outputToken int) error {
	usage, err := p.GetUsage(userID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			newUsage := &models.Usage{
				UserID:         userID,
				PromptTokens:   uint(inputToken),
				ResponseTokens: uint(outputToken),
				TotalTokens:    uint(inputToken + outputToken),
			}
			err := p.client.Model(&models.Usage{}).Create(&newUsage).Error
			if err != nil {
				return err
			}
			return nil
		}
	}
	usage.PromptTokens += uint(inputToken)
	usage.ResponseTokens += uint(outputToken)
	usage.TotalTokens += uint(inputToken + outputToken)

	err = p.client.Model(&models.Usage{}).Where("user_id", userID).Updates(&usage).Error
	if err != nil {
		return err
	}

	return nil
}

func (p *PGUsageRepository) SaveChatUsage(userID uint, chatID uint, inputToken, outputToken int) error {
	panic("implement me")
}

func (p *PGUsageRepository) SavePersonaUsage(userID uint, personaID uint, inputToken, outputToken int) error {
	panic("implement me")
}

func (p *PGUsageRepository) GetUsage(userID uint) (models.Usage, error) {
	var usage models.Usage
	err := p.client.Model(&models.Usage{}).Where("user_id = ?", userID).First(&usage).Error
	if err != nil {
		return models.Usage{}, err
	}
	return usage, nil
}
