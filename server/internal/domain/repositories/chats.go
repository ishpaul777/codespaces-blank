package repositories

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/chats"
	"github.com/factly/tagore/server/pkg/helper"
)

type ChatRepository interface {
	SaveChat(userID uint, chatID *uint, model string, messages []models.Message, usage models.Usage) (*models.Chat, error)
	AddChatToCollection(userID, chatID, chatCollectionID uint) error
	GetAllChatsByUser(userID uint, pagination helper.Pagination) ([]models.Chat, uint, error)
	DeleteChat(userID, chatID uint) error
	GetChatByID(chatID uint) (*models.Chat, error)
	IsUserChatOwner(userID, chatID uint) (bool, error)
	CreateChatCollection(userID uint, name string) (*models.ChatCollection, error)
	GetAllChatCollectionsByUser(userID uint, pagination helper.Pagination) ([]models.ChatCollection, uint, error)
	GetChatCollectionByID(chatCollectionID uint) (*models.ChatCollection, error)
	DeleteChatCollection(userID, chatCollectionID uint) error
	IsUserChatCollectionOwner(userID, chatCollectionID uint) (bool, error)
}

func NewChatRepository(database db.IDatabaseService) (ChatRepository, error) {
	return chats.NewPGChatsRepository(database)
}
