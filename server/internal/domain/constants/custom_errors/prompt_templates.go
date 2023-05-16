package custom_errors

import "errors"

var (
	PromptTemplateTitleExists = errors.New("prompt Template with same title already exists")
	PromptTemplateNotFound    = errors.New("prompt Template not found")
)
