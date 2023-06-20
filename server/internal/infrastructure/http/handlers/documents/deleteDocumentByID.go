package documents

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) deleteDocumentByID(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
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

	err = h.documentService.DeleteDocumentByID(userID, uint(documentID))
	if err != nil {
		h.logger.Error("error deleting document by id", "error", err.Error())
		if err == custom_errors.ErrNotFound {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("document not found", http.StatusNotFound)))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Document deleted successfully",
	})
}
