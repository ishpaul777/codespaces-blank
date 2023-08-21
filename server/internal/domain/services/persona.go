package services

import (
	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
	"github.com/factly/tagore/server/internal/infrastructure/pubsub"
	"github.com/factly/tagore/server/pkg/helper"
)

type PersonaService interface {
	CreateNewPersona(input *models.InputForCreatePersona) (*models.Persona, error)
	DeletePersonaByID(userID, personaID uint) error
	GetAllPersonas(userID uint, pagination helper.Pagination) ([]models.Persona, uint, error)
	GetPersonaByID(userID uint, personaID uint) (*models.Persona, error)
	UpdatePersonaByID(userID uint, personaID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY, is_default *bool) (*models.Persona, error)
	GetAllDefaultPersonas() ([]models.Persona, error)
	// PersonaChat Methods
	ChatWithPersonaStream(input *models.InputForPersonaChatStream)
	GetAllPersonaChatByUserID(userID, personaID uint, pagination helper.Pagination) ([]models.PersonaChat, uint, error)
	GetPersonaChatByID(userID, personaID, chatID uint) (*models.PersonaChat, error)
	DeletePersonaChatByID(userID, personaID, chatID uint) error
}

type personaService struct {
	personaRepository repositories.PersonaRepository
	pubsub            pubsub.PubSub
}

func NewPersonaService(personaRepository repositories.PersonaRepository, pubsubClient pubsub.PubSub) PersonaService {
	return &personaService{
		personaRepository: personaRepository,
		pubsub:            pubsubClient,
	}
}

func (s *personaService) CreateNewPersona(input *models.InputForCreatePersona) (*models.Persona, error) {
	return s.personaRepository.CreatePersona(input)
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

func (s *personaService) UpdatePersonaByID(userID uint, personaID uint, name string, description string, prompt, avatar, model string, visibility *models.VISIBILITY, is_default *bool) (*models.Persona, error) {
	return s.personaRepository.UpdatePersonaByID(userID, personaID, name, description, prompt, avatar, model, visibility, is_default)
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

func (s *personaService) GetAllDefaultPersonas() ([]models.Persona, error) {
	return s.personaRepository.GetAllDefaultPersonas()
}

func (s *personaService) ChatWithPersonaStream(input *models.InputForPersonaChatStream) {
	selectPersona, err := s.GetPersonaByID(input.UserID, input.PersonaID)
	if err != nil {
		input.ErrChan <- err
		return
	}

	if selectPersona == nil {
		input.ErrChan <- custom_errors.ErrNotFound
		return
	}

	generativeModel := generative_model.NewChatGenerativeModel(selectPersona.Provider)
	err = generativeModel.LoadConfig()
	if err != nil {
		input.ErrChan <- err
		return
	}

	if input.PersonaChatID == nil {
		newMessages := []models.Message{}
		newMessages = append(newMessages, models.Message{
			Content: selectPersona.Prompt + "\n additional instructions - " + input.AdditionalInstructions + " Don't mention the addition instruction in your response.",
			Role:    "system",
		})

		newMessages = append(newMessages, input.Messages...)

		data := &models.PersonaChatStream{
			UserID:       input.UserID,
			OrgID:        input.OrgID,
			PersonaID:    input.PersonaID,
			Messages:     newMessages,
			Model:        selectPersona.Model,
			ChatID:       input.PersonaChatID,
			DataChan:     input.DataChan,
			ErrChan:      input.ErrChan,
			PubsubClient: s.pubsub,
		}
		generativeModel.GenerateStreamingResponseForPersona(data, s.personaRepository)
	} else {
		data := &models.PersonaChatStream{
			UserID:       input.UserID,
			OrgID:        input.OrgID,
			PersonaID:    input.PersonaID,
			Messages:     input.Messages,
			Model:        selectPersona.Model,
			ChatID:       input.PersonaChatID,
			DataChan:     input.DataChan,
			ErrChan:      input.ErrChan,
			PubsubClient: s.pubsub,
		}
		generativeModel.GenerateStreamingResponseForPersona(data, s.personaRepository)
	}
}
