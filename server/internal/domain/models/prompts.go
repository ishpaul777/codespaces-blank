package models

type Prompt struct {
	Base
	Input        string `gorm:"column:input" json:"input"`
	Output       string `gorm:"column:output" json:"output"`
	FinishReason string `gorm:"column:finish_reason" json:"finish_reason"`
}

type GenerateTextResponse struct {
	Output       string `json:"output"`
	FinishReason string `json:"finish_reason"`
}

// ModelBelongsToChat checks if the model belongs to the chat
func ModelBelongsToChat(model string) bool {
	switch model {
	case "gpt-3.5-turbo":
		return true
	case "gpt-4":
		return true
	default:
		return false
	}
}
