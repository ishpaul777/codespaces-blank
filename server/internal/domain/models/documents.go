package models

type Document struct {
	Base
	Title       string
	Slug        string `gorm:"column:slug" json:"slug"`
	Description string `gorm:"column:description" json:"description" sql:"jsonb" swaggertype:"primitive,string"`
	Authors     []User `gorm:"many2many:document_authors;"`
}
