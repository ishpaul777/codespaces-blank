package custom_errors

import (
	"errors"
)

var (
	ErrNotFound   = errors.New("not found")
	ErrNameExists = errors.New("name already exists")
)

type CustomError struct {
	Err     error
	Context CustomErrorType
}

type CustomErrorType string

var (
	InvalidVisibility CustomErrorType = "invalid visibility"
)

// Error implements error
func (c *CustomError) Error() string {
	return c.Err.Error()
}
