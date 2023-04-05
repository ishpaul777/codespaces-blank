package images

import (
	"encoding/json"
	"net/http"

	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

type generateRequest struct {
	//Prompt is the prompt that we sent to the generative model for generating images
	Prompt string `json:"prompt"`
	//Model is the name of the generative model that we are using
	Model string `json:"model"`
	//NofImages is the number of images that we want to generate
	NofImages int32 `json:"n"`
}

func (h *httpHandler) generateImages(w http.ResponseWriter, r *http.Request) {
	requestBody := &generateRequest{}

	err := json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		h.logger.Error("error decoding request body", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	if requestBody.Model == "" {
		requestBody.Model = "openai"
	}

	images, err := h.imageService.GenerateImage(requestBody.Model, requestBody.NofImages, requestBody.Prompt)
	if err != nil {
		h.logger.Error("error generating images", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.InternalServerError()))
		return
	}

	renderx.JSON(w, http.StatusOK, images)
}
