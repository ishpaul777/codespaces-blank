package chats

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGChatsRepository) RemoveChatFromCol(userID, chatID uint) error {
	err := p.client.Model(&models.Chat{}).Where("created_by_id = ? AND id = ?", userID, chatID).Update("chat_collection_id", nil).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.ChatNotFound
		}
		return err
	}
	return nil
}
