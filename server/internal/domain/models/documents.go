package models

import "github.com/factly/tagore/server/pkg/helper"

type Document struct {
	Base
	OrgID       uint   `gorm:"org_id" json:"org_id"`
	Title       string `gorm:"column:title" json:"title"`
	Slug        string `gorm:"column:slug" json:"slug"`
	Description string `gorm:"column:description" json:"description" sql:"jsonb" swaggertype:"primitive,string"`
	Authors     []User `gorm:"many2many:document_authors;"`
}

type CreateDocumentReq struct {
	UserID      uint   `json:"user_id" validate:"required"`
	OrgID       uint   `json:"org_id" validate:"required"`
	Title       string `json:"title" validate:"required"`
	Description string `json:"description" validate:"required"`
}

type GetAllDocumentReq struct {
	UserID uint `json:"user_id" validate:"required"`
	OrgID  uint `json:"org_id" validate:"required"`
	helper.Pagination
}

type UpdateDocumentReq struct {
	UserID      uint   `json:"user_id" validate:"required"`
	OrgID       uint   `json:"org_id" validate:"required"`
	DocumentID  uint   `json:"document_id" validate:"required"`
	Title       string `json:"title" validate:"required"`
	Description string `json:"description" validate:"required"`
}
