package services

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
	"github.com/factly/tagore/server/pkg/helper"
)

type PersonaService interface {
	CreateNewPersona(userID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY) (*models.Persona, error)
	DeletePersonaByID(userID, personaID uint) error
	GetAllPersonas(userID uint, pagination helper.Pagination) ([]models.Persona, uint, error)
	GetPersonaByID(userID uint, personaID uint) (*models.Persona, error)
	UpdatePersonaByID(userID uint, personaID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY) (*models.Persona, error)
	// PersonaChat Methods
	ChatWithPersonaStream(userID, personaID uint, personaChatID *uint, additionalInstructions string, messages []models.Message, dataChan chan<- string, errChan chan<- error)
	GetAllPersonaChatByUserID(userID, personaID uint, pagination helper.Pagination) ([]models.PersonaChat, uint, error)
	GetPersonaChatByID(userID, personaID, chatID uint) (*models.PersonaChat, error)
	DeletePersonaChatByID(userID, personaID, chatID uint) error
}

type personaService struct {
	personaRepository repositories.PersonaRepository
}

func NewPersonaService(personaRepository repositories.PersonaRepository) PersonaService {
	return &personaService{personaRepository}
}

func (s *personaService) CreateNewPersona(userID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY) (*models.Persona, error) {
	return s.personaRepository.CreatePersona(userID, name, description, prompt, avatar, model, visibility)
}

func (s *personaService) GetAllPersonas(userID uint, pagination helper.Pagination) ([]models.Persona, uint, error) {
	return s.personaRepository.GetAllPersonas(userID, pagination)
}

func (s *personaService) GetPersonaByID(userID uint, personaID uint) (*models.Persona, error) {
	return s.personaRepository.GetPersonaByID(userID, personaID)
}

func (s *personaService) DeletePersonaByID(userID, personaID uint) error {
	return s.personaRepository.DeletePersonaByID(userID, personaID)
}

func (s *personaService) UpdatePersonaByID(userID uint, personaID uint, name string, description string, prompt, avatar, model string, visibility *models.VISIBILITY) (*models.Persona, error) {
	return s.personaRepository.UpdatePersonaByID(userID, personaID, name, description, prompt, avatar, model, visibility)
}

func (s *personaService) GetAllPersonaChatByUserID(userID uint, personaID uint, pagination helper.Pagination) ([]models.PersonaChat, uint, error) {
	return s.personaRepository.GetAllPersonaChatsByUserID(userID, personaID, pagination)
}

func (s *personaService) GetPersonaChatByID(userID uint, personaID uint, chatID uint) (*models.PersonaChat, error) {
	return s.personaRepository.GetPersonaChatByID(userID, personaID, chatID)
}

func (s *personaService) DeletePersonaChatByID(userID uint, personaID uint, chatID uint) error {
	return s.personaRepository.DeletePersonaChatByID(userID, personaID, chatID)
}

func (s *personaService) ChatWithPersonaStream(userID, personaID uint, personaChatID *uint, additionalInstructions string, messages []models.Message, dataChan chan<- string, errChan chan<- error) {
	selectPersona, err := s.GetPersonaByID(userID, personaID)
	if err != nil {
		errChan <- err
		return
	}

	if selectPersona == nil {
		errChan <- custom_errors.PersonaNotFound
		return
	}

	generativeModel := generative_model.NewChatGenerativeModel(selectPersona.Provider)
	err = generativeModel.LoadConfig()
	if err != nil {
		errChan <- err
		return
	}

	if personaChatID == nil {
		newMessages := []models.Message{}
		newMessages = append(newMessages, models.Message{
			Content: selectPersona.Prompt + "\n additional instructions - " + additionalInstructions + " Don't mention the addition instruction in your response.",
			Role:    "system",
		})

		newMessages = append(newMessages, messages...)
		generativeModel.GenerateStreamingResponseForPersona(userID, personaID, personaChatID, selectPersona.Model, newMessages, s.personaRepository, dataChan, errChan)
	} else {
		generativeModel.GenerateStreamingResponseForPersona(userID, personaID, personaChatID, selectPersona.Model, messages, s.personaRepository, dataChan, errChan)
	}
}
