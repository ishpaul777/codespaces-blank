package config

import (
	"log"

	"github.com/spf13/viper"
)

type IConfigService interface {
	LoadConfig() (*Config, error)
}

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Logger   LoggerConfig
}



type ServerConfig struct {
	Port string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	SSLMode  string
}

type LoggerConfig struct {
	OutputType string
	Level      string
}

func New() IConfigService {
	return &Config{}
}

func (config Config) LoadConfig() (*Config, error) {
	log.Println("loading configuration for tagore server")
	viper.AddConfigPath(".")
	viper.SetConfigName("config")
	viper.SetEnvPrefix("kavach")
	viper.AutomaticEnv()

	err := viper.ReadInConfig()
	if err != nil {
		log.Println("config file not found...")
	}
	c := &Config{}

	// setting server configuration
	if viper.IsSet("SERVER_PORT") {
		c.Server.Port = viper.GetString("SERVER_PORT")
	} else {
		log.Fatal("SERVER_PORT config not set")
	}

	// setting database configuration
	if viper.IsSet("DATABASE_HOST") {
		c.Database.Host = viper.GetString("DATABASE_HOST")
	} else {
		log.Fatal("DATABASE_HOST config not set")
	}

	if viper.IsSet("DATABASE_PORT") {
		c.Database.Port = viper.GetString("DATABASE_PORT")
	} else {
		log.Fatal("DATABASE_PORT config not set")
	}

	if viper.IsSet("DATABASE_USERNAME") {
		c.Database.Username = viper.GetString("DATABASE_USERNAME")
	} else {
		log.Fatal("DATABASE_USERNAME config not set")
	}

	if viper.IsSet("DATABASE_PASSWORD") {
		c.Database.Password = viper.GetString("DATABASE_PASSWORD")
	} else {
		log.Fatal("DATABASE_PASSWORD config not set")
	}

	if viper.IsSet("DATABASE_SSLMODE") {
		c.Database.SSLMode = viper.GetString("DATABASE_SSLMODE")
	} else {
		log.Fatal("DATABASE_SSLMODE config not set")
	}

	// setting logger configuration
	if viper.IsSet("LOG_OUTPUT") {
		c.Logger.OutputType = viper.GetString("LOG_OUTPUT")
	} else {
		log.Fatal("LOG_OUTPUT config not set")
	}

	if viper.IsSet("LOG_LEVEL") {
		c.Logger.Level = viper.GetString("LOG_LEVEL")
	} else {
		log.Fatal("LOG_LEVEL config not set")
	}

	log.Println("configuration loaded successfully")
	return c, nil
}
