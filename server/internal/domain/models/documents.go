package models

import "github.com/jinzhu/gorm/dialects/postgres"

type Document struct {
	Base
	Slug            string         `gorm:"column:slug" json:"slug"`
	Description     postgres.Jsonb `gorm:"column:description" json:"description" sql:"jsonb" swaggertype:"primitive,string"`
	DescriptionHTML string         `gorm:"column:description_html" json:"description_html,omitempty"`
	Authors         []User         `gorm:"many2many:document_authors;"`
}
