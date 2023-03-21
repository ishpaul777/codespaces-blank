package db

import (
	"errors"

	"github.com/factly/tagore/server/pkg/config"
	"github.com/factly/tagore/server/pkg/logger"
)

type IDatabaseService interface {
	Connect(logger logger.ILogger, cfg config.DatabaseConfig) error
	GetClient() interface{}
}

func New() IDatabaseService {
	return NewPostgresAdapter()
}

// generic database errors
var (
	ErrInvalidDatabaseClient = errors.New("invalid database client")
)
