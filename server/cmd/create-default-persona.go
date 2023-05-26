package cmd

import (
	"encoding/json"
	"errors"
	"log"
	"os"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/pkg/config"
	loggerPackage "github.com/factly/tagore/server/pkg/logger"
	"github.com/spf13/cobra"
	"gorm.io/gorm"
)

func init() {
	rootCmd.AddCommand(createDefaultPersonaCommand)
}

// createDefaultPersonaCommand creates default personas into the database
var createDefaultPersonaCommand = &cobra.Command{
	Use:   "create-default-personas",
	Short: "create-default-persona creates default personas into the database",
	Run: func(cmd *cobra.Command, args []string) {
		createDefaultPersona()
	},
}

var personaDataFile = "./data/defaultPersona.json"

func createDefaultPersona() error {
	personaFile, err := os.Open(personaDataFile)
	if err != nil {
		return err
	}

	defer personaFile.Close()
	personas := make([]models.Persona, 0)
	jsonParser := json.NewDecoder(personaFile)
	err = jsonParser.Decode(&personas)
	if err != nil {
		return err
	}

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

	// check if default personas already exist in the database
	var count int64
	err = db.Model(&models.Persona{
		IsDefault: true,
	}).Count(&count).Error
	if err != nil {
		return err
	}

	if count > 0 {
		return errors.New("default personas already exist")
	}

	err = db.Model(&models.Persona{}).Create(&personas).Error
	if err != nil {
		return err
	}

	return nil
}
