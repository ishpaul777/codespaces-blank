package main

import (
	"log"

	"github.com/factly/tagore/server/app"

	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/http"

	// "github.com/factly/tagore/server/internal/infrastructure/http"
	"github.com/factly/tagore/server/pkg/config"
	loggerPackage "github.com/factly/tagore/server/pkg/logger"
)

func main() {
	// initially using log package to log errors because custom logger is not yet initialized
	configService := config.New()
	config, err := configService.LoadConfig()
	if err != nil {
		log.Fatal("error loading config file", "err", err.Error())
	}
	logger := loggerPackage.New()
	err = logger.SetConfig(&config.Logger)
	if err != nil {
		log.Fatal("error setting logger config", "err", err.Error())
	}

	database := db.New()
	err = database.Connect(logger, config.Database)
	if err != nil {
		// now using custom logger to log infos, errors, warnings
		logger.Fatal("error connecting to database")
	}
	// database.GetClient().(*gorm.DB).AutoMigrate(&models.Chat{})
	app := app.NewApp()
	app.SetLogger(logger)
	app.SetConfig(config)
	app.SetDB(database)
	http.RunHTTPServer(app)
}
