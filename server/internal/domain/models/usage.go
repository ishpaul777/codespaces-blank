package models

type UsageType string

const (
	Generate     UsageType = "generate"
	ChatUsage    UsageType = "chat"
	PersonaUsage UsageType = "persona"
)

type Usage struct {
	Base
	UserID         uint      `gorm:"column:user_id;not null" json:"user_id"`
	TotalTokens    uint      `gorm:"column:total_tokens;not null" json:"total_tokens"`
	PromptTokens   uint      `gorm:"column:prompt_tokens;not null" json:"prompt_tokens"`
	ResponseTokens uint      `gorm:"column:response_tokens;not null" json:"response_tokens"`
	Type           UsageType `gorm:"column:type;not null;default:'generate'" json:"type"`
	Model          string    `gorm:"column:model;not null" json:"model"`
	Provider       string    `gorm:"column:provider;not null" json:"provider"`
}

type RequestUsage struct {
	UserID  uint
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}
