package documents

import (
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) getDocumentByID(w http.ResponseWriter, r *http.Request) {
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

	document, err := h.documentService.GetDocumentByID(userID, uint(documentID))
	if err != nil {
		h.logger.Error("error getting document by id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	renderx.JSON(w, http.StatusOK, document)
}
