package prompt_templates

import "github.com/factly/tagore/server/internal/domain/models"

func (p *PGPromptTemplateRepository) PromptTemplateTitleExists(title string, id *uint) bool {
	query := p.client.Model(&models.PromptTemplate{}).Where("title = ?", title)
	if id != nil {
		query = query.Where("id != ?", *id)
	}
	err := query.First(&models.PromptTemplate{}).Error
	return err == nil
}

func (p *PGPromptTemplateRepository) PromptTemplateCollectionNameExists(name string, id *uint) bool {
	query := p.client.Model(&models.PromptTemplateCollection{}).Where("name = ?", name)
	if id != nil {
		query = query.Where("id != ?", *id)
	}
	err := query.First(&models.PromptTemplateCollection{}).Error
	return err == nil
}

func (p *PGPromptTemplateRepository) PromptTemplateCollectionExists(id uint) bool {
	err := p.client.Model(&models.PromptTemplateCollection{}).Where("id = ?", id).First(&models.PromptTemplateCollection{}).Error
	return err == nil
}

func (p *PGPromptTemplateRepository) PromptTemplateExists(id uint) bool {
	err := p.client.Model(&models.PromptTemplate{}).Where("id = ?", id).First(&models.PromptTemplate{}).Error
	return err == nil
}
