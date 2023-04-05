package models

// Image model represents the image which will be downloaded and stored as a favourite
type Image struct {
	Base
	Url string `gorm:"column:url" json:"url"`
}

type GeneratedImage struct {
	URL string `json:"url"`
}
