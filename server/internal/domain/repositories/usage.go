package repositories

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/usage"
)

type UsageRepository interface {
	SaveGenerateUsage(userID, orgID uint, inputToken, outputToken int, model, provider string, typeUsedFor models.UsageType) error
	SaveChatUsage(userID, orgID uint, chatID uint, inputToken, outputToken int, model, provider string) error
	SavePersonaUsage(userID, orgID uint, chatID uint, inputToken, outputToken int, model, provider string) error
	GetUsageByUserID(userID, orgID uint, filters models.GetUsageFilters) ([]models.GetUsageResponse, error)
}

func NewUsageRepository(database db.IDatabaseService) (UsageRepository, error) {
	return usage.NewPGUsageRepository(database)
}
