package chats

import (
	"log"

	"github.com/factly/tagore/server/internal/domain/models"
)

func (p *PGChatsRepository) ChatCollectionNameExists(name string) bool {
	chatCollection := models.ChatCollection{}
	err := p.client.Where("name = ?", name).First(&chatCollection).Error
	if err != nil {
		log.Println(err.Error())
		return false
	}
	return true
}
