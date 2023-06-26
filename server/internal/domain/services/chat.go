package services

import (
	"errors"

	prompts "github.com/factly/tagore/server/internal/domain/constants/prompts"
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
	"github.com/factly/tagore/server/pkg/helper"
)

type ChatService interface {
	GenerateResponse(userID uint, chatID *uint, provider, model string, temperature float32, systemPrompt, additionalInstructions string, messages []models.Message) (*models.Chat, error)
	// GenerateStreamingResponse generates response for a chat in a streaming fashion

	// GenerateStreamingResponse generates response for a chat in a streaming fashion
	GenerateStreamingResponse(userID uint, chatID *uint, provider, model string, temperature float32, systemPrompt, additionalInstructions string, messages []models.Message, dataChan chan<- string, errChan chan<- error)

	// GetChatHistoryByUser returns all the chats for a user
	GetChatHistoryByUser(userID uint, pagination helper.Pagination) ([]models.Chat, uint, error)

	// DeleteChat deletes a chat by id and user id and returns the error if any
	DeleteChat(userID, chatID uint) error

	// Create new chat collection
	CreateChatCollection(userID uint, name string) (*models.ChatCollection, error)
	// Get all chat collections by user
	GetAllChatCollectionsByUser(userID uint, pagination helper.Pagination) ([]models.ChatCollection, uint, error)
	// Get chat collection by id
	GetChatCollectionByID(chatCollectionID uint) (*models.ChatCollection, error)
	// Delete chat collection
	DeleteChatCollection(userID, chatCollectionID uint) error
	//Update chat collection
	UpdateChatColByID(userID, chatID uint, name string) error
	// Add chat to collection
	AddChatToCollection(userID, chatID, chatCollectionID uint) error
	// Remove chat from collection
	RemoveChatFromCol(userID, chatID uint) error
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

func (c *chatService) GenerateResponse(userID uint, chatID *uint, provider, model string, temperature float32, systemPrompt, additionalInstructions string, messages []models.Message) (*models.Chat, error) {
	generativeModel := generative_model.NewChatGenerativeModel(provider)
	err := generativeModel.LoadConfig()
	if err != nil {
		return nil, err
	}

	var responseMessage []models.Message
	var usage *models.Usage
	title := ""

	if chatID != nil {
		isOwner, err := c.chatRepository.IsUserChatOwner(userID, *chatID)
		if err != nil {
			return nil, err
		}

		if !isOwner {
			err := errors.New("user is not the owner of the chat")
			return nil, err
		}

		responseMessage, usage, err = generativeModel.GenerateResponse(model, temperature, messages)
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

		newMessage = append(newMessage, systemMessage, messages[0])
		responseMessage, usage, err = generativeModel.GenerateResponse(model, temperature, newMessage)
		if err != nil {
			return nil, err
		}

		var usrMsgs []models.Message
		for _, msg := range messages {
			if msg.Role == "user" {
				usrMsgs = append(usrMsgs, msg)
			}
		}
		if len(usrMsgs) > 0 {
			title, err = generativeModel.GenerateChatTitle(usrMsgs[0])
			if err != nil {
				return nil, err
			}
		}
	}

	chat, err := c.chatRepository.SaveChat(title, userID, chatID, model, responseMessage, *usage)
	if err != nil {
		return nil, err
	}

	return chat, nil
}

func (c *chatService) GetChatHistoryByUser(userID uint, pagination helper.Pagination) ([]models.Chat, uint, error) {
	return c.chatRepository.GetAllChatsByUser(userID, pagination)
}

func (c *chatService) GenerateStreamingResponse(userID uint, chatID *uint, provider, model string, temperature float32, systemPrompt, additionalInstructions string, messages []models.Message, dataChan chan<- string, errChan chan<- error) {
	generativeModel := generative_model.NewChatGenerativeModel(provider)
	err := generativeModel.LoadConfig()
	if err != nil {
		errChan <- err
		return
	}

	// if chatID is nil, it means that the chat is new and needs to be created

	if chatID == nil {
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

		newMessage = append(newMessage, systemMessage, messages[0])
		generativeModel.GenerateStreamingResponse(userID, chatID, model, temperature, newMessage, dataChan, errChan, c.chatRepository)

	} else {
		generativeModel.GenerateStreamingResponse(userID, chatID, model, temperature, messages, dataChan, errChan, c.chatRepository)
	}
}

func (c *chatService) CreateChatCollection(userID uint, name string) (*models.ChatCollection, error) {
	return c.chatRepository.CreateChatCollection(userID, name)
}

func (c *chatService) GetChatCollectionByID(chatCollectionID uint) (*models.ChatCollection, error) {
	return c.chatRepository.GetChatCollectionByID(chatCollectionID)
}

func (c *chatService) GetAllChatCollectionsByUser(userID uint, pagination helper.Pagination) ([]models.ChatCollection, uint, error) {
	return c.chatRepository.GetAllChatCollectionsByUser(userID, pagination)
}

func (c *chatService) DeleteChatCollection(userID, chatCollectionID uint) error {
	return c.chatRepository.DeleteChatCollection(userID, chatCollectionID)
}

func (c *chatService) DeleteChat(userID, chatID uint) error {
	return c.chatRepository.DeleteChat(userID, chatID)
}

func (c *chatService) AddChatToCollection(userID, chatCollectionID, chatID uint) error {
	return c.chatRepository.AddChatToCollection(userID, chatCollectionID, chatID)
}

func (c *chatService) UpdateChatColByID(userID, chatCollectionID uint, name string) error {
	return c.chatRepository.UpdateChatColByID(userID, chatCollectionID, name)
}

func (c *chatService) RemoveChatFromCol(userID, chatID uint) error {
	return c.chatRepository.RemoveChatFromCol(userID, chatID)
}
