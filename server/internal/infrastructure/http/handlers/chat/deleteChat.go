package chat

import (
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) deleteChat(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	cID := helper.GetPathParamByName(r, "chat_id")
	chatID, err := helper.StringToInt(cID)
	if err != nil {
		h.logger.Error("error in parsing chat id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid chat id", http.StatusBadRequest)))
		return
	}

	err = h.chatService.DeleteChat(userID, uint(chatID))
	if err != nil {
		h.logger.Error("error deleting chat", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Chat deleted successfully",
	})
}
