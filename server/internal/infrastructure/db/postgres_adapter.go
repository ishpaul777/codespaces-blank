package db

import (
	"github.com/factly/tagore/server/pkg/config"
	"github.com/factly/tagore/server/pkg/logger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormLogger "gorm.io/gorm/logger"
)

type PGDatabase struct {
	Client *gorm.DB
}

func NewPostgresAdapter() *PGDatabase {
	return &PGDatabase{}
}

func (p *PGDatabase) GetClient() interface{} {
	return p.Client
}

func (p *PGDatabase) Connect(logger logger.ILogger, cfg config.DatabaseConfig) error {
	logger.Info("connecting to database")
	// dsn (Data source name) is the connection string for the database
	dsn := "host=" + cfg.Host + " user=" + cfg.Username + " password=" + cfg.Password + " dbname=tagore port=" + cfg.Port + " sslmode=" + cfg.SSLMode
	var err error
	p.Client, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: gormLogger.Default.LogMode(gormLogger.Info),
	})
	if err != nil {
		return err
	}
	logger.Info("successfully connected to database")
	return nil
}
