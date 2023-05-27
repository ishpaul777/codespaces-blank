package persona

import (
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) getPersonaChatByID(w http.ResponseWriter, r *http.Request) {
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

	cID := helper.GetPathParamByName(r, "chat_id")
	chatID, err := helper.StringToInt(cID)
	if err != nil {
		h.logger.Error("error in parsing chat id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid chat id", http.StatusBadRequest)))
		return
	}

	chat, err := h.personaService.GetPersonaChatByID(userID, uint(personaID), uint(chatID))
	if err != nil {
		h.logger.Error("error in fetching chat", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("error in fetching chat", http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, chat)
}
