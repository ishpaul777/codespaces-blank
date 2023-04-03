package documents

import (
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"gorm.io/gorm"
)

type PGDocumentRepository struct {
	client *gorm.DB
}

func NewPGDocumentRepository(database db.IDatabaseService) (*PGDocumentRepository, error) {
	dbClient, ok := database.GetClient().(*gorm.DB)
	if !ok {
		return nil, db.ErrInvalidDatabaseClient
	}
	return &PGDocumentRepository{client: dbClient}, nil
}
