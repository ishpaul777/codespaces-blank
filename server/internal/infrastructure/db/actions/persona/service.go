package persona

import (
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"gorm.io/gorm"
)

type PGPersonaRepository struct {
	client *gorm.DB
}

func NewPGPersonaRepository(database db.IDatabaseService) (*PGPersonaRepository, error) {
	dbClient, ok := database.GetClient().(*gorm.DB)
	if !ok {
		return nil, db.ErrInvalidDatabaseClient
	}
	return &PGPersonaRepository{client: dbClient}, nil
}
