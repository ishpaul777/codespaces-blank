package chats

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

func (p *PGChatsRepository) GetAllChatsByUser(userID uint, pagination helper.Pagination) ([]models.Chat, uint, error) {
	chats := []models.Chat{}
	var total int64

	offset := (pagination.Page - 1) * pagination.Limit
	if offset < 0 {
		offset = 0
	}

	db := p.client.Model(&models.Chat{}).Where("created_by_id = ?", userID).Order("created_at DESC")

	if pagination.SearchQuery != "" {
		db = db.Where("title ILIKE ?", "%"+pagination.SearchQuery+"%")
	}

	err := db.Count(&total).Offset(offset).Limit(pagination.Limit).Preload("ChatCollection").Find(&chats).Error
	if err != nil {
		return nil, 0, err
	}

	return chats, uint(total), nil
}

func (p *PGChatsRepository) GetAllChatCollectionsByUser(userID uint, pagination helper.Pagination) ([]models.ChatCollection, uint, error) {
	chatCollections := []models.ChatCollection{}
	var total int64
	offset := (pagination.Page - 1) * pagination.Limit
	if offset < 0 {
		offset = 0
	}
	db := p.client.Model(&models.ChatCollection{}).Where("created_by_id = ?", userID).Order("created_at DESC")
	if pagination.SearchQuery != "" {
		db = db.Where("name ILIKE ?", "%"+pagination.SearchQuery+"%")
	}
	err := db.Count(&total).Offset(offset).Limit(pagination.Limit).Find(&chatCollections).Error
	if err != nil {
		return nil, 0, err
	}
	return chatCollections, uint(total), nil
}
