package persona

import (
	"encoding/json"

	"github.com/factly/tagore/server/internal/domain/models"
)

func (p *PGPersonaRepository) CreatePersonaChat(userID, personaID uint, messages []models.Message) (*models.PersonaChat, error) {
	// convert messages to jsonb
	rawMessages, err := json.Marshal(messages)
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
	}

	err = p.client.Create(personaChat).Error
	if err != nil {
		return nil, err
	}

	return personaChat, nil
}
