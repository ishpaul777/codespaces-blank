package documents

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type createDocument struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

func (h *httpHandler) createNewDocument(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	requestBody := &createDocument{}
	err = json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	document, err := h.documentService.CreateNewDocument(userID, requestBody.Title, requestBody.Description)
	if err != nil {
		h.logger.Error("error creating new document", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	renderx.JSON(w, http.StatusOK, document)
}
