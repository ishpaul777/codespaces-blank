package services

import (
	"encoding/json"
	"errors"

	prompts "github.com/factly/tagore/server/internal/domain/constants/prompts"
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
	"github.com/factly/tagore/server/pkg/helper"
)

type ChatService interface {
	GenerateResponse(userID uint, chatID *uint, provider, model string, temperature float32, systemPrompt, additionalInstructions, prompt string) (*models.Chat, error)
	// GenerateStreamingResponse generates response for a chat in a streaming fashion
	GenerateStreamingResponse(userID uint, chatID *uint, provider, model string, temperature float32, systemPrompt, additionalInstructions, prompt string, dataChan chan<- string, errChan chan<- error)

	// GenerateStreamingResponse generates response for a chat in a streaming fashion
	GenerateStreamingResponseUsingSSE(userID uint, chatID *uint, provider, model string, temperature float32, systemPrompt string, messages []models.Message, dataChan chan<- string, errChan chan<- error)

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

func (c *chatService) GenerateResponse(userID uint, chatID *uint, provider, model string, temperature float32, systemPrompt, additionalInstructions, prompt string) (*models.Chat, error) {
	// if chatID is nil, it means that the chat is new and needs to be created
	// and if there are more than one messages, it means that the chat is not new
	// and the chatID is required
	// getting all the previous messages for the chat
	var err error
	chat := &models.Chat{}
	if chatID != nil {

		isOwner, err := c.chatRepository.IsUserChatOwner(userID, *chatID)
		if err != nil {
			return nil, err
		}

		if !isOwner {
			err := errors.New("user is not the owner of the chat")
			return nil, err
		}

		chat, err = c.chatRepository.GetChatByID(*chatID)
		if err != nil {
			return nil, err
		}

		newMessage := make([]models.Message, 0)

		err = json.Unmarshal([]byte(chat.Messages), &newMessage)
		if err != nil {
			return nil, err
		}

		newMessage = append(newMessage, models.Message{
			Content: prompt,
			Role:    "user",
		})

		chat, err = c.chatRepository.SaveChat(userID, chatID, model, newMessage, models.Usage{})
		if err != nil {
			return nil, err
		}
	} else {
		newMessage := make([]models.Message, 0)

		systemMessage := models.Message{}

		if systemPrompt == "" {

			systemMessage = models.Message{
				Content: prompts.SYSTEM_PROMPT + " " + additionalInstructions,
				Role:    "system",
			}
		} else {
			systemMessage = models.Message{
				Content: systemPrompt + " " + additionalInstructions,
				Role:    "system",
			}
		}

		newMessage = append(newMessage, systemMessage, models.Message{
			Content: prompt,
			Role:    "user",
		})

		chat, err = c.chatRepository.SaveChat(userID, chatID, model, newMessage, models.Usage{})
		if err != nil {
			return nil, err
		}
	}

	generativeModel := generative_model.NewChatGenerativeModel(provider)
	err = generativeModel.LoadConfig()
	if err != nil {
		return nil, err
	}

	chat, err = generativeModel.GenerateResponse(model, temperature, *chat, c.chatRepository)
	if err != nil {
		return nil, err
	}

	return chat, nil
}

func (c *chatService) GetChatHistoryByUser(userID uint, pagination helper.Pagination) ([]models.Chat, uint, error) {
	return c.chatRepository.GetAllChatsByUser(userID, pagination)
}

func (c *chatService) GenerateStreamingResponse(userID uint, chatID *uint, provider, model string, temperature float32, systemPrompt, additionalInstructions, prompt string, dataChan chan<- string, errChan chan<- error) {
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

		systemMessage := models.Message{}

		if systemPrompt == "" {

			systemMessage = models.Message{
				Content: prompts.SYSTEM_PROMPT + " " + additionalInstructions,
				Role:    "system",
			}
		} else {
			systemMessage = models.Message{
				Content: systemPrompt + " " + additionalInstructions,
				Role:    "system",
			}
		}

		newMessage = append(newMessage, systemMessage, models.Message{
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

	generativeModel.GenerateStreamingResponse(model, temperature, *chat, dataChan, errChan, c.chatRepository)
}

func (c *chatService) DeleteChat(userID, chatID uint) error {
	return c.chatRepository.DeleteChat(userID, chatID)
}

func (c *chatService) GenerateStreamingResponseUsingSSE(userID uint, chatID *uint, provider, model string, temperature float32, systemPrompt string, messages []models.Message, dataChan chan<- string, errChan chan<- error) {
	if chatID == nil {
		// if chatID is nil, it means that the chat is new and needs to be created
		// and if there are more than one messages, it means that the chat is not new
		// and the chatID is required
		if len(messages) > 1 {
			errChan <- errors.New("chat id is required for multiple messages")
			return
		}
	}

	if systemPrompt == "" {
		systemMessage := models.Message{
			Role:    "system",
			Content: prompts.SYSTEM_PROMPT,
		}

		promptMessageArray := []models.Message{}
		promptMessageArray = append(promptMessageArray, systemMessage)
		messages = append(promptMessageArray, messages...)
	}

	generativeModel := generative_model.NewChatGenerativeModel(provider)
	err := generativeModel.LoadConfig()
	if err != nil {
		errChan <- err
		return
	}

	generativeModel.GenerateStreamingResponseUsingSSE(userID, chatID, model, temperature, messages, dataChan, errChan, c.chatRepository)

}
