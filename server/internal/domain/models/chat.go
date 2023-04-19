package models

import "encoding/json"

// Chat is a database model for type chat
type Chat struct {
	Base
	// Messages stores the chat history in the json format
	Messages json.RawMessage `json:"messages" gorm:"type:jsonb"`
	// Usage stores the usage of the chatbot in the json format
	Usage json.RawMessage `json:"usage" gorm:"type:jsonb"`
	// Model stores the model used for the chatbot
	Model string `json:"model"`
}

// Message represents a single message in the chat
// Role can be either "user" or "assistant"
// Content is the message content, it can be prompt or response
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// Usage represents the usage of the chatbot
type Usage struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}
