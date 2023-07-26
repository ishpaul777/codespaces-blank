package services

import (
	"regexp"
	"strings"

	"github.com/factly/tagore/server/internal/domain/repositories"
)

type UsageService interface {
	SaveGenerateUsage(userID uint, data interface{}) error
	SaveChatUsage(userID uint, data interface{}) error
	SavePersonaUsage(userID uint, data interface{}) error
}

type usageService struct {
	usageRepository repositories.UsageRepository
}

func NewUsageService(usageRepository repositories.UsageRepository) UsageService {
	return &usageService{usageRepository: usageRepository}
}

func (u *usageService) SaveGenerateUsage(userID uint, data interface{}) error {
	input := data.(map[string]interface{})["input"].(string)
	pattern := `\[(.*?)\]`
	re := regexp.MustCompile(pattern)

	match := re.FindStringSubmatch(input)
	output := data.(map[string]interface{})["output"].(string)
	outputToken := len(strings.Split(output, " "))
	inputTokens := 0
	if len(match) >= 2 {
		inputTokens = len(strings.Split(match[1], " "))
	}

	return u.usageRepository.SaveGenerateUsage(userID, inputTokens, outputToken)
}

func (u *usageService) SaveChatUsage(userID uint, data interface{}) error {
	panic("implement me")
	// return u.usageRepository.SaveChatUsage(userID, data)
}

func (u *usageService) SavePersonaUsage(userID uint, data interface{}) error {
	panic("implement me")
	// return u.usageRepository.SavePersonaUsage(userID, data)
}

// func NewUsageService(usageRepository repositories.UsageRepository) UsageService {}
