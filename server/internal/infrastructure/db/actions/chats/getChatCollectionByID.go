package chats

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGChatsRepository) GetChatCollectionByID(chatCollectionID uint) (*models.ChatCollection, error) {
	chatCollection := &models.ChatCollection{}
	err := p.client.Model(&models.ChatCollection{}).Where("id = ?", chatCollectionID).Preload("Chats").First(chatCollection).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.ErrNotFound
		}
		return nil, err
	}
	return chatCollection, nil
}
