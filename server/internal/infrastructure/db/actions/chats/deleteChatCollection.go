package chats

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGChatsRepository) DeleteChatCollection(userID, chatCollectionID uint) error {
	return p.client.Where("created_by_id = ? AND id = ?", userID, chatCollectionID).Delete(&models.ChatCollection{}).Error
}
