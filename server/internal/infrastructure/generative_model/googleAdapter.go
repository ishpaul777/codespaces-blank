package generative_model

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	httpGoogle "google.golang.org/api/transport/http"
)

type GoogleAdapter struct {
	API_KEY    string `json:"API_KEY"`
	API_URL    string `json:"API_URL"`
	PROJECT_ID string `json:"PROJECT_ID"`
	Client     *http.Client
}

type message struct {
	Content string `json:"content"`
	Author  string `json:"author"`
}

type reqBodyForGoogleChat struct {
	Instances []struct {
		Context  string    `json:"context"`
		Examples []message `json:"examples"`
		Messages []message `json:"messages"`
	} `json:"instances"`

	Parameters struct {
		Temperature     float32 `json:"temperature"`
		MaxOutputTokens int32   `json:"maxOutputTokens,omitempty"`
	} `json:"parameters"`
}

type googleChatResponse struct {
	Predictions []struct {
		Candidates []struct {
			Content string `json:"content"`
			Author  string `json:"author"`
		} `json:"candidates"`
	} `json:"predictions"`
}

var (
	errIncorrectGoogleModel = errors.New("incorrect google model")
)

func NewGoogleAdapter() *GoogleAdapter {
	return &GoogleAdapter{}
}

// validateModel checks if the model is valid or not
func validateGoogleModel(model string) bool {
	switch model {
	case "chat-bison@001":
		return true
	default:
		return false
	}
}

var googleDataFile = "./modelData/google.json"

func (g *GoogleAdapter) LoadConfig() error {
	configFile, err := os.Open(googleDataFile)
	if err != nil {
		return err
	}

	defer configFile.Close()

	jsonParser := json.NewDecoder(configFile)
	err = jsonParser.Decode(&g)
	if err != nil {
		return err
	}

	g.Client = &http.Client{
		Timeout: 30 * time.Second,
	}

	return nil
}

// implement the ChatGenerativeModel interface for GoogleAdapter
func (g *GoogleAdapter) GenerateChatTitle(message models.Message) (string, error) {
	return "", nil
}

func (g *GoogleAdapter) GenerateResponse(input *GenerateChatResponse) ([]models.Message, error) {
	ctx := context.Background()
	newClient, _, err := httpGoogle.NewClient(ctx)
	if err != nil {
		return nil, err
	}
	g.Client = newClient
	// if model == "" {
	// 	model = "chat-bison@001"
	// }

	// if !validateGoogleModel(model) {
	// 	return nil, errIncorrectGoogleModel
	// }

	// reqBody := &reqBodyForGoogleChat{}

	// messagesForGoogle := make([]message, 0)
	// for _, msg := range messages[1:] {
	// 	if msg.Role == "assistant" {
	// 		msg.Role = "bot"
	// 	}
	// 	messagesForGoogle = append(messagesForGoogle, message{
	// 		Content: msg.Content,
	// 		Author:  msg.Role,
	// 	})
	// }

	// reqBody.Instances = append(reqBody.Instances, struct {
	// 	Context  string    `json:"context"`
	// 	Examples []message `json:"examples"`
	// 	Messages []message `json:"messages"`
	// }{
	// 	Context:  messages[0].Content,
	// 	Examples: []message{},
	// 	Messages: messagesForGoogle,
	// })

	// reqBody.Parameters.Temperature = temperature

	// byteRequest, err := json.Marshal(reqBody)
	// if err != nil {
	// 	return nil, err
	// }

	// requestURL := g.API_URL + "/v1/projects/" + g.PROJECT_ID + "/locations/us-central1/publishers/google/models/" + model + ":predict"
	// req, err := http.NewRequest("POST", requestURL, bytes.NewBuffer(byteRequest))
	// if err != nil {
	// 	return nil, err
	// }

	// req.Header.Add("Content-Type", "application/json")
	// req.Header.Add("Accept", "application/json")
	// req.Header.Add("Authorization", "Bearer "+g.API_KEY)

	// response, err := g.Client.Do(req)
	// if err != nil {
	// 	return nil, err
	// }

	// defer response.Body.Close()
	// if response.StatusCode != http.StatusOK {
	// 	responseBody := map[string]interface{}{}
	// 	err = json.NewDecoder(response.Body).Decode(&responseBody)
	// 	if err != nil {
	// 		return nil, err
	// 	}

	// 	return nil, errors.New("google model returned status code " + response.Status)
	// }

	// var googleResponse googleChatResponse
	// err = json.NewDecoder(response.Body).Decode(&googleResponse)
	// if err != nil {
	// 	return nil, err
	// }

	// if len(googleResponse.Predictions) > 0 {
	// 	if len(googleResponse.Predictions[0].Candidates) > 0 {
	// 		messages = append(messages, models.Message{
	// 			Content: googleResponse.Predictions[0].Candidates[0].Content,
	// 			Role:    "assistant",
	// 		})
	// 	}
	// }
	return input.Messages, nil
}

func (g *GoogleAdapter) GenerateStreamingResponse(data *GenerateChatResponseStream) {

}

func (g *GoogleAdapter) GenerateStreamingResponseForPersona(input *models.PersonaChatStream, personaRepo repositories.PersonaRepository) {

}
