package chats

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"gorm.io/gorm"
)

func (repo *PGChatsRepository) AddChatToCollection(userID, chatID, chatCollectionID uint) error {
	// check if chat and chat collection exist
	chat := models.Chat{}
	chatCollection := models.ChatCollection{}
	err := repo.client.Where("created_by_id = ? AND id = ?", userID, chatID).First(&chat).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.ChatNotFound
		}
		return err
	}
	err = repo.client.Where("created_by_id = ? AND id = ?", userID, chatCollectionID).First(&chatCollection).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return custom_errors.ChatCollectionNotFound
		}
		return err
	}
	// update ChatCollectionID in chat
	err = repo.client.Model(&chat).Where("id = ?", chatID).Update("chat_collection_id", chatCollectionID).Error
	if err != nil {
		return err
	}
	return nil
}
