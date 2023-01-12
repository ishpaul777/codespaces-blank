package config

import (
	"log"

	"github.com/factly/x/loggerx"
	"github.com/spf13/viper"
)

func SetupVars() {
	loggerx.Init()
	viper.AddConfigPath(".")
	viper.SetConfigName("config")
	viper.AutomaticEnv()

	err := viper.ReadInConfig()
	if err != nil {
		loggerx.Info("config file not found...")
	}

	if !viper.IsSet("PORT") {
		log.Fatal("PORT environment variable not set")
	}

	if !viper.IsSet("OPENAI_API_KEY") {
		log.Fatal("PORT environment variable not set")
	}	
}
