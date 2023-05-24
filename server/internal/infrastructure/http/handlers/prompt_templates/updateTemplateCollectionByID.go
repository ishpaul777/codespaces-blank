package prompt_templates

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type updateColRequest struct {
	Name string `json:"name"`
}

func (h *httpHandler) updateTemplateCollectionByID(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	tcID := helper.GetPathParamByName(r, "template_collection_id")
	templateCollectionID, err := helper.StringToInt(tcID)
	if err != nil {
		h.logger.Error("error in parsing template collection id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid template collection id", http.StatusBadRequest)))
		return
	}

	var updateReq updateColRequest
	err = json.NewDecoder(r.Body).Decode(&updateReq)

	if err != nil {
		h.logger.Error("error in decoding body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("error in decoding body", http.StatusBadRequest)))
		return
	}

	updateTemplateCollection, err := h.promptTemplateService.UpdatePromptTemplateCollectionByID(userID, uint(templateCollectionID), updateReq.Name)
	if err != nil {
		h.logger.Error("error updating template collection by id", "error", err.Error())
		if err == custom_errors.PromptTemplateCollectionNotFound {
			errorx.Render(w, errorx.Parser(errorx.RecordNotFound()))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, updateTemplateCollection)
}
