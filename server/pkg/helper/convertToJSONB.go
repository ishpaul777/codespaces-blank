package helper

import "encoding/json"

// ConvertToJSONB converts a struct to JSONB
func ConvertToJSONB(data interface{}) ([]byte, error) {
	return json.Marshal(data)
}

// 