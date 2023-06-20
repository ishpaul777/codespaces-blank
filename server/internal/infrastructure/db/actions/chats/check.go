package chats

import (
	"log"

	"github.com/factly/tagore/server/internal/domain/models"
)

func (p *PGChatsRepository) ChatCollectionNameExists(name string, id *uint) bool {
	query := p.client.Where("name = ?", name)
	if id != nil {
		query = query.Where("id != ?", *id)
	}
	err := query.First(&models.ChatCollection{}).Error
	if err != nil {
		log.Println(err.Error())
		return false
	}
	return true
}
