package models

type User struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	Documents []Document `gorm:"many2many:document_authors;"`
}
