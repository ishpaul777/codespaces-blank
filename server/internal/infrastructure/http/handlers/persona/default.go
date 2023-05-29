package persona

import (
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) default_(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	pagination, err := helper.GetPagination(r)
	if err != nil {
		h.logger.Error("error in parsing pagination", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid pagination", http.StatusBadRequest)))
		return
	}

	response := &responseGetAllPeersonas{}

	response.Pesonas, response.Count, err = h.personaService.GetAllDefaultPersonas(userID, *pagination)
	if err != nil {
		h.logger.Error("error getting all personas", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	response.Message = "Default Personas fetched successfully"
	renderx.JSON(w, http.StatusOK, response)
}
