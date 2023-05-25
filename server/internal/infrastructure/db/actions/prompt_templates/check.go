package prompt_templates

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGPromptTemplateRepository) PromptTemplateTitleExists(title string) bool {
	err := p.client.Model(&models.PromptTemplate{}).Where("title = ?", title).First(&models.PromptTemplate{}).Error
	if err != nil {
		return false
	}
	return true
}

func (p *PGPromptTemplateRepository) PromptTemplateCollectionNameExists(name string) bool {
	err := p.client.Model(&models.PromptTemplateCollection{}).Where("name = ?", name).First(&models.PromptTemplateCollection{}).Error
	if err != nil {
		return false
	}
	return true
}

func (p *PGPromptTemplateRepository) PromptTemplateCollectionExists(id uint) bool {
	err := p.client.Model(&models.PromptTemplateCollection{}).Where("id = ?", id).First(&models.PromptTemplateCollection{}).Error
	if err != nil {
		return false
	}
	return true
}

func (p *PGPromptTemplateRepository) PromptTemplateExists(id uint) bool {
	err := p.client.Model(&models.PromptTemplate{}).Where("id = ?", id).First(&models.PromptTemplate{}).Error
	if err != nil {
		return false
	}
	return true
}
