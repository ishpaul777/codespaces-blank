package generative_model

import (
	"context"
	"encoding/json"
	"os"

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

func (o *OpenAIAdapter) GenerateText(prompt string, maxTokens uint) (interface{}, error) {
	req := openai.CompletionRequest{
		Prompt:    prompt,
		MaxTokens: int(maxTokens),
		Model:     openai.GPT3TextDavinci001,
	}
	ctx := context.Background()
	resp, err := o.Client.CreateCompletion(ctx, req)
	if err != nil {
		return nil, err
	}

	return resp.Choices[0].Text, nil

}

func (o *OpenAIAdapter) EditText(input string, instruction string) (interface{}, error) {
	return nil, nil
}
