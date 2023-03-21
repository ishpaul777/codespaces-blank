package models

type Image struct {
	Base
	Url string `gorm:"column:url" json:"url"`
}
