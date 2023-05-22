package persona

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type updateRequest struct {
	Name        string             `json:"name,omitempty"`
	Description string             `json:"description,omitempty"`
	Prompt      string             `json:"prompt,omitempty"`
	Avatar      string             `json:"avatar,omitempty"`
	Visibility  *models.VISIBILITY `json:"visibility,omitempty"`
}

func (h *htttHandler) update(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	pID := helper.GetPathParamByName(r, "persona_id")
	personaID, err := helper.StringToInt(pID)
	if err != nil {
		h.logger.Error("error in parsing persona id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid persona id", http.StatusBadRequest)))
		return
	}

	var updateReq updateRequest
	err = json.NewDecoder(r.Body).Decode(&updateReq)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	updatePersona, err := h.personaService.UpdatePersonaByID(userID, uint(personaID), updateReq.Name, updateReq.Description, updateReq.Prompt, updateReq.Avatar, updateReq.Visibility)
	if err != nil {

		h.logger.Error("error updating document by id", "error", err.Error())
		if err == custom_errors.PersonaNameExists {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("persona with same name exists", http.StatusBadRequest)))
			return
		} else if err == custom_errors.PersonaVisibilityInvalid {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid visibility", http.StatusBadRequest)))
			return
		} else if err == custom_errors.PersonaNotFound {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("persona not found", http.StatusNotFound)))
			return
		}
	}

	renderx.JSON(w, http.StatusOK, updatePersona)

}
