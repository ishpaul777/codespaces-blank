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

type InputForGenerateTextResponse struct {
	Provider               string `json:"provider"`
	Model                  string `json:"model"`
	UserID                 uint   `json:"-"`
	OrgID                  uint   `json:"-"`
	Input                  string `json:"input"`
	GenerateFor            string `json:"generate_for"`
	AdditionalInstructions string `json:"additional_instructions"`
	MaxTokens              uint   `json:"max_tokens"`
}

type InputForGenerateTextResponseStream struct {
	InputForGenerateTextResponse
	DataChan chan<- string
	ErrChan  chan<- error
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
