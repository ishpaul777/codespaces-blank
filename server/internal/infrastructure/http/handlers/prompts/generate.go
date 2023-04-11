package prompts

import (
	"encoding/json"
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type generateRequest struct {
	GenerateFor string `json:"generate_for"`
	InputPrompt string `json:"input"`
	MaxTokens   uint   `json:"max_tokens"`
	Provider    string `json:"provider"`
}

func (h *httpHandler) generateText(w http.ResponseWriter, r *http.Request) {
	uID, err := helper.GetUserID(r)
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

	if requestBody.Provider == "" {
		requestBody.Provider = "openai"
	}

	prompt, err := h.promptService.GenerateText(requestBody.Provider, uint(uID), requestBody.InputPrompt, requestBody.GenerateFor, requestBody.MaxTokens)

	if err != nil {
		h.logger.Error("error generating text", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	renderx.JSON(w, http.StatusOK, prompt)
}
