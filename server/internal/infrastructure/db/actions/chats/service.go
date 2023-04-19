package chats

import (
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"gorm.io/gorm"
)

type PGChatsRepository struct {
	client *gorm.DB
}

func NewPGChatsRepository(database db.IDatabaseService) (*PGChatsRepository, error) {
	dbClient, ok := database.GetClient().(*gorm.DB)
	if !ok {
		return nil, db.ErrInvalidDatabaseClient
	}
	return &PGChatsRepository{client: dbClient}, nil
}
