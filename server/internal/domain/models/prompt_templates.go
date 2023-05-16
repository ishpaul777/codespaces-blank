package models

import (
	"errors"
	"regexp"
	"strings"
)

type PromptTemplate struct {
	Base
	Title       string `gorm:"column:title;unique" json:"title"`
	Description string `gorm:"column:description" json:"description"`
	Prompt      string `gorm:"column:prompt" json:"prompt"`
}

func (p *PromptTemplate) ValidatePrompt(prompt string) error {
	re := regexp.MustCompile(`{{\w+}}`)
	matches := re.FindAllString(prompt, -1)

	if len(matches) > 0 {
		for _, match := range matches {
			if !strings.HasPrefix(prompt, match) && !strings.HasSuffix(prompt, match) {
				return errors.New("prompt contains variables that are not properly wrapped in double curly braces")
			}
		}
	}

	bracesCount := strings.Count(prompt, "{") - strings.Count(prompt, "}")
	if bracesCount != 0 {
		return errors.New("prompt contains unclosed or mismatched curly braces")
	}
	return nil
}
