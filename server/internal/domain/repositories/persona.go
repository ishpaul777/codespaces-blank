package repositories

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/persona"
	"github.com/factly/tagore/server/pkg/helper"
)

type PersonaRepository interface {
	CreatePersona(input *models.InputForCreatePersona) (*models.Persona, error)
	DeletePersonaByID(userID, personaID uint) error
	GetAllPersonas(userID uint, pagination helper.Pagination) ([]models.Persona, uint, error)
	GetPersonaByID(userID, personaID uint) (*models.Persona, error)
	UpdatePersonaByID(userID uint, personaID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY, is_default *bool) (*models.Persona, error)
	PersonaNameExists(name string, id *uint) bool
	GetAllDefaultPersonas() ([]models.Persona, error)

	// PersonaChat Methods
	CreatePersonaChat(userID, personaID uint, messages []models.Message) (*models.PersonaChat, error)
	UpdatePersonaChat(userID, personaID, chatID uint, messages []models.Message) (*models.PersonaChat, error)
	GetPersonaChatByID(userID, personaID, chatID uint) (*models.PersonaChat, error)
	GetAllPersonaChatsByUserID(userID, personaID uint, pagination helper.Pagination) ([]models.PersonaChat, uint, error)
	DeletePersonaChatByID(userID, personaID, chatID uint) error
}

func NewPersonaRepository(database db.IDatabaseService) (PersonaRepository, error) {
	return persona.NewPGPersonaRepository(database)
}
