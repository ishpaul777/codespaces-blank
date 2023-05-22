package models

type VISIBILITY string

var (

	// VISIBILITY_PUBLIC represents a public visibility
	VISIBILITY_PUBLIC VISIBILITY = "public"
	// VISIBILITY_PRIVATE represents a private visibility
	VISIBILITY_PRIVATE VISIBILITY = "private"
)

type Persona struct {
	Base
	Name        string     `gorm:"column:name" json:"name"`
	Description string     `gorm:"column:description" json:"description"`
	Prompt      string     `gorm:"column:prompt" json:"prompt"`
	Avatar      string     `gorm:"column:avatar" json:"avatar"`
	Visibility  VISIBILITY `gorm:"column:visibility" json:"visibility"`
}

func ValidateVisibility(v VISIBILITY) bool {
	return v == VISIBILITY_PUBLIC || v == VISIBILITY_PRIVATE
}
