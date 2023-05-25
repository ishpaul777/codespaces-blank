package models

import "encoding/json"

// Chat is a database model for type chat
type Chat struct {
	Base
	// Title is the title of the chat
	Title string `json:"title" gorm:"column:title;DEFAULT 'new title';not null;"`
	// Messages stores the chat history in the json format
	Messages json.RawMessage `json:"messages" gorm:"type:jsonb"`
	// Usage stores the usage of the chatbot in the json format
	Usage json.RawMessage `json:"usage" gorm:"type:jsonb"`
	// Model stores the model used for the chatbot
	Model string `json:"model"`
	// ChatCollectionID is the foreign key for the chat collection
	ChatCollectionID *uint `json:"chat_collection_id" gorm:"column:chat_collection_id;default null"`
	// ChatCollection is the chat collection for the chat
	ChatCollection *ChatCollection `json:"chat_collection" gorm:"foreignKey:ChatCollectionID"`
}

type ChatCollection struct {
	Base
	// Name is the name of the chat collection/folder
	Name string `json:"name" gorm:"column:name;not null;unique"`
	// Chats is the list of chats in the collection
	Chats []Chat `json:"chats" gorm:"foreignKey:ChatCollectionID"`
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

