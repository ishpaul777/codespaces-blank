package custom_errors

import "errors"

var (
	PersonaNameExists        = errors.New("persona with same name already exists")
	PersonaVisibilityInvalid = errors.New("persona visibility is invalid")
	PersonaNotFound          = errors.New("persona not found")
)
