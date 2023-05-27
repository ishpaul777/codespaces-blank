package persona

import (
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) getPersonaChatsByUserID(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	personaID, err := helper.StringToInt(helper.GetPathParamByName(r, "persona_id"))
	if err != nil {
		h.logger.Error("error in parsing persona id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid persona id", http.StatusBadRequest)))
		return
	}

	pagination, err := helper.GetPagination(r)
	if err != nil {
		h.logger.Error("error in parsing pagination", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid pagination", http.StatusBadRequest)))
		return
	}

	chats, count, err := h.personaService.GetAllPersonaChatByUserID(userID, uint(personaID), *pagination)
	if err != nil {
		h.logger.Error("error in fetching chats", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("error in fetching chats", http.StatusInternalServerError)))
		return
	}

	responseMap := make(map[string]interface{})
	responseMap["chats"] = chats
	responseMap["count"] = count
	responseMap["message"] = "Chats fetched successfully"

	renderx.JSON(w, http.StatusOK, responseMap)
}
