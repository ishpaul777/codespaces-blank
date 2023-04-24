package chat

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/sashabaranov/go-openai"
)

func (h *httpHandler) createChatResponseStream(w http.ResponseWriter, r *http.Request) {
	header := w.Header()
	header.Set("Content-Type", "text/event-stream")
	header.Set("Cache-Control", "no-cache")
	header.Set("Connection", "keep-alive")
	header.Set("X-Accel-Buffering", "no")

	prompt := r.URL.Query().Get("prompt")
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

	go getDatafromOpenAI(msgChan, errChan, prompt)

	for {
		select {
		case msg := <-msgChan:
			// if msg == "[DONE]" {
			// 	h.logger.Info("chat response streamed successfully")
			// 	return
			// }
			fmt.Fprintln(w, "event: message")
			fmt.Fprintf(w, "data: %s\n\n", msg)
			f.Flush()
		case err := <-errChan:
			h.logger.Error("error in getting data from openai", "error", err.Error())
			if errors.Is(err, io.EOF) {
				fmt.Fprintln(w, "event: error")
				fmt.Fprintf(w, "data: [DONE] \n\n")
				f.Flush()
				return
			}

			fmt.Fprintln(w, "event: error")
			fmt.Fprintf(w, "data: %s \n\n", err.Error())
			f.Flush()
			return
		}
	}

}

func getDatafromOpenAI(dataChan chan<- string, errChan chan<- error, prompt string) {
	c := openai.NewClient("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")
	ctx := context.Background()

	req := openai.ChatCompletionRequest{
		Model: openai.GPT3Dot5Turbo,
		// MaxTokens: 30,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
		Stream: true,
	}
	stream, err := c.CreateChatCompletionStream(ctx, req)
	if err != nil {
		fmt.Printf("CompletionStream error: %v\n", err)
		return
	}
	defer stream.Close()

	for {
		response, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			errChan <- err
			return
		}

		if err != nil {
			errChan <- err
			return
		}

		dataChan <- response.Choices[0].Delta.Content
	}
}
