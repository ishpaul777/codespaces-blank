package repositories

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/chats"
	"github.com/factly/tagore/server/pkg/helper"
)

type ChatRepository interface {
	SaveChat(userID uint, chatID *uint, model string, messages []models.Message, usage models.Usage) (*models.Chat, error)
	GetAllChatsByUser(userID uint, pagination helper.Pagination) ([]models.Chat, uint, error)
}

func NewChatRepository(database db.IDatabaseService) (ChatRepository, error) {
	return chats.NewPGChatsRepository(database)
}
