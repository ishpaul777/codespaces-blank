package prompt_templates

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type createPromptTemplate struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description" `
	Prompt      string `json:"prompt" validate:"required"`
}

func (h *httpHandler) createPromptTemplate(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)

	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User Header", http.StatusUnauthorized)))
		return
	}

	requestBody := &createPromptTemplate{}
	err = json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	promptTemplate := &models.PromptTemplate{}
	err = promptTemplate.ValidatePrompt(requestBody.Prompt)
	if err != nil {
		h.logger.Error("error validating prompt", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusBadRequest)))
		return
	}

	promptTemplate, err = h.promptTemplateService.CreateNewPromptTemplate(userID, requestBody.Title, requestBody.Description, requestBody.Prompt)
	if err != nil {
		h.logger.Error("error creating prompt template", "error", err.Error())
		if err == custom_errors.PromptTemplateTitleExists {
			errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusUnprocessableEntity)))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.DBError()))
		return
	}

	renderx.JSON(w, http.StatusOK, promptTemplate)
}
