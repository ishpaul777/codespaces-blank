package custom_errors

import "errors"

var (
	ChatNotFound             = errors.New("chat not found")
	ChatCollectionNotFound   = errors.New("chat collection not found")
	ChatCollectionNameExists = errors.New("chat collection with same name already exists")
)
