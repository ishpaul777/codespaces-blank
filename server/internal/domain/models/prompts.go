package models

type Prompt struct {
	Base
	Input        string `gorm:"column:input" json:"input"`
	Output       string `gorm:"column:output" json:"output"`
	FinishReason string `gorm:"column:finish_reason" json:"finish_reason"`
}
