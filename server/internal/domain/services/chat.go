package services

import (
	"encoding/json"
	"errors"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
	"github.com/factly/tagore/server/pkg/helper"
)

type ChatService interface {
	GenerateResponse(userID uint, chatID *uint, provider, model string, messages []models.Message) (*models.Chat, error)
	// GenerateStreamingResponse generates response for a chat in a streaming fashion
	GenerateStreamingResponse(userID uint, chatID *uint, provider, model string, prompt string, dataChan chan<- string, errChan chan<- error)

	// GetChatHistoryByUser returns all the chats for a user
	GetChatHistoryByUser(userID uint, pagination helper.Pagination) ([]models.Chat, uint, error)

	// DeleteChat deletes a chat by id and user id and returns the error if any
	DeleteChat(userID, chatID uint) error
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

func (c *chatService) GetChatHistoryByUser(userID uint, pagination helper.Pagination) ([]models.Chat, uint, error) {
	return c.chatRepository.GetAllChatsByUser(userID, pagination)
}

func (c *chatService) GenerateStreamingResponse(userID uint, chatID *uint, provider, model string, prompt string, dataChan chan<- string, errChan chan<- error) {
	// if chatID is nil, it means that the chat is new and needs to be created
	// and if there are more than one messages, it means that the chat is not new
	// and the chatID is required
	// getting all the previous messages for the chat
	var err error
	chat := &models.Chat{}
	if chatID != nil {

		isOwner, err := c.chatRepository.IsUserChatOwner(userID, *chatID)
		if err != nil {
			errChan <- err
			return
		}

		if !isOwner {
			errChan <- errors.New("user is not the owner of the chat")
			return
		}

		chat, err = c.chatRepository.GetChatByID(*chatID)
		if err != nil {
			errChan <- err
			return
		}

		newMessage := make([]models.Message, 0)

		err = json.Unmarshal([]byte(chat.Messages), &newMessage)
		if err != nil {
			errChan <- err
			return
		}

		newMessage = append(newMessage, models.Message{
			Content: prompt,
			Role:    "user",
		})

		chat, err = c.chatRepository.SaveChat(userID, chatID, model, newMessage, models.Usage{})
		if err != nil {
			errChan <- err
			return
		}
	} else {
		newMessage := make([]models.Message, 0)

		newMessage = append(newMessage, models.Message{
			Content: prompt,
			Role:    "user",
		})

		chat, err = c.chatRepository.SaveChat(userID, chatID, model, newMessage, models.Usage{})
		if err != nil {
			errChan <- err
			return
		}
	}

	generativeModel := generative_model.NewChatGenerativeModel(provider)
	err = generativeModel.LoadConfig()
	if err != nil {
		errChan <- err
		return
	}

	generativeModel.GenerateStreamingResponse(model, *chat, dataChan, errChan, c.chatRepository)
}

func (c *chatService) DeleteChat(userID, chatID uint) error {
	return c.chatRepository.DeleteChat(userID, chatID)
}
