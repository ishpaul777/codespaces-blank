package persona

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
)

type chatRequestBody struct {
	Messages               []models.Message `json:"messages"`
	ChatID                 *uint            `json:"id"`
	AdditionalInstructions string           `json:"additional_instructions"`
	Stream                 bool             `json:"stream"`
}

func (h *httpHandler) createChat(w http.ResponseWriter, r *http.Request) {
	userID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error in parsing X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid X-User header", http.StatusUnauthorized)))
		return
	}

	pID := helper.GetPathParamByName(r, "persona_id")
	personaID, err := helper.StringToInt(pID)
	if err != nil {
		h.logger.Error("error in parsing persona id", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid persona id", http.StatusBadRequest)))
		return
	}

	var chatReq chatRequestBody
	err = json.NewDecoder(r.Body).Decode(&chatReq)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	if chatReq.Stream {
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

		go h.personaService.ChatWithPersonaStream(userID, uint(personaID), chatReq.ChatID, chatReq.AdditionalInstructions, chatReq.Messages, msgChan, errChan)

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
	}
}
