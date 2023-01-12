package text

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/factly/x/errorx"
	"github.com/factly/x/loggerx"
	"github.com/factly/x/renderx"
	gogpt "github.com/sashabaranov/go-gpt3"
	"github.com/spf13/viper"
)

// generateRequest is the json-model for decoding gpt http requests
type generateRequest struct {
	Model  string `json:"model"`      // chatgpt model which will process the request
	Prompt string `json:"prompt"`     // input to the gpt3 model
	Tokens int    `json:"max_tokens"` // Token is the maximum number of output words that gpt3 api gives
}

func generate(w http.ResponseWriter, r *http.Request) {
	var gptReq generateRequest
	err := json.NewDecoder(r.Body).Decode(&gptReq)
	if err != nil {
		loggerx.Error(err)
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid request body", http.StatusUnprocessableEntity)))
		return
	}

	// gptClient object helps in connecting to the gpt-3 API
	gptClient := gogpt.NewClient(viper.GetString("OPENAI_API_KEY"))
	ctx := context.Background()
	
	request := gogpt.CompletionRequest{
		Model:     gptReq.Model,
		Prompt:    gptReq.Prompt,
		MaxTokens: gptReq.Tokens,
	}

	resp, err := gptClient.CreateCompletion(ctx, request)
	if err != nil {
		loggerx.Error(err)
		errorx.Render(w, errorx.Parser(errorx.GetMessage("unable to send request to gpt api", http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, resp)
}
