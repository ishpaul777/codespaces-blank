package repositories

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/persona"
	"github.com/factly/tagore/server/pkg/helper"
)

type PersonaRepository interface {
	CreatePersona(userID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY) (*models.Persona, error)
	DeletePersonaByID(userID, personaID uint) error
	GetAllPersonas(userID uint, pagination helper.Pagination) ([]models.Persona, uint, error)
	GetPersonaByID(userID, personaID uint) (*models.Persona, error)
	UpdatePersonaByID(userID uint, personaID uint, name, description, prompt, avatar, model string, visibility *models.VISIBILITY) (*models.Persona, error)
	PersonaNameExists(name string) bool
}

func NewPersonaRepository(database db.IDatabaseService) (PersonaRepository, error) {
	return persona.NewPGPersonaRepository(database)
}
