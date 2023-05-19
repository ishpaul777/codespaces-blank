package chats

import (
	"errors"
	"log"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
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
	if len(messages) == 0 {
		return nil, errors.New("messages cannot be empty")
	}
	chat := models.Chat{
		Title:    messages[1].Content, // at 0 index there's always a system prompt so avoiding that
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

func (p *PGChatsRepository) CreateChatCollection(userID uint, name string) (*models.ChatCollection, error) {
	exists := p.ChatCollectionNameExists(name)
	log.Println("=================> ", exists)
	if exists {
		return nil, custom_errors.ChatCollectionNameExists
	}
	chatCollection := models.ChatCollection{
		Base: models.Base{
			CreatedByID: userID,
		},
		Name: name,
	}
	err := p.client.Create(&chatCollection).Error
	if err != nil {
		return nil, err
	}
	return &chatCollection, nil
}
