package images

import (
	"io"
	"net/http"
	"os"

	"github.com/factly/tagore/server/pkg/helper"
	"github.com/factly/x/errorx"
	"github.com/factly/x/renderx"
)

func (h *httpHandler) generateVarationsofImage(w http.ResponseWriter, r *http.Request) {
	// Parse our multipart form, 16MB a maximum limit
	err := r.ParseMultipartForm(16 << 20)
	if err != nil {
		h.logger.Error("error parsing multipart form", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	// Get the file from the form
	file, _, err := r.FormFile("image")
	if err != nil {
		h.logger.Error("error getting file from form", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}
	n := r.FormValue("n")
	if n == "" {
		n = "8"
	}

	nOfImages, err := helper.StringToInt(n)
	if err != nil {
		h.logger.Error("error parsing n", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid value for n. it should be integer", http.StatusBadRequest)))
		return
	}

	if nOfImages < 1 || nOfImages > 10 {
		h.logger.Error("error parsing n", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage("invalid value for n. it should be between 1 and 10", http.StatusBadRequest)))
		return
	}

	model := r.FormValue("model")

	provider := r.FormValue("provider")
	if provider == "" {
		provider = "stableDiffusion"
	}

	defer file.Close()

	// Create a temporary file
	tempFile, err := os.Create(helper.TEMP_IMAGE_PATH)
	// tempFile, err := os.OpenFile("sample-*.jpg", os.O_RDONLY|os.O_CREATE, 0666)
	if err != nil {
		h.logger.Error("error creating temporary file", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}
	// tempFile.Close()
	defer func() {
		if err != nil {
			os.Remove(tempFile.Name())
			return
		}
	}()

	// copy the contents of the uploaded file to the local file
	_, err = io.Copy(tempFile, file)
	if err != nil {
		h.logger.Error("error copying file", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	if tempFile == nil {
		h.logger.Error("error creating temporary file", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.DecodeError()))
		return
	}

	// using image service to generate variations of the image
	images, err := h.imageService.GenerateVariationsOfImage(provider, model, tempFile, int32(nOfImages))
	if err != nil {
		h.logger.Error("error generating images", "error", err.Error())
		errorx.Render(w, errorx.Parser(errorx.GetMessage(err.Error(), http.StatusInternalServerError)))
		return
	}

	renderx.JSON(w, http.StatusOK, images)
}
