package documents

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type responseGetAllDocuments struct {
	Count     uint              `json:"count"`
	Documents []models.Document `json:"documents"`
	Message   string            `json:"message"`
}

func (h *httpHandler) getAllDocuments(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	pagination, err := helper.GetPagination(r)
	if err != nil {
		h.logger.Error("error in parsing pagination", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid pagination", http.StatusBadRequest)))
		return
	}

	response := &responseGetAllDocuments{}

	response.Documents, response.Count, err = h.documentService.GetAllDocuments(userID, *pagination)
	if err != nil {
		h.logger.Error("error getting all documents", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	response.Message = "Documents fetched successfully"
	renderx.JSON(w, http.StatusOK, response)
}
