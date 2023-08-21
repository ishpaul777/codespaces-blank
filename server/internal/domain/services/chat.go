package services

import (
	"encoding/json"
	"errors"

	prompts "github.com/factly/tagore/server/internal/domain/constants/prompts"
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
	"github.com/factly/tagore/server/internal/infrastructure/pubsub"
	"github.com/factly/tagore/server/pkg/helper"
)

type ChatService interface {
	GenerateResponse(input models.GenerateResponseforChat) (*models.Chat, error)
	// GenerateStreamingResponse generates response for a chat in a streaming fashion

	// GenerateStreamingResponse generates response for a chat in a streaming fashion
	GenerateStreamingResponse(input models.GenerateResponseForChatStream)

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
	pubsubClient   pubsub.PubSub
}

// NewChatService returns a new instance of ChatService
func NewChatService(repository repositories.ChatRepository, pubsubClient pubsub.PubSub) ChatService {
	return &chatService{
		chatRepository: repository,
		pubsubClient:   pubsubClient,
	}
}

func (c *chatService) GenerateResponse(input models.GenerateResponseforChat) (*models.Chat, error) {
	generativeModel := generative_model.NewChatGenerativeModel(input.Provider)
	err := generativeModel.LoadConfig()
	if err != nil {
		return nil, err
	}

	var responseMessage []models.Message

	title := ""

	if input.ChatID != nil {
		isOwner, err := c.chatRepository.IsUserChatOwner(input.UserID, *input.ChatID)
		if err != nil {
			return nil, err
		}

		if !isOwner {
			err := errors.New("user is not the owner of the chat")
			return nil, err
		}

		generateRequest := &generative_model.GenerateChatResponse{
			Model:       input.Model,
			Temperature: input.Temperature,
			Messages:    input.Messages,
		}
		responseMessage, err = generativeModel.GenerateResponse(generateRequest)
		if err != nil {
			return nil, err
		}

	} else {
		newMessage := make([]models.Message, 0)
		systemMessage := models.Message{}

		if input.SystemPrompt == "" {

			systemMessage = models.Message{
				Content: prompts.SYSTEM_PROMPT + " " + input.AdditionalInstructions,
				Role:    "system",
			}
		} else {
			systemMessage = models.Message{
				Content: input.SystemPrompt + " " + input.AdditionalInstructions,
				Role:    "system",
			}
		}

		newMessage = append(newMessage, systemMessage, input.Messages[0])
		generateResponse := &generative_model.GenerateChatResponse{
			Model:       input.Model,
			Temperature: input.Temperature,
			Messages:    newMessage,
		}

		responseMessage, err = generativeModel.GenerateResponse(generateResponse)
		if err != nil {
			return nil, err
		}

		var usrMsgs []models.Message
		for _, msg := range input.Messages {
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

	chat, err := c.chatRepository.SaveChat(title, input.UserID, input.ChatID, input.Model, responseMessage)
	if err != nil {
		return nil, err
	}

	payload := map[string]interface{}{
		"model":    input.Model,
		"provider": input.Provider,
		"chat":     chat,
	}

	usage := models.RequestUsage{
		OrgID:   input.OrgID,
		UserID:  input.UserID,
		Type:    "generate-chat",
		Payload: payload,
	}

	usageByteData, _ := json.Marshal(usage)

	_ = c.pubsubClient.Publish("tagore.usage", usageByteData)
	return chat, nil
}

func (c *chatService) GetChatHistoryByUser(userID uint, pagination helper.Pagination) ([]models.Chat, uint, error) {
	return c.chatRepository.GetAllChatsByUser(userID, pagination)
}

func (c *chatService) GenerateStreamingResponse(input models.GenerateResponseForChatStream) {
	generativeModel := generative_model.NewChatGenerativeModel(input.Provider)
	err := generativeModel.LoadConfig()
	if err != nil {
		input.ErrChan <- err
		return
	}

	// if chatID is nil, it means that the chat is new and needs to be created

	if input.ChatID == nil {
		newMessage := make([]models.Message, 0)
		systemMessage := models.Message{}

		if input.SystemPrompt == "" {

			systemMessage = models.Message{
				Content: prompts.SYSTEM_PROMPT + " " + input.AdditionalInstructions,
				Role:    "system",
			}
		} else {
			systemMessage = models.Message{
				Content: input.SystemPrompt + " " + input.AdditionalInstructions,
				Role:    "system",
			}
		}

		newMessage = append(newMessage, systemMessage, input.Messages[0])

		generateRequest := &generative_model.GenerateChatResponseStream{
			UserID:       input.UserID,
			ChatID:       input.ChatID,
			Model:        input.Model,
			Temperature:  input.Temperature,
			Messages:     newMessage,
			DataChan:     input.DataChan,
			ErrChan:      input.ErrChan,
			ChatRepo:     c.chatRepository,
			PubsubClient: c.pubsubClient,
		}
		generativeModel.GenerateStreamingResponse(generateRequest)

	} else {

		generateRequest := &generative_model.GenerateChatResponseStream{
			UserID:       input.UserID,
			ChatID:       input.ChatID,
			Model:        input.Model,
			Temperature:  input.Temperature,
			Messages:     input.Messages,
			DataChan:     input.DataChan,
			ErrChan:      input.ErrChan,
			ChatRepo:     c.chatRepository,
			PubsubClient: c.pubsubClient,
		}
		generativeModel.GenerateStreamingResponse(generateRequest)
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
