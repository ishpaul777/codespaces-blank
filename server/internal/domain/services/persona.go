package services

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/pkg/helper"
)

type PersonaService interface {
	CreateNewPersona(userID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY) (*models.Persona, error)
	DeletePersonaByID(userID, personaID uint) error
	GetAllPersonas(userID uint, pagination helper.Pagination) ([]models.Persona, uint, error)
	GetPersonaByID(userID uint, personaID uint) (*models.Persona, error)
	UpdatePersonaByID(userID uint, personaID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY) (*models.Persona, error)

	ChatWithPersonaStream(userID, personaID uint, personaChatID *uint, provider, model string, temperature float32, additionalInstructions, prompt string, dataChan chan<- string, errChan chan<- error)
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

func (s *personaService) ChatWithPersonaStream(userID, personaID uint, personaChatID *uint, provider, model string, temperature float32, additionalInstructions, prompt string, dataChan chan<- string, errChan chan<- error) {
	// s.personaRepository.ChatWithPersonaStream(userID, personaID, personaChatID, provider, model, temperature, additionalInstructions, prompt, dataChan, errChan)
}
