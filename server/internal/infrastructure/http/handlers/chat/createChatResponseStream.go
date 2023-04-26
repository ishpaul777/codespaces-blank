package chat

import (
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
)

type chatStreamRequestBody struct {
	Prompt   string
	Model    string
	Provider string
	ChatID   *uint
}

func getRequestBodyFromQueryParams(r *http.Request) (*chatStreamRequestBody, error) {
	requestBody := &chatStreamRequestBody{}
	queryParams := r.URL.Query()
	requestBody.Prompt = queryParams.Get("prompt")
	requestBody.Model = queryParams.Get("model")
	requestBody.Provider = queryParams.Get("provider")

	cID := queryParams.Get("chat_id")
	if cID != "" {
		chatID, err := helper.StringToInt(cID)
		if err != nil {
			return nil, err
		}
		uintChatID := uint(chatID)
		requestBody.ChatID = &uintChatID
	} else {
		requestBody.ChatID = nil
	}

	return requestBody, nil
}

func (h *httpHandler) createChatResponseStream(w http.ResponseWriter, r *http.Request) {
	header := w.Header()
	header.Set("Content-Type", "text/event-stream")
	header.Set("Cache-Control", "no-cache")
	header.Set("Connection", "keep-alive")
	header.Set("X-Accel-Buffering", "no")

	requestBody, err := getRequestBodyFromQueryParams(r)
	if err != nil {
		h.logger.Error("error in parsing request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid query params", http.StatusBadRequest)))
		return
	}

	var userID uint = 1

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

	go h.chatService.GenerateStreamingResponse(userID, requestBody.ChatID, requestBody.Provider, requestBody.Model, requestBody.Prompt, msgChan, errChan)

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

// func (h *httpHandler) createChatResponseStream(w http.ResponseWriter, r *http.Request) {
// 	header := w.Header()
// 	header.Set("Content-Type", "text/event-stream")
// 	header.Set("Cache-Control", "no-cache")
// 	header.Set("Connection", "keep-alive")
// 	header.Set("X-Accel-Buffering", "no")

// 	prompt := r.URL.Query().Get("prompt")
// 	f, ok := w.(http.Flusher)
// 	if !ok {
// 		return
// 	}

// 	msgChan := make(chan string)
// 	errChan := make(chan error)

// 	defer func() {
// 		close(msgChan)
// 		msgChan = nil
// 		close(errChan)
// 		errChan = nil
// 	}()

// 	go getDatafromOpenAI(msgChan, errChan, prompt)

// 	for {
// 		select {
// 		case msg := <-msgChan:
// 			// fmt.Fprintln(w, "event: message")
// 			// fmt.Fprintf(w, "data: %s\n\n", msg)
// 			messageMap := map[string]string{
// 				"message": msg,
// 			}

// 			byteMessage, err := json.Marshal(messageMap)
// 			if err != nil {
// 				h.logger.Error("error in marshalling message", "error", err.Error())
// 				return
// 			}

// 			io.WriteString(w, "event: message\n")
// 			io.WriteString(w, "data: "+string(byteMessage)+"\n\n")
// 			f.Flush()

// 		case err := <-errChan:
// 			h.logger.Error("error in getting data from openai", "error", err.Error())
// 			if errors.Is(err, io.EOF) {
// 				fmt.Fprintln(w, "event: error")
// 				fmt.Fprintf(w, "data: [DONE] \n\n")
// 				f.Flush()
// 				return
// 			}

// 			fmt.Fprintln(w, "event: error")
// 			fmt.Fprintf(w, "data: %s \n\n", err.Error())
// 			f.Flush()
// 			return
// 		}
// 	}

// }

// func getDatafromOpenAI(dataChan chan<- string, errChan chan<- error, prompt string) {
// 	c := openai.NewClient("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")
// 	ctx := context.Background()

// 	req := openai.ChatCompletionRequest{
// 		Model: openai.GPT3Dot5Turbo,
// 		// MaxTokens: 30,
// 		Messages: []openai.ChatCompletionMessage{
// 			{
// 				Role:    openai.ChatMessageRoleUser,
// 				Content: prompt,
// 			},
// 		},
// 		Stream: true,
// 	}
// 	stream, err := c.CreateChatCompletionStream(ctx, req)
// 	if err != nil {
// 		fmt.Printf("CompletionStream error: %v\n", err)
// 		return
// 	}
// 	defer stream.Close()

// 	for {
// 		response, err := stream.Recv()
// 		if errors.Is(err, io.EOF) {
// 			errChan <- err
// 			return
// 		}

// 		if err != nil {
// 			errChan <- err
// 			return
// 		}

// 		dataChan <- response.Choices[0].Delta.Content
// 	}
// }
