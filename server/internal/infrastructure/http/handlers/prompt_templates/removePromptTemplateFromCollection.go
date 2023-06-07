package prompt_templates

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) removePromptTemplateFromCollection(w http.ResponseWriter, r *http.Request) {

	userID, err := helper.GetUserID(r)

	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User Header", http.StatusUnauthorized)))
		return
	}

	ptID := helper.GetPathParamByName(r, "prompt_template_id")
	promptTemplateID, err := helper.StringToInt(ptID)
	if err != nil {
		h.logger.Error("error in parsing prompt template id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid prompt template id", http.StatusBadRequest)))
		return
	}

	err = h.promptTemplateService.RemovePromptTemplateFromCollection(userID, uint(promptTemplateID))

	if err != nil {
		h.logger.Error("error while removing prompt_template from collection", "error", err.Error())
		if err == custom_errors.PromptTemplateNotFound {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("prompt_template not found", http.StatusNotFound)))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	renderx.JSON(w, http.StatusOK, "prompt_template removed from collection")
}
