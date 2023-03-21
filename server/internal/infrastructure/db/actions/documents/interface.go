package documents

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/jinzhu/gorm/dialects/postgres"
)

type DocumentRepository interface {
	CreateDocument(jsonContent postgres.Jsonb, htmlContent string, username string, userid string) (models.Document, error)
	GetDocumentByID(id string) (models.Document, error)
}
