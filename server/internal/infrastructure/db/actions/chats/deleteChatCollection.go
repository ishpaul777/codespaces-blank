package chats

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGChatsRepository) DeleteChatCollection(userID, chatCollectionID uint) error {
	err := p.client.Where("created_by_id = ? AND id = ?", userID, chatCollectionID).Delete(&models.ChatCollection{}).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.ErrNotFound
		}
		return err
	}
	return nil
}
