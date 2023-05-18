package chats

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGChatsRepository) GetChatByID(chatID uint) (*models.Chat, error) {
	chat := &models.Chat{}
	err := p.client.Model(&models.Chat{}).Where("id = ?", chatID).First(chat).Error
	if err != nil {
		return nil, err
	}
	return chat, nil
}

func (p *PGChatsRepository) GetChatCollectionByID(chatCollectionID uint) (*models.ChatCollection, error) {
	chatCollection := &models.ChatCollection{}
	err := p.client.Model(&models.ChatCollection{}).Where("id = ?", chatCollectionID).First(chatCollection).Error
	if err != nil {
		return nil, err
	}
	return chatCollection, nil
}
