package chat

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type chatRequestBody struct {
	Prompt                 string  `json:"prompt"`
	Model                  string  `json:"model"`
	ChatID                 *uint   `json:"id"`
	Provider               string  `json:"provider"`
	Temperature            float32 `json:"temperature"`
	SystemPrompt           string  `json:"system_prompt"`
	AdditionalInstructions string  `json:"additional_instructions"`
	Stream                 bool    `json:"stream"`
}

func (h *httpHandler) createChatResponse(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	var requestBody chatRequestBody
	err = json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		h.logger.Error("error while decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	if requestBody.Stream {
		header := w.Header()
		header.Set("Content-Type", "text/event-stream")
		header.Set("Cache-Control", "no-cache")
		header.Set("Connection", "keep-alive")
		header.Set("X-Accel-Buffering", "no")

		f, ok := w.(http.Flusher)
		if !ok {
			return
		}

		msgChan := make(chan string)
		errChan := make(chan error)

		defer func() {
			close(msgChan)
			msgChan = nil
			close(errChan)
			errChan = nil
		}()

		go h.chatService.GenerateStreamingResponse(userID, requestBody.ChatID, requestBody.Provider, requestBody.Model, requestBody.Temperature, requestBody.SystemPrompt, requestBody.AdditionalInstructions, requestBody.Prompt, msgChan, errChan)

		for {
			select {
			case msg := <-msgChan:
				io.WriteString(w, "event: message\n")
				io.WriteString(w, "data: "+msg+"\n\n")
				f.Flush()

			case err := <-errChan:
				if errors.Is(err, io.EOF) {
					fmt.Fprintln(w, "event: error")
					fmt.Fprintf(w, "data: [DONE] \n\n")
					f.Flush()
					h.logger.Info("streaming response completed")
					return
				}
				h.logger.Error("error in getting data from openai", "error", err.Error())
				fmt.Fprintln(w, "event: error")
				fmt.Fprintf(w, "data: %s \n\n", err.Error())
				f.Flush()
				return
			}
		}
	} else {
		chatResponse, err := h.chatService.GenerateResponse(userID, requestBody.ChatID, requestBody.Provider, requestBody.Model, requestBody.Temperature, requestBody.SystemPrompt, requestBody.AdditionalInstructions, requestBody.Prompt)
		if err != nil {
			h.logger.Error("error while generating chat response", "error", err.Error())
			errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
			return
		}

		renderx.JSON(w, http.StatusOK, chatResponse)
	}
}
