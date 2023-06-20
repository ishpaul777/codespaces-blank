package chat

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type updateChatColRequest struct {
	Name string `json:"name"`
}

func (h *httpHandler) updatChatColByID(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	requestBody := &updateChatColRequest{}
	err = json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	ccID := helper.GetPathParamByName(r, "chat_collection_id")
	chatID, err := helper.StringToInt(ccID)
	if err != nil {
		h.logger.Error("error in parsing chat id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid chat id", http.StatusBadRequest)))
		return
	}

	err = h.chatService.UpdateChatColByID(userID, uint(chatID), requestBody.Name)
	if err != nil {
		h.logger.Error("error updating chat", "error", err.Error())
		if err == custom_errors.ErrNotFound {
			errorx.Render(w, errorx.Parser(errorx.RecordNotFound()))
			return
		} else if err == custom_errors.ErrNameExists {
			errorx.Render(w, errorx.Parser(errorx.GetMessage("chat collection name already exists", http.StatusUnprocessableEntity)))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Chat collection update successfully",
	})
}
