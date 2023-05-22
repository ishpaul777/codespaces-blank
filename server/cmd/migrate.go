package cmd

import (
	"errors"
	"log"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/pkg/config"
	loggerPackage "github.com/factly/tagore/server/pkg/logger"
	"github.com/spf13/cobra"
	"gorm.io/gorm"
)

func init() {
	rootCmd.AddCommand(migrateCmd)
}

var migrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "migrate sets up the database schema for tagore-server",
	Run: func(cmd *cobra.Command, args []string) {
		buildSchema()
	},
}

func buildSchema() error {
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

	db, ok := database.GetClient().(*gorm.DB)
	if !ok {
		return errors.New("error getting database client")
	}

	err = db.AutoMigrate(&models.Chat{}, &models.Document{}, &models.Prompt{}, &models.User{}, &models.Image{}, &models.ChatCollection{}, &models.PromptTemplate{}, &models.Persona{})
	if err != nil {
		return err
	}
	return nil
}
