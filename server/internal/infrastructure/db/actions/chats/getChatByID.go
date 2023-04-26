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
