package prompt_templates

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type createTemplateCollection struct {
	Name string `json:"name" validate:"required"`
}

func (h *httpHandler) createPromptTemplateCollection(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)

	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User Header", http.StatusUnauthorized)))
		return
	}

	requestBody := &createTemplateCollection{}
	err = json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	promptTemplateCollection, err := h.promptTemplateService.CreateNewPromptTemplateCollection(userID, requestBody.Name)
	if err != nil {
		h.logger.Error("error creating prompt template collection", "error", err.Error())
		if err == custom_errors.PromptTemplateCollectionNameExists {
			errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusUnprocessableEntity)))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.DBError()))
		return
	}

	renderx.JSON(w, http.StatusOK, promptTemplateCollection)
}
