package models

type Prompt struct {
	Base
	Input  string `gorm:"column:input" json:"input"`
	Output string `gorm:"column:output" json:"output"`
}
