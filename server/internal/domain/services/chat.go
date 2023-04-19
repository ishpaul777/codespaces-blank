package services

import (
	"errors"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
)

type ChatService interface {
	GenerateResponse(userID uint, chatID *uint, provider, model string, messages []models.Message) (*models.Chat, error)
}

// chatService is a concrete implementation of ChatService interface
type chatService struct {
	chatRepository repositories.ChatRepository
}

// NewChatService returns a new instance of ChatService
func NewChatService(repository repositories.ChatRepository) ChatService {
	return &chatService{
		chatRepository: repository,
	}
}

func (c *chatService) GenerateResponse(userID uint, chatID *uint, provider, model string, messages []models.Message) (*models.Chat, error) {
	if chatID == nil {
		// if chatID is nil, it means that the chat is new and needs to be created
		// and if there are more than one messages, it means that the chat is not new
		// and the chatID is required
		if len(messages) > 1 {
			return nil, errors.New("chat id is required for multiple messages")
		}
	}

	generativeModel := generative_model.NewChatGenerativeModel(provider)
	err := generativeModel.LoadConfig()
	if err != nil {
		return nil, err
	}

	messages, usage, err := generativeModel.GenerateResponse(model, messages)
	if err != nil {
		return nil, err
	}

	chat, err := c.chatRepository.SaveChat(userID, chatID, model, messages, *usage)
	if err != nil {
		return nil, err
	}

	return chat, nil
	// model := generative_model.New("openai")
}
