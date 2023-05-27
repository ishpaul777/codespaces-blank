package persona

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGPersonaRepository) DeletePersonaChatByID(userID, personaID, chatID uint) error {
	personaChat := &models.PersonaChat{}
	err := p.client.Model(&models.PersonaChat{}).Where("id = ? AND persona_id = ? AND created_by_id = ?", chatID, personaID, userID).First(&personaChat).Error
	if err != nil {
		return err
	}

	err = p.client.Delete(personaChat).Error

	if err != nil {
		return err
	}

	return nil
}
