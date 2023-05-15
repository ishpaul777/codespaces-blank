package prompt_templates

import (
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) getPromptTemplateByID(w http.ResponseWriter, r *http.Request) {
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

	promptTemplate, err := h.promptTemplateService.GetAllPromptTemplateByID(userID, uint(promptTemplateID))
	if err != nil {
		h.logger.Error("error in fetching prompt template by id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("error in fetching prompt template by id", http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, promptTemplate)
}
