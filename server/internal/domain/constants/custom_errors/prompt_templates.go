package custom_errors

import "errors"

var (
	PromptTemplateTitleExists          = errors.New("prompt template with same title already exists")
	PromptTemplateNotFound             = errors.New("prompt template not found")
	PromptTemplateCollectionNameExists = errors.New("prompt template collection with same already exists")
	PromptTemplateCollectionNotFound   = errors.New("prompt template collection not found")
	PromptTemplateNotFoundInCollection = errors.New("prompt template not found in collection")
)
