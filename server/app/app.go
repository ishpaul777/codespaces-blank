package app

import (
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/pkg/config"
	"github.com/factly/tagore/server/pkg/logger"
)

// App is the main application struct which holds all the global static dependencies
// like logger, config, database, etc
// It is used to pass these dependencies to other packages
// generative_model is not part of this struct because the type of model can change with request
type App struct {
	logger   logger.ILogger
	config   *config.Config
	database db.IDatabaseService
}

func NewApp() *App {
	return &App{}
}

func (a *App) SetConfig(config *config.Config) {
	a.config = config
}

func (a *App) SetLogger(logger logger.ILogger) {
	a.logger = logger
}

func (a *App) GetConfig() *config.Config {
	return a.config
}

func (a *App) GetServerConfig() *config.ServerConfig {
	return &a.config.Server
}

func (a *App) GetDB() db.IDatabaseService {
	return a.database
}

func (a *App) GetLogger() logger.ILogger {
	return a.logger
}


func (a *App) SetDB(database db.IDatabaseService) {
	a.database = database
}
