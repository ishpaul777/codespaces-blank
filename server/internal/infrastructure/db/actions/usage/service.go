package usage

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/pkg/helper"
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

func (p *PGUsageRepository) SaveGenerateUsage(userID uint, inputToken, outputToken int, model, provider string, typeUsedFor models.UsageType) error {
	newUsage := &models.Usage{
		UserID:         userID,
		PromptTokens:   uint(inputToken),
		ResponseTokens: uint(outputToken),
		TotalTokens:    uint(inputToken + outputToken),
		Provider:       provider,
		Model:          model,
		Type:           typeUsedFor,
	}
	err := p.client.Model(&models.Usage{}).Create(&newUsage).Error
	if err != nil {
		return err
	}

	return nil
}

func (p *PGUsageRepository) SaveChatUsage(userID uint, chatID uint, inputToken, outputToken int, model, provider string) error {
	chatUsage := models.EachChatUsage{
		ResponseTokens: uint(outputToken),
		PromptTokens:   uint(inputToken),
		TotalTokens:    uint(inputToken + outputToken),
	}

	// convert chatUsage to jsonb
	chatUsageRaw, err := helper.ConvertToJSONB(chatUsage)
	if err != nil {
		return err
	}

	// update the chat usage in the chat table with chat id
	err = p.client.Model(&models.Chat{}).Where("id = ?", chatID).Updates(&models.Chat{
		Usage: chatUsageRaw,
	}).Error

	if err != nil {
		return err
	}

	return nil
}

func (p *PGUsageRepository) SavePersonaUsage(userID uint, chatID uint, inputToken, outputToken int, model, provider string) error {
	chatUsage := models.EachChatUsage{
		ResponseTokens: uint(outputToken),
		PromptTokens:   uint(inputToken),
		TotalTokens:    uint(inputToken + outputToken),
	}

	// convert chatUsage to jsonb
	chatUsageRaw, err := helper.ConvertToJSONB(chatUsage)
	if err != nil {
		return err
	}

	// update the chat usage in the chat table with chat id
	err = p.client.Model(&models.PersonaChat{}).Where("id = ?", chatID).Updates(&models.Chat{
		Usage: chatUsageRaw,
	}).Error

	if err != nil {
		return err
	}

	return nil
}

func (p *PGUsageRepository) GetUsage(userID uint) (models.Usage, error) {
	var usage models.Usage
	err := p.client.Model(&models.Usage{}).Where("user_id = ?", userID).First(&usage).Error
	if err != nil {
		return models.Usage{}, err
	}
	return usage, nil
}
