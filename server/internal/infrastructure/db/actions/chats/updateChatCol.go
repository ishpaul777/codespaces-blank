package chats

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (p *PGChatsRepository) UpdateChatColByID(userID, colID uint, name string) error {
	// check if ChatCollection exists
	err := p.client.Model(&models.ChatCollection{}).Where("created_by_id = ? AND id = ?", userID, colID).Find(&models.ChatCollection{}).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.ErrNotFound
		}
		return err
	}

	exists := p.ChatCollectionNameExists(name, &colID)
	if exists {
		return custom_errors.ErrNameExists
	}

	err = p.client.Model(&models.ChatCollection{}).Where("created_by_id = ? AND id = ?", userID, colID).Updates(map[string]interface{}{"name": name}).Error

	if err != nil {
		return err
	}

	return nil
}
