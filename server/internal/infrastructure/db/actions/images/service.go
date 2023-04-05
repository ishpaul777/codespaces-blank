package images

import (
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"gorm.io/gorm"
)

type PGImagesRepository struct {
	client *gorm.DB
}

func NewPGImagesRepository(database db.IDatabaseService) (*PGImagesRepository, error) {
	dbClient, ok := database.GetClient().(*gorm.DB)
	if !ok {
		return nil, db.ErrInvalidDatabaseClient
	}
	return &PGImagesRepository{client: dbClient}, nil
}
