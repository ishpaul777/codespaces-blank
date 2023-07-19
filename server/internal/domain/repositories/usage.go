package repositories

import (
	"github.com/factly/tagore/server/internal/infrastructure/db"
	"github.com/factly/tagore/server/internal/infrastructure/db/actions/usage"
)

type UsageRepository interface {
	SaveGenerateUsage(userID uint, inputToken, outputToken int) error
	SaveChatUsage(userID uint, chatID uint, inputToken, outputToken int) error
	SavePersonaUsage(userID uint, personaID uint, inputToken, outputToken int) error
}

func NewUsageRepository(database db.IDatabaseService) (UsageRepository, error) {
	return usage.NewPGUsageRepository(database)
}
