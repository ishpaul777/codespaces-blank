package chats

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGChatsRepository) GetChatByID(chatID uint) (*models.Chat, error) {
	chat := &models.Chat{}
	err := p.client.Model(&models.Chat{}).Where("id = ?", chatID).First(chat).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, custom_errors.ErrNotFound
		}
		return nil, err
	}
	return chat, nil
}
