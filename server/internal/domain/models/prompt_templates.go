package models

type PromptTemplate struct {
	Base
	Title       string `gorm:"column:title" json:"title"`
	Description string `gorm:"column:description" json:"description"`
	Prompt      string `gorm:"column:prompt" json:"prompt"`
}
