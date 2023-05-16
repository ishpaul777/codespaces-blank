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
	//regexp matches {{any_word}} pattern
	re := regexp.MustCompile(`{{\w+}}`)
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
