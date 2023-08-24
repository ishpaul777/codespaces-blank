package chat

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type chatRequestBody struct {
	Messages               []models.Message `json:"messages"`
	Model                  string           `json:"model"`
	ChatID                 *uint            `json:"id"`
	Provider               string           `json:"provider"`
	Temperature            float32          `json:"temperature"`
	SystemPrompt           string           `json:"system_prompt"`
	AdditionalInstructions string           `json:"additional_instructions"`
	Stream                 bool             `json:"stream"`
}

func (h *httpHandler) createChatResponse(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	orgID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-Organisation header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-org header", http.StatusUnauthorized)))
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
			fmt.Print("closed channel is called in the end")
			close(msgChan)
			msgChan = nil
			close(errChan)
			errChan = nil
		}()

		input := models.GenerateResponseForChatStream{
			GenerateResponseforChat: models.GenerateResponseforChat{
				UserID:                 userID,
				OrgID:                  orgID,
				ChatID:                 requestBody.ChatID,
				Provider:               requestBody.Provider,
				Model:                  requestBody.Model,
				Temperature:            requestBody.Temperature,
				SystemPrompt:           requestBody.SystemPrompt,
				AdditionalInstructions: requestBody.AdditionalInstructions,
				Messages:               requestBody.Messages,
			},
			DataChan: msgChan,
			ErrChan:  errChan,
		}

		go h.chatService.GenerateStreamingResponse(input)

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
		input := models.GenerateResponseforChat{
			UserID:                 userID,
			OrgID:                  orgID,
			ChatID:                 requestBody.ChatID,
			Provider:               requestBody.Provider,
			Model:                  requestBody.Model,
			Temperature:            requestBody.Temperature,
			SystemPrompt:           requestBody.SystemPrompt,
			AdditionalInstructions: requestBody.AdditionalInstructions,
			Messages:               requestBody.Messages,
		}

		chatResponse, err := h.chatService.GenerateResponse(input)
		if err != nil {
			h.logger.Error("error while generating chat response", "error", err.Error())
			errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
			return
		}

		renderx.JSON(w, http.StatusOK, chatResponse)
	}
}
