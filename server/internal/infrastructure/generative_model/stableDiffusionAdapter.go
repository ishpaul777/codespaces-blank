package generative_model

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"time"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/pkg/helper"
)

// errors for stable diffusion adapter
var (
	ErrincorrectAPIKey = errors.New("incorrect api key")
	ErrInternalError   = errors.New("error while making API call to stable diffusion")
)

type StableDiffusionAdapter struct {
	API_KEY string `json:"API_KEY"`
	API_URL string `json:"API_URL"`
	Client  *http.Client
}

func NewStableDiffusionAdapter() *StableDiffusionAdapter {
	return &StableDiffusionAdapter{}
}

type textPrompt struct {
	Text string `json:"text"`
}

// requestGenerateImage is the request body for the stable diffusion generate image API
type requestGenerateImage struct {
	TextPrompts []textPrompt `json:"text_prompts"`
	NumImages   int32        `json:"samples"`
}

// responseGenerateImage is the response body for the stable diffusion generate image API
type responseGenerateImage struct {
	Artifacts []eachImage `json:"artifacts"`
}

type eachImage struct {
	Base64Img string `json:"base64"`
}

var stableDiffusionDataFile = "./modelData/stableDiffusion.json"

func (s *StableDiffusionAdapter) LoadConfig() error {
	configFile, err := os.Open(stableDiffusionDataFile)
	if err != nil {
		return err
	}
	defer configFile.Close()

	jsonParser := json.NewDecoder(configFile)
	err = jsonParser.Decode(&s)
	if err != nil {
		return err
	}

	s.Client = &http.Client{
		Timeout: 30 * time.Second,
	}

	return nil
}

// validateModel checks if the model is valid or not
func validateModel(model string) bool {
	switch model {
	case "stable-diffusion-xl-beta-v2-2-2":
		return true
	case "stable-diffusion-v1-5":
		return true
	case "stable-diffusion-512-v2-1":
		return true
	case "stable-diffusion-768-v2-1":
		return true
	default:
		return false
	}
}

func (s *StableDiffusionAdapter) GenerateImage(model string, nOfImages int32, prompt string) ([]models.GeneratedImage, error) {
	if model == "" {
		model = "stable-diffusion-xl-beta-v2-2-2"
	}

	if !validateModel(model) {
		return nil, fmt.Errorf("invalid model: %s", model)
	}

	reqBody := &requestGenerateImage{}

	reqBody.TextPrompts = append(reqBody.TextPrompts, textPrompt{
		Text: prompt,
	})

	reqBody.NumImages = nOfImages

	byte, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	requestURL := s.API_URL + "/v1/generation/" + model + "/text-to-image"
	req, err := http.NewRequest("POST", requestURL, bytes.NewBuffer(byte))
	if err != nil {
		return nil, err
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+s.API_KEY)

	response, err := s.Client.Do(req)
	if err != nil {
		return nil, err
	}

	// if response.StatusCode != http.StatusOK {
	// 	if response.StatusCode == http.StatusUnauthorized {
	// 		return nil, ErrincorrectAPIKey
	// 	}
	// 	return nil, ErrInternalError
	// }

	// defer response.Body.Close()

	// var generatedImages []models.GeneratedImage

	// responseBody := &responseGenerateImage{}
	// err = json.NewDecoder(response.Body).Decode(responseBody)
	// if err != nil {
	// 	return nil, err
	// }

	// for _, eachImage := range responseBody.Artifacts {
	// 	generatedImages = append(generatedImages, models.GeneratedImage{
	// 		URL: eachImage.Base64Img,
	// 	})
	// }

	return getImageResponse(response)
}

func (s *StableDiffusionAdapter) GenerateVariation(model string, image *os.File, nOfImages int32) ([]models.GeneratedImage, error) {
	if model == "" {
		model = "stable-diffusion-xl-beta-v2-2-2"
	}

	if !validateModel(model) {
		return nil, fmt.Errorf("invalid model: %s", model)
	}

	data := &bytes.Buffer{}
	writer := multipart.NewWriter(data)
	// var imageField io.Writer
	imageWriter, err := writer.CreateFormField("init_image")
	if err != nil {
		return nil, ErrInternalError
	}

	initImage, err := os.Open(helper.TEMP_IMAGE_PATH)
	if err != nil {
		return nil, ErrInternalError
	}
	_, err = io.Copy(imageWriter, initImage)
	if err != nil {
		return nil, ErrInternalError
	}

	err = writer.WriteField("samples", fmt.Sprintf("%d", nOfImages))
	if err != nil {
		return nil, ErrInternalError
	}

	// prompt is prompt to generate variations of image
	prompt := "Imagine you have a photograph of a landscape. Your task is to generate variations of this photograph, making small changes that create new, interesting compositions while still keeping the original context of the image"
	err = writer.WriteField("text_prompts[0][text]", prompt)
	if err != nil {
		return nil, ErrInternalError
	}

	err = writer.Close()
	if err != nil {
		return nil, ErrInternalError
	}
	payload := bytes.NewReader(data.Bytes())
	requestURL := s.API_URL + "/v1/generation/" + model + "/image-to-image"

	req, err := http.NewRequest("POST", requestURL, payload)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Content-Type", writer.FormDataContentType())
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+s.API_KEY)

	response, err := s.Client.Do(req)
	if err != nil {
		return nil, err
	}

	return getImageResponse(response)
}

type stableDiffError struct {
	ID      string `json:"id"`
	Message string `json:"message"`
	Name    string `json:"name"`
}

func getImageResponse(response *http.Response) ([]models.GeneratedImage, error) {
	if response.StatusCode != http.StatusOK {
		data := &stableDiffError{}
		json.NewDecoder(response.Body).Decode(data)
		if response.StatusCode == http.StatusUnauthorized {
			return nil, ErrincorrectAPIKey
		}
		return nil, errors.New(data.Message)
	}

	defer response.Body.Close()

	var generatedImages []models.GeneratedImage

	responseBody := &responseGenerateImage{}
	err := json.NewDecoder(response.Body).Decode(responseBody)
	if err != nil {
		return nil, err
	}

	for _, eachImage := range responseBody.Artifacts {
		generatedImages = append(generatedImages, models.GeneratedImage{
			URL: eachImage.Base64Img,
		})
	}
	return generatedImages, nil
}
