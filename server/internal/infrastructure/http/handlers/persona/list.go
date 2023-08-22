package persona

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type responseGetAllPersonas struct {
	Count    uint             `json:"count"`
	Personas []models.Persona `json:"personas"`
	Message  string           `json:"message"`
}

func (h *httpHandler) list(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	// _, err = helper.GetOrgID(r)
	// if err != nil {
	// 	h.logger.Error("error in parsing X-Org header", "error", err.Error())
	// 	errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
	// 	return
	// }

	pagination, err := helper.GetPagination(r)
	if err != nil {
		h.logger.Error("error in parsing pagination", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusBadRequest)))
		return
	}

	pagination.Queries = map[string]string{"visibility": helper.GetQueryParamByName(r, "visibility")}

	response := &responseGetAllPersonas{}

	response.Personas, response.Count, err = h.personaService.GetAllPersonas(userID, *pagination)
	if err != nil {
		h.logger.Error("error getting all personas", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	response.Message = "Personas fetched successfully"
	renderx.JSON(w, http.StatusOK, response)
}
