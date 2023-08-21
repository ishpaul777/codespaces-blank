package services

import (
	"encoding/json"
	"regexp"
	"strings"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
)

type UsageService interface {
	SaveGenerateUsage(userID, orgID uint, data interface{}) error
	SaveChatUsage(userID, orgID uint, data interface{}) error
	SavePersonaUsage(userID, orgID uint, data interface{}) error
	GetUsageByUserID(userID, orgID uint, filters models.GetUsageFilters) ([]models.GetUsageResponse, error)
}

type usageService struct {
	usageRepository repositories.UsageRepository
}

func NewUsageService(usageRepository repositories.UsageRepository) UsageService {
	return &usageService{usageRepository: usageRepository}
}

func (u *usageService) SaveGenerateUsage(userID, orgID uint, data interface{}) error {
	input := data.(map[string]interface{})["input"].(string)
	model := data.(map[string]interface{})["model"].(string)
	provider := data.(map[string]interface{})["provider"].(string)
	pattern := `\[(.*?)\]`
	re := regexp.MustCompile(pattern)

	match := re.FindStringSubmatch(input)
	output := data.(map[string]interface{})["output"].(string)
	outputToken := len(strings.Split(output, " "))
	inputTokens := 0
	if len(match) >= 2 {
		inputTokens = len(strings.Split(match[1], " "))
	}

	return u.usageRepository.SaveGenerateUsage(userID, orgID, inputTokens, outputToken, model, provider, "generate")
}

func (u *usageService) SaveChatUsage(userID, orgID uint, data interface{}) error {
	model := data.(map[string]interface{})["model"].(string)
	provider := data.(map[string]interface{})["provider"].(string)

	chatMap := data.(map[string]interface{})["chat"].(map[string]interface{})
	byteChat, err := json.Marshal(chatMap)
	if err != nil {
		return err
	}

	chat := &models.Chat{}
	err = json.Unmarshal(byteChat, &chat)
	if err != nil {
		return err
	}

	messages := []models.Message{}
	err = json.Unmarshal([]byte(chat.Messages), &messages)
	if err != nil {
		return err
	}

	inputToken := 0
	outputToken := 0

	lastUsedInputToken := 0
	lastUsedOutputToken := 0

	for index, message := range messages {
		splitLength := len(strings.Split(message.Content, " "))
		if message.Role == "user" {
			inputToken += splitLength
			if index == len(messages)-2 {
				lastUsedInputToken = splitLength
			}
		} else {
			outputToken += splitLength
			if index == len(messages)-1 {
				lastUsedOutputToken = splitLength
			}
		}
	}

	err = u.usageRepository.SaveGenerateUsage(userID, orgID, lastUsedInputToken, lastUsedOutputToken, model, provider, "chat")
	if err != nil {
		return err
	}

	return u.usageRepository.SaveChatUsage(userID, orgID, chat.ID, inputToken, outputToken, model, provider)
}

func (u *usageService) SavePersonaUsage(userID, orgID uint, data interface{}) error {
	model := data.(map[string]interface{})["model"].(string)
	provider := data.(map[string]interface{})["provider"].(string)

	chatMap := data.(map[string]interface{})["chat"].(map[string]interface{})
	byteChat, err := json.Marshal(chatMap)
	if err != nil {
		return err
	}

	chat := &models.Chat{}
	err = json.Unmarshal(byteChat, &chat)
	if err != nil {
		return err
	}

	messages := []models.Message{}
	err = json.Unmarshal([]byte(chat.Messages), &messages)
	if err != nil {
		return err
	}

	inputToken := 0
	outputToken := 0

	lastUsedInputToken := 0
	lastUsedOutputToken := 0

	for index, message := range messages {
		splitLength := len(strings.Split(message.Content, " "))
		if message.Role == "user" {
			inputToken += splitLength
			if index == len(messages)-2 {
				lastUsedInputToken = splitLength
			}
		} else {
			outputToken += splitLength
			if index == len(messages)-1 {
				lastUsedOutputToken = splitLength
			}
		}
	}

	err = u.usageRepository.SaveGenerateUsage(userID, orgID, lastUsedInputToken, lastUsedOutputToken, model, provider, "persona")
	if err != nil {
		return err
	}

	return u.usageRepository.SavePersonaUsage(userID, orgID, chat.ID, inputToken, outputToken, model, provider)

}

func (u *usageService) GetUsageByUserID(userID, orgID uint, filters models.GetUsageFilters) ([]models.GetUsageResponse, error) {
	return u.usageRepository.GetUsageByUserID(userID, orgID, filters)
}
