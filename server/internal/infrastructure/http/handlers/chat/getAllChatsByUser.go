package chat

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type responseGetAllChats struct {
	Total   uint          `json:"total"`
	Chats   []models.Chat `json:"chats"`
	Message string        `json:"message"`
}

func (h *httpHandler) getAllChatsByUser(w http.ResponseWriter, r *http.Request) {
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

	response := &responseGetAllChats{}

	response.Chats, response.Total, err = h.chatService.GetChatHistoryByUser(userID, *pagination)
	if err != nil {
		h.logger.Error("error getting all chats", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	response.Message = "Chats fetched successfully"
	renderx.JSON(w, http.StatusOK, response)
}
