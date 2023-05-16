package prompt_templates

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGPromptTemplateRepository) PromptTemplateTitleExists(title string) bool {
	err := p.client.Model(&models.PromptTemplate{}).Where("title = ?", title).First(&models.PromptTemplate{}).Error
	if err != nil {
		return false
	}
	return true
}
