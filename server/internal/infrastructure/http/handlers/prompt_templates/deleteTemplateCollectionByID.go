package prompt_templates

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) deleteTemplateCollectionByID(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)

	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	tcID := helper.GetPathParamByName(r, "template_collection_id")
	templateCollectionID, err := helper.StringToInt(tcID)
	if err != nil {
		h.logger.Error("error in parsing prompt template id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid prompt template id", http.StatusBadRequest)))
		return
	}

	err = h.promptTemplateService.DeletePromptTemplateCollectionByID(userID, uint(templateCollectionID))

	if err != nil {
		h.logger.Error("error in deleting prompt template", "error", err.Error())
		if err == custom_errors.PromptTemplateCollectionNotFound {
			errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusNotFound)))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "template collection deleted succcesfully",
	})

}
