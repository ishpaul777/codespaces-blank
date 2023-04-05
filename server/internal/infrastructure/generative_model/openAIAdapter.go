package generative_model

import (
	"context"
	"encoding/json"
	"os"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/sashabaranov/go-openai"
)

type OpenAIAdapter struct {
	API_KEY string `json:"API_KEY"`
	Client  *openai.Client
}

func NewOpenAIAdapter() *OpenAIAdapter {
	return &OpenAIAdapter{}
}

var modelDataFile = "./modelData/openAI.json"

func (o *OpenAIAdapter) LoadConfig() error {
	configFile, err := os.Open(modelDataFile)
	if err != nil {
		return err
	}
	defer configFile.Close()

	jsonParser := json.NewDecoder(configFile)
	err = jsonParser.Decode(&o)
	if err != nil {
		return err
	}

	o.Client = openai.NewClient(o.API_KEY)
	return nil
}

func (o *OpenAIAdapter) GenerateText(prompt string, maxTokens uint) (interface{}, string, error) {
	req := openai.CompletionRequest{
		Prompt:    prompt,
		MaxTokens: int(maxTokens),
		Model:     openai.GPT3TextDavinci003,
	}
	ctx := context.Background()
	resp, err := o.Client.CreateCompletion(ctx, req)
	if err != nil {
		return nil, "", err
	}

	return resp.Choices[0].Text, resp.Choices[0].FinishReason, nil
}

func (o *OpenAIAdapter) EditText(input string, instruction string) (interface{}, error) {
	return nil, nil
}

func (o *OpenAIAdapter) GenerateImage(nOfImages int32, prompt string) ([]models.GeneratedImage, error) {
	req := openai.ImageRequest{
		N:      int(nOfImages),
		Prompt: prompt,
		Size:   "512x512",
	}

	ctx := context.Background()
	resp, err := o.Client.CreateImage(ctx, req)
	if err != nil {
		return nil, err
	}

	generatedImages := make([]models.GeneratedImage, 0)
	for _, image := range resp.Data {
		generatedImages = append(generatedImages, models.GeneratedImage{
			URL: image.URL,
		})
	}

	return generatedImages, nil
}
