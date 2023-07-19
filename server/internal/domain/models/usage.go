package models

type Usage struct {
	Base
	UserID         uint `json:"user_id"`
	TotalTokens    uint `json:"total_tokens"`
	PromptTokens   uint `json:"prompt_tokens"`
	ResponseTokens uint `json:"response_tokens"`
}

type RequestUsage struct {
	UserID uint
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}
