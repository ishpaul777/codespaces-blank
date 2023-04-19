package chat

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type chatRequestBody struct {
	Messages []models.Message `json:"messages"`
	Model    string           `json:"model"`
	ChatID   *uint            `json:"id"`
	Provider string           `json:"provider"`
}

func (h *httpHandler) createChatResponse(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	var reqBody chatRequestBody
	err = json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		h.logger.Error("error while decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	chatResponse, err := h.chatService.GenerateResponse(userID, reqBody.ChatID, reqBody.Provider, reqBody.Model, reqBody.Messages)
	if err != nil {
		h.logger.Error("error while generating chat response", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	renderx.JSON(w, http.StatusOK, chatResponse)
}
