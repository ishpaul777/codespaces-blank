package generative_model

type GenerativeModel interface {
	LoadConfig() error
	GenerateText(prompt string, maxTokens uint) (interface{}, error)
	EditText(input string, instruction string) (interface{}, error)
}

func New(model string) GenerativeModel {
	switch model {
	case "openai":
		return NewOpenAIAdapter()
	default:
		return NewOpenAIAdapter()
	}
}
