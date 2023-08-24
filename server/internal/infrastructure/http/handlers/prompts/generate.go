package prompts

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

type generateRequest struct {
	GenerateFor            string `json:"generate_for"`
	InputPrompt            string `json:"input"`
	MaxTokens              uint   `json:"max_tokens"`
	Provider               string `json:"provider"`
	Model                  string `json:"model"`
	Stream                 bool   `json:"stream"`
	AdditionalInstructions string `json:"additional_instructions"`
}

func (h *httpHandler) generateText(w http.ResponseWriter, r *http.Request) {
	uID, err := helper.GetUserID(r)
	if err != nil {
		h.logger.Error("error getting X-User header", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	orgID, err := helper.GetOrgID(r)
	if err != nil {
		h.logger.Error("error getting X-Organisation header", "error", err.Error())
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

		dataChan := make(chan string)
		errChan := make(chan error)

		defer func() {
			close(dataChan)
			dataChan = nil
			close(errChan)
			errChan = nil
		}()

		input := &models.InputForGenerateTextResponseStream{
			InputForGenerateTextResponse: models.InputForGenerateTextResponse{
				Provider:               requestBody.Provider,
				Model:                  requestBody.Model,
				OrgID:                  orgID,
				UserID:                 uID,
				Input:                  requestBody.InputPrompt,
				GenerateFor:            requestBody.GenerateFor,
				AdditionalInstructions: requestBody.AdditionalInstructions,
				MaxTokens:              requestBody.MaxTokens,
			},
			DataChan: dataChan,
			ErrChan:  errChan,
		}

		go h.promptService.GenerateTextStream(input)
		for {
			select {
			case msg := <-dataChan:
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
		input := &models.InputForGenerateTextResponse{
			Provider:               requestBody.Provider,
			Model:                  requestBody.Model,
			OrgID:                  orgID,
			UserID:                 uID,
			Input:                  requestBody.InputPrompt,
			GenerateFor:            requestBody.GenerateFor,
			AdditionalInstructions: requestBody.AdditionalInstructions,
			MaxTokens:              requestBody.MaxTokens,
		}

		response, err := h.promptService.GenerateText(input)

		if err != nil {
			h.logger.Error("error generating text", "error", err.Error())
			errorx.Render(w, errorx.Parser(errorx.DecodeError()))
			return
		}

		renderx.JSON(w, http.StatusOK, response)
	}

}
