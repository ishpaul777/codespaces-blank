package prompt_templates

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGPromptTemplateRepository) GetPromptTemplateByID(userID uint, promptTemplateID uint) (*models.PromptTemplate, error) {
	promptTemplate := &models.PromptTemplate{}
	err := p.client.Model(&models.PromptTemplate{}).Where("created_by_id = ? AND id = ?", userID, promptTemplateID).First(promptTemplate).Error
	if err != nil {
		return nil, err
	}
	return promptTemplate, nil
}
