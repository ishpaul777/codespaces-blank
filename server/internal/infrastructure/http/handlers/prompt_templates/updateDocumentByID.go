package prompt_templates

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type updateRequest struct {
	Title       string `json:"title,omitempty"`
	Description string `json:"description,omitempty"`
	Prompt      string `json:"prompt,omitempty"`
}

func (h *httpHandler) updatePrompTemplateID(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	ptID := helper.GetPathParamByName(r, "prompt_template_id")
	promptTemplateID, err := helper.StringToInt(ptID)
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

	updatePromptTemplate, err := h.promptTemplateService.UpdatePromptTemplateByID(userID, uint(promptTemplateID), updateReq.Title, updateReq.Description, updateReq.Prompt)
	if err != nil {
		h.logger.Error("error updating document by id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, updatePromptTemplate)
}
