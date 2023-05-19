package chat

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type request struct {
	ChatCollectionID uint `json:"chat_collection_id"`
	ChatID           uint `json:"chat_id"`
}

func (h *httpHandler) addChatToCollection(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)

	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}
	res := request{}
	err = json.NewDecoder(r.Body).Decode(&res)
	if err != nil {
		h.logger.Error("error in decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("error in decoding request body", http.StatusBadRequest)))
		return
	}

	err = h.chatService.AddChatToCollection(userID, res.ChatID, res.ChatCollectionID)
	if err != nil {
		h.logger.Error("error adding chat to collection", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Chat added to collection successfully",
	})

}
