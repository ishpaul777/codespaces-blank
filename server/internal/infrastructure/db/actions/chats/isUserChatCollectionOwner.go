package chats

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGChatsRepository) IsUserChatCollectionOwner(userID, chatCollectionID uint) (bool, error) {
	var count int64
	err := p.client.Model(&models.ChatCollection{}).Where("id = ?", chatCollectionID).Where("created_by_id = ?", userID).Count(&count).Error
	if err != nil {
		return false, err
	}
	// count == 1 means the user is the owner of the chat
	return count == 1, nil
}
