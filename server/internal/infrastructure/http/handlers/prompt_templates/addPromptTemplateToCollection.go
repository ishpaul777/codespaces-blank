package prompt_templates

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type addPromptTemplateToCollectionRequest struct {
	CollectionID uint `json:"collection_id"`
}

func (h *httpHandler) addPromptTemplateToCollection(w http.ResponseWriter, r *http.Request) {

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

	requestBody := &addPromptTemplateToCollectionRequest{}
	err = json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	err = h.promptTemplateService.AddPromptTemplateToCollection(userID, uint(promptTemplateID), requestBody.CollectionID)

	if err != nil {
		h.logger.Error("error add prompt_template to collection", "error", err.Error())
		if err == custom_errors.PromptTemplateNotFound {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("prompt_template not found", http.StatusNotFound)))
			return
		} else if err == custom_errors.PromptTemplateCollectionNotFound {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("collection not found", http.StatusNotFound)))
			return
		}
	}

	renderx.JSON(w, http.StatusOK, "prompt_template added to collection")

}
