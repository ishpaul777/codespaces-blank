package prompt_templates

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGPromptTemplateRepository) UpdatePromptTemplateByID(userID, promptTemplateID uint, title, description, prompt string) (*models.PromptTemplate, error) {

	updateMap := map[string]interface{}{}

	if title != "" {
		updateMap["title"] = title
	}

	if description != "" {
		updateMap["description"] = description
	}

	if prompt != "" {
		updateMap["prompt"] = prompt
	}

	promptTemplate := &models.PromptTemplate{}
	err := p.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, promptTemplateID).Updates(updateMap).First(promptTemplate).Error
	if err != nil {
		return nil, err
	}

	return promptTemplate, nil
}
