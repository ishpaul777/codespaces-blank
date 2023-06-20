package prompt_templates

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) getTemplateCollectionByID(w http.ResponseWriter, r *http.Request) {
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

	templateCollection, err := h.promptTemplateService.GetPromptTemplateCollectionByID(userID, uint(templateCollectionID))
	if err != nil {
		h.logger.Error("error in fetching template collection by id", "error", err.Error())
		if err == custom_errors.ErrNotFound {
			errorx.Render(w, errorx.Parser(errorx.RecordNotFound()))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.GetMessage("error in fetching template collection by id", http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, templateCollection)
}
