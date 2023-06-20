package prompt_templates

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type responseGetAllPromptTemplates struct {
	Count           uint                    `json:"count"`
	PromptTemplates []models.PromptTemplate `json:"prompt_templates"`
	Message         string                  `json:"message"`
}

func (h *httpHandler) getAllPromptTemplates(w http.ResponseWriter, r *http.Request) {
	usedID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	pagination, err := helper.GetPagination(r)
	if err != nil {
		h.logger.Error("error in parsing pagination", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusBadRequest)))
		return
	}

	reponse := &responseGetAllPromptTemplates{}

	reponse.PromptTemplates, reponse.Count, err = h.promptTemplateService.GetAllPromptTemplates(usedID, *pagination)
	if err != nil {
		h.logger.Error("error getting all prompt_templates", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	reponse.Message = "Prompt templates retrieved successfully"
	renderx.JSON(w, http.StatusOK, reponse)
}
