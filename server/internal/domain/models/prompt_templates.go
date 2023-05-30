package models

import (
	"errors"
	"regexp"
	"strings"
)

// "errors"
// "regexp"
// "strings"

type PromptTemplate struct {
	Base
	Title                      string                    `gorm:"column:title; not null" json:"title"`
	Description                string                    `gorm:"column:description" json:"description"`
	Prompt                     string                    `gorm:"column:prompt; not null" json:"prompt"`
	PromptTemplateCollectionID *uint                     `gorm:"column:prompt_template_collection_id;default null" json:"prompt_template_collection_id"`
	PromptTemplateCollection   *PromptTemplateCollection `gorm:"foreignKey:PromptTemplateCollectionID" json:"prompt_template_collection"`
}

func (p *PromptTemplate) ValidatePrompt(prompt string) error {
	//regexp matches {{any_word}} pattern
	re := regexp.MustCompile(`{{\w+}}%`)
	//find all matches in prompt
	matches := re.FindAllString(prompt, -1)

	// if prompt contains variables, check if they are properly wrapped in double curly braces
	if len(matches) > 0 {
		for _, match := range matches {
			if !strings.HasPrefix(prompt, match) && !strings.HasSuffix(prompt, match) {
				return errors.New("prompt contains variables that are not properly wrapped in double curly braces")
			}
		}
	}

	//check if prompt contains unclosed or mismatched curly braces
	bracesCount := strings.Count(prompt, "{") - strings.Count(prompt, "}")
	if bracesCount != 0 {
		return errors.New("prompt contains unclosed or mismatched curly braces")
	}
	return nil
}

type PromptTemplateCollection struct {
	Base
	Name            string           `json:"name" gorm:"column:name;not null;unique"`
	PromptTemplates []PromptTemplate `json:"prompt_templates" gorm:"foreignKey:PromptTemplateCollectionID"`
}
