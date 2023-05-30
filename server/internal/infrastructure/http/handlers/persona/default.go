package persona

import (
	"net/http"

	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) getDefaultPersona(w http.ResponseWriter, r *http.Request) {

	response := &responseGetAllPersonas{}
	var err error
	response.Personas, err = h.personaService.GetAllDefaultPersonas()
	if err != nil {
		h.logger.Error("error getting all personas", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	response.Count = uint(len(response.Personas))
	response.Message = "Default Personas fetched successfully"
	renderx.JSON(w, http.StatusOK, response)
}
