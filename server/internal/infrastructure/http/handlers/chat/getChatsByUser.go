package chat

import (
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
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
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusBadRequest)))
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

type responseGetAllChatCollections struct {
	Total           uint                    `json:"total"`
	ChatCollections []models.ChatCollection `json:"collections"`
	Message         string                  `json:"message"`
}

func (h *httpHandler) getAllChatCollectionsByUser(w http.ResponseWriter, r *http.Request) {
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
	response := &responseGetAllChatCollections{}
	response.ChatCollections, response.Total, err = h.chatService.GetAllChatCollectionsByUser(userID, *pagination)
	if err != nil {
		h.logger.Error("error getting all chats", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}
	response.Message = "Chat Collections fetched successfully"
	renderx.JSON(w, http.StatusOK, response)
}

func (h *httpHandler) getChatCollectionByID(w http.ResponseWriter, r *http.Request) {
	_, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}
	chatCollectionID := helper.GetPathParamByName(r, "chat_collection_id")
	chatColID, err := helper.StringToInt(chatCollectionID)
	if err != nil {
		h.logger.Error("error in parsing chatCollectionID", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid chatCollectionID", http.StatusBadRequest)))
		return
	}
	response := &models.ChatCollection{}
	response, err = h.chatService.GetChatCollectionByID(uint(chatColID))
	if err != nil {
		h.logger.Error("error getting all chats", "error", err.Error())
		if err == custom_errors.ErrNotFound {
			errorx.Render(w, errorx.Parser(errorx.RecordNotFound()))
			return
		}
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}
	renderx.JSON(w, http.StatusOK, response)
}
