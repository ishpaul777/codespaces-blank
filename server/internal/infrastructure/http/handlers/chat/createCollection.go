package chat

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/internal/domain/constants/custom_errors"
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type createChatCollection struct {
	Name string `json:"name"`
}

func (h *httpHandler) createChatCollection(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)

	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User Header", http.StatusUnauthorized)))
		return
	}

	requestBody := &createChatCollection{}
	err = json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	chatCollection := &models.ChatCollection{}
	chatCollection, err = h.chatService.CreateChatCollection(userID, requestBody.Name)
	if err != nil {
		if err == custom_errors.ChatCollectionNameExists {
			errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusUnprocessableEntity)))
			return
		}
		h.logger.Error("error creating chat collection", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DBError()))
		return
	}

	renderx.JSON(w, http.StatusCreated, chatCollection)
}
