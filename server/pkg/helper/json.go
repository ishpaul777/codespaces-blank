package helper

import (
	"encoding/json"
	"errors"

	"github.com/factly/tagore/server/pkg/logger"
)

var (
	// ErrInvalidJSON is returned when the JSON is invalid
	ErrInvalidJSON = errors.New("error in parsing JSON")
)

// DecodeJSON decode the bytestream coming from request body into an interface
// This interface then can be asserted into the required struct
// Param - data []byte (request body)
// Return - interface{} (decoded data), error
func DecodeJSON(data []byte, logger logger.ILogger) (interface{}, error) {
	var result interface{}
	err := json.Unmarshal(data, &result)
	if err != nil {
		logger.Error("error in parsing JSON", "error", err.Error())
		return nil, ErrInvalidJSON
	}
	return result, nil
}

// EncodeJSON encodes the data into JSON
// Param - data interface{} (data to be encoded)
// Return - []byte (encoded data), error
func EncodeJSON(data interface{}, logger logger.ILogger) ([]byte, error) {
	result, err := json.Marshal(data)
	if err != nil {
		logger.Error("error in parsing JSON", "error", err.Error())
		return nil, ErrInvalidJSON
	}
	return result, nil
}
