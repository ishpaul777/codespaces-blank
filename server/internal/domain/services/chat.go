package services

type ChatService interface {
	GetResponse(message string) (string, error)
}

// chatService is a concrete implementation of ChatService interface
type chatService struct {
}

func (c *chatService) GetResponse(message string) (string, error) {
	// model := generative_model.New("openai")
	return "", nil
}
