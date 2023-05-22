package models

type Persona struct {
	Name        string `gorm:"column:name" json:"name"`
	Description string `gorm:"column:description" json:"description"`
	Prompt      string `gorm:"column:prompt" json:"prompt"`
	Avarar      string `gorm:"column:avatar" json:"avatar"`
}
