package prompt_templates

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type response struct {
	Count               uint                              `json:"count"`
	TemplateCollections []models.PromptTemplateCollection `json:"prompt_template_collections"`
	Message             string                            `json:"message"`
}

func (h *httpHandler) getAllTemplateCollections(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
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

	res := &response{}

	res.TemplateCollections, res.Count, err = h.promptTemplateService.GetAllPromptTemplateCollections(userID, *pagination)
	if err != nil {
		h.logger.Error("error getting all prompt_templates", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	res.Message = "Prompt template collections retrieved successfully"
	renderx.JSON(w, http.StatusOK, res)
}
