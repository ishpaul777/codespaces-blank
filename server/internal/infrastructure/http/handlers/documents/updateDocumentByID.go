package documents

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type updateRequest struct {
	Title       string `json:"title,omitempty"`
	Description string `json:"description,omitempty"`
}

func (h *httpHandler) updateDocumentByID(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	orgID, err := helper.GetOrgID(r)
	if err != nil {
		h.logger.Error("error in parsing X-Org header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	dID := helper.GetPathParamByName(r, "document_id")
	documentID, err := helper.StringToInt(dID)
	if err != nil {
		h.logger.Error("error in parsing document id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid document id", http.StatusBadRequest)))
		return
	}

	var updateReq updateRequest
	err = json.NewDecoder(r.Body).Decode(&updateReq)
	if err != nil {
		h.logger.Error("error in decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid request body", http.StatusBadRequest)))
		return
	}

	input := &models.UpdateDocumentReq{
		Title:       updateReq.Title,
		Description: updateReq.Description,
		UserID:      userID,
		DocumentID:  uint(documentID),
		OrgID:       orgID,
	}

	updatedDocument, err := h.documentService.UpdateDocumentByID(input)
	if err != nil {
		h.logger.Error("error updating document by id", "error", err.Error())
		if err == custom_errors.ErrNameExists {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("document with same title exists", http.StatusConflict)))
			return
		} else if err == custom_errors.ErrNotFound {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("document not found", http.StatusNotFound)))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, updatedDocument)
}
