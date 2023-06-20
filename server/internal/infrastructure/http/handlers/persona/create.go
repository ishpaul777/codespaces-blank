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

type createPersonaRequest struct {
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Avatar      string             `json:"avatar"`
	Prompt      string             `json:"prompt"`
	Visibility  *models.VISIBILITY `json:"visibility,omitempty"`
	Model       string             `json:"model,omitempty"`
	IsDefault   *bool              `json:"is_default,omitempty"`
}

func (h *httpHandler) create(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)

	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	requestBody := &createPersonaRequest{}
	err = json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	persona, err := h.personaService.CreateNewPersona(userID, requestBody.Name, requestBody.Description, requestBody.Prompt, requestBody.Avatar, requestBody.Model, requestBody.Visibility, requestBody.IsDefault)
	if err != nil {
		h.logger.Error("error creating persona")
		if err == custom_errors.ErrNameExists {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("persona with same name exists", http.StatusConflict)))
			return
		} else if customError, ok := err.(*custom_errors.CustomError); ok {
			if customError.Context == custom_errors.InvalidVisibility {
				errorx.Render(w, errorx.Parser(errorx.GetMessage(customError.Error(), http.StatusBadRequest)))
				return
			}
			errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	renderx.JSON(w, http.StatusCreated, persona)

}
