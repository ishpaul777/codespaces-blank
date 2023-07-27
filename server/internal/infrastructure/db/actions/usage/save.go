package usage

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

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
