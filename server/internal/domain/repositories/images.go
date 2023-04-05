package repositories

import (
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/images"
)

type ImageRepository interface {
	Store() error
}

func NewImageRepository(database db.IDatabaseService) (ImageRepository, error) {
	return images.NewPGImagesRepository(database)
}
