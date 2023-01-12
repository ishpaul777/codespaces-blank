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

// editRequest is the json-model for decoding gpt request for editing text
type editRequest struct {
	Model       string `json:"model"`
	Input       string `json:"input"`
	Instruction string `json:"instruction"`
}

func edit(w http.ResponseWriter, r *http.Request) {
	var gptReq editRequest
	err := json.NewDecoder(r.Body).Decode(&gptReq)
	if err != nil {
		loggerx.Error(err)
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid request body", http.StatusUnprocessableEntity)))
		return
	}

	// gptClient object helps in connecting to the gpt-3 API
	gptClient := gogpt.NewClient(viper.GetString("OPENAI_API_KEY"))
	ctx := context.Background()

	request := gogpt.EditsRequest{
		Model:       &gptReq.Model,
		Input:       gptReq.Input,
		Instruction: gptReq.Instruction,
	}

	resp, err := gptClient.Edits(ctx, request)
	if err != nil {
		loggerx.Error(err)
		errorx.Render(w, errorx.Parser(errorx.GetMessage("unable to send request to gpt api", http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, resp)
}
