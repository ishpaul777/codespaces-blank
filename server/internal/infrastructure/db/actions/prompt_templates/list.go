package prompt_templates

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

// get a list of prompt_templates belong to userID
func (p *PGPromptTemplateRepository) GetAllPromptTemplates(userID uint, pagination helper.Pagination) ([]models.PromptTemplate, uint, error) {
	promptTemplates := []models.PromptTemplate{}
	var total int64

	offset := (pagination.Page - 1) * pagination.Limit
	if offset < 0 {
		offset = 0
	}

	db := p.client.Model(&models.PromptTemplate{}).Where("created_by_id = ?", userID)

	if pagination.SearchQuery != "" {
		db = db.Where("title ILIKE ?", "%"+pagination.SearchQuery+"%")
	}

	err := db.Count(&total).Offset(offset).Limit(pagination.Limit).Preload("PromptTemplateCollection").Find(&promptTemplates).Error

	if err != nil {
		return nil, 0, err
	}

	return promptTemplates, uint(total), nil

}

func (p *PGPromptTemplateRepository) GetAllPromptTemplateCollections(userID uint, pagination helper.Pagination) ([]models.PromptTemplateCollection, uint, error) {
	tempCols := []models.PromptTemplateCollection{}
	var total int64

	offset := (pagination.Page - 1) * pagination.Limit

	if offset < 0 {
		offset = 0
	}

	db := p.client.Model(&models.PromptTemplateCollection{}).Where("created_by_id = ?", userID)

	if pagination.SearchQuery != "" {
		db = db.Where("name ILIKE ?", "%"+pagination.SearchQuery+"%")
	}

	err := db.Count(&total).Offset(offset).Limit(pagination.Limit).Preload("PromptTemplates").Find(&tempCols).Error

	if err != nil {
		return nil, 0, err
	}

	return tempCols, uint(total), nil

}
