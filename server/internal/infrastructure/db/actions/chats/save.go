package chats

import (
	"errors"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

func (p *PGChatsRepository) SaveChat(title string, userID uint, chatID *uint, model string, messages []models.Message) (*models.Chat, error) {
	messageRaw, err := helper.ConvertToJSONB(messages)
	if err != nil {
		return nil, err
	}

	// chat is the chat object that will be saved in the database
	if len(messages) == 0 {
		return nil, errors.New("messages cannot be empty")
	}
	var chat models.Chat
	if title != "" {
		chat = models.Chat{
			Title:    title, // at 0 index there's always a system prompt so avoiding that
			Messages: messageRaw,
		}
	} else {
		chat = models.Chat{
			Messages: messageRaw,
		}
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
		err = p.client.Model(&chat).Where("id = ?", *chatID).Updates(&chat).Error
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
