package chats

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGChatsRepository) GetChatCollectionByID(chatCollectionID uint) (*models.ChatCollection, error) {
	chatCollection := &models.ChatCollection{}
	err := p.client.Model(&models.ChatCollection{}).Where("id = ?", chatCollectionID).Preload("Chats").First(chatCollection).Error
	if err != nil {
		return nil, err
	}
	return chatCollection, nil
}
