package chats

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

func (p *PGChatsRepository) SaveChat(userID uint, chatID *uint, model string, messages []models.Message, usage models.Usage) (*models.Chat, error) {
	messageRaw, err := helper.ConvertToJSONB(messages)
	if err != nil {
		return nil, err
	}

	usageRaw, err := helper.ConvertToJSONB(usage)
	if err != nil {
		return nil, err
	}

	// chat is the chat object that will be saved in the database
	chat := models.Chat{
		Messages: messageRaw,
		Usage:    usageRaw,
	}

	// if chatID is nil, it means that the chat is new and needs to be created

	if chatID == nil {
		chat.CreatedByID = userID
		chat.Model = model
		err = p.client.Create(&chat).Error
		if err != nil {
			return nil, err
		}
	} else {
		chat.UpdatedByID = userID
		// if chatID is not nil, it means that the chat already exists and needs to be updated
		err = p.client.Model(&chat).Where("id = ?", chatID).Updates(&chat).Error
		if err != nil {
			return nil, err
		}

		err = p.client.Where("id=?", *chatID).First(&chat).Error
		if err != nil {
			return nil, err
		}
	}

	return &chat, nil
}
