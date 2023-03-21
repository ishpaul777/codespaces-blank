package prompts

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type generateRequest struct {
	GenerateFor string `json:"generate_for"`
	InputPrompt string `json:"input"`
	MaxTokens   uint   `json:"max_tokens"`
}

func (h *httpHandler) generateText(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User")
	uID, err := strconv.Atoi(userID)
	if err != nil {
		h.logger.Error("error converting user id to int", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}
	requestBody := &generateRequest{}
	err = json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	prompt, err := h.promptService.GenerateText(uint(uID), requestBody.InputPrompt, requestBody.GenerateFor, requestBody.MaxTokens)

	renderx.JSON(w, http.StatusOK, prompt)
}
