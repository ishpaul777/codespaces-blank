package persona

import (
	"encoding/json"

	"github.com/factly/tagore/server/internal/domain/models"
)

func (p *PGPersonaRepository) UpdatePersonaChat(userID, personaID, chatID uint, messages []models.Message) (*models.PersonaChat, error) {
	// convert messages to jsonb
	rawMessages, err := json.Marshal(messages)
	if err != nil {
		return nil, err
	}

	// convert usage to jsonb
	personaChat := &models.PersonaChat{
		Base: models.Base{
			UpdatedByID: userID,
		},
		PersonaID: personaID,
		Messages:  rawMessages,
	}

	err = p.client.Model(&models.PersonaChat{}).Where("id = ?", chatID).Updates(personaChat).Error
	if err != nil {
		return nil, err
	}

	err = p.client.Model(&models.PersonaChat{}).Where("id = ?", chatID).First(&personaChat).Error
	if err != nil {
		return nil, err
	}

	return personaChat, nil
}
