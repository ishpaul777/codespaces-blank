package models

type User struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	Name      string     `gorm:"column:name" json:"name"`
	Documents []Document `gorm:"many2many:document_authors;"`
}
