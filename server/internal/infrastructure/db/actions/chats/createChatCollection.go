package chats

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
)

func (p *PGChatsRepository) CreateChatCollection(userID uint, name string) (*models.ChatCollection, error) {
	exists := p.ChatCollectionNameExists(name, nil)
	if exists {
		return nil, custom_errors.ErrNameExists
	}
	chatCollection := models.ChatCollection{
		Base: models.Base{
			CreatedByID: userID,
		},
		Name: name,
	}
	err := p.client.Create(&chatCollection).Error
	if err != nil {
		return nil, err
	}
	return &chatCollection, nil
}
