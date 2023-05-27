package persona

import (
	"encoding/json"

	"github.com/factly/tagore/server/internal/domain/models"
)

func (p *PGPersonaRepository) CreatePersonaChat(userID, personaID uint, messages []models.Message, usage models.Usage) (*models.PersonaChat, error) {
	// convert messages to jsonb
	rawMessages, err := json.Marshal(messages)
	if err != nil {
		return nil, err
	}

	usageRaw, err := json.Marshal(usage)
	if err != nil {
		return nil, err
	}

	// convert usage to jsonb
	personaChat := &models.PersonaChat{
		Base: models.Base{
			CreatedByID: userID,
		},
		Title:     messages[1].Content,
		PersonaID: personaID,
		Messages:  rawMessages,
		Usage:     usageRaw,
	}

	err = p.client.Create(personaChat).Error
	if err != nil {
		return nil, err
	}

	return personaChat, nil
}
