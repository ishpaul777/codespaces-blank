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

	orgID, err := helper.GetOrgID(r)
	if err != nil {
		h.logger.Error("error in parsing X-Organisation header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-Organisation header", http.StatusUnauthorized)))
		return
	}

	requestBody := &createDocument{}
	err = json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	input := &models.CreateDocumentReq{
		Title:       requestBody.Title,
		Description: requestBody.Description,
		UserID:      userID,
		OrgID:       orgID,
	}
	document, err := h.documentService.CreateNewDocument(input)
	if err != nil {
		h.logger.Error("error creating new document", "error", err.Error())
		if err == custom_errors.ErrNameExists {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("document with same title already exists", http.StatusUnprocessableEntity)))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	renderx.JSON(w, http.StatusOK, document)
}
