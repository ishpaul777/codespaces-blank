package services

import (
	"fmt"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
)

type PromptService interface {
	GenerateText(provider, model string, userID uint, input, generateFor, additionalInstructions string, maxTokens uint) (*models.GenerateTextResponse, error)
	GenerateTextStream(provider, model string, userID uint, input, generateFor, additionalInstructions string, maxTokens uint, dataChan chan<- string, errChan chan<- error)
}
type promptService struct {
	promptRepository repositories.PromptRepository
}

func NewPromptService(repository repositories.PromptRepository) PromptService {
	return &promptService{
		promptRepository: repository,
	}
}

func GetPromptPrefix(generateFor string) string {
	promptObject := map[string]string{
		"summary": "```Please summarize the following article. The article provides important insights and analysis that I need to condense into a concise summary. [Article: %s]```",

		"continue-writing": "```Generate engaging and informative content that seamlessly connects the provided user inputs. Please ensure that the generated text is well-written, coherent, and relevant. The user input is [%s]```",

		"translate-spanish": "```Translate from English to Spanish. User will provide the word or phrase you want to translate and you will provide the corresponding translation. Try to understand the user input preferences. Let's work together to ensure that the translation is accurate and reflects the original meaning in English. The input text is [%s]```",

		"translate-chinese":           "```Translate from English to Chinese. User will provide the word or phrase you want to translate and you will provide the corresponding translation. Try to understand the user input preferences. Let's work together to ensure that the translation is accurate and reflects the original meaning in English. The input text is [%s]```",
		"to-do-list":                  "```Create a to-do list for user based on there input. User will provide the task or text he/she would like to create the to-do list for. Once you have this information, you will generate a list of action items/tasks that you could consider adding to there to-do list. When you have your list, please review each item and prioritize or assign due dates as necessary to help you stay on track. The user input is [%s].```",
		"find-action-item":            "",
		"explain-this":                "```Break down and explain the text provided by user. Help user understand it by breaking it down into smaller components, defining any complex terminology, and providing additional context or examples if needed. The text that you have to explain is [%s]```",
		"improve-writing":             "```User will provide the text you will help user fix any grammatical mistakes, typos, and improve the overall clarity and flow of the writing. The input text is [%s]```",
		"fix-spelling-and-grammar":    "```Improve spelling and grammar of the text input by the user. User will provide the text and you will fix any spelling or grammar errors and return the text. The input text is [%s]```",
		"blog-post":                   "```Draft a blog post. User will provide the topic they would like to write about and any main points they would like to cover in the blog. Once you have this information,  brainstorm additional supporting points and create an outline that will help you structure your post effectively. From there, work on developing the central thesis of your post and begin drafting an engaging introduction, informative body, and compelling conclusion together. The user input is [%s]```",
		"make-shorter":                "```Shorten text without losing its meaning! User will provide the text they want you to shorten, and you will help them find alternative ways to express the same ideas using fewer words. Identify any repetition, redundancies, or wordy phrases that could be removed without changing the overall meaning. Ensure that the shortened version still effectively conveys intended message. The user input is [%s].```",
		"make-longer":                 "```Expand the text. User will provide the text they want you to expand on, and you will help them find alternative ways to express the same ideas using more words. Identify any gaps in the information you provided and suggest additional details, examples, or elaborations that could help clarify your message. Ensure that the expanded version still effectively conveys your intended message. The user input is [%s].```",
		"change-tone-professional":    "```Adjust the tone of the user input to make it more professional! User will provide the text they want you to work on, and you will help them modify the tone to be more formal and appropriate for your intended audience. Identify any instances of overly informal language, such as contractions or abbreviations that could be replaced with more professional alternatives. Work on improving the overall clarity and readability of the text by structuring the ideas in a logical and easy-to-follow manner. The user input is [%s]``` ",
		"change-tone-casual":          "```Adjust the tone of the user input to make it more casual and conversational! User will provide the text they want you to work on, and you will help them modify the tone to be more friendly and appropriate for a casual audience. Identify any instances of overly formal language that could be replaced with more casual alternatives. Work on improving the overall flow and readability of the text by making it more conversational and easy to follow. The user input is [%s]```",
		"change-tone-straightforward": "```Adjust the tone of the user input to make it more straight forward and clear! User will provide the text they want you to work on, and you will help them modify the tone to be more concise and appropriate for your intended audience. Identify any instances of overly complex language or vague phrasing that could be simplified for clarity. Work on improving the overall structure of the text by arranging the ideas in a logical order that is easy to follow. The user input is [%s]```",
		"change-tone-confident":       "```Adjust the tone of the user input to make it more confident! User will provide the text they want you to work on, and you will help them modify the tone to exude more confidence in. Identify any instances of overly tentative or indecisive language that could be replaced with more assertive and confident phrasing. Work on improving the overall structure of the text by arranging the ideas in a logical order and that makes user come as an expert or authority. The user input is [%s]```",
		"change-tone-friendly":        "```Adjust the tone of the user input to make it more friendly and approachable! User will provide the text they want you to work on, and you will help them modify the tone to be more friendly towards the audience it's intended on. Identify any instances of overly formal or corporate language that could be replaced with warmer, more approachable alternatives. Work on improving the overall tone of the text by injecting humor, personal anecdotes, or relatable examples to make user input message more relatable. The user input is [%s]```",
		"simplify-language":           "```Simplify the language of user input for greater clarity! User will provide the text they want you to work on and audience you would like to communicate with. Review each sentence, identifying any instances of complex or technical language that could be simplified for greater clarity and understanding. Also work on improving the overall organization of the text by grouping ideas and information in a logical and coherent manner. By using straightforward language and logical structure, aim to communicate your message more clearly to your intended audience. The user input is [%s]```",
		"brainstorm-ideas":            "```Brainstorm possible solutions for [%s]. Consider various approaches, advantages and disadvantages of each approach, potential challenges, and any other relevant factors that may impact the feasibility and effectiveness of your proposed solutions. Let's aim to generate as many ideas as possible before narrowing down to the most viable and promising options.```",
		"outline":                     "```Create an outline! User will provide the topic or theme they want you to write about, and you will have to  generate a list of main ideas and subtopics that you could consider including user input. Once we have a comprehensive list, work to organize the topics into a logical and structured outline that will serve as a roadmap for user input. Review each section of the outline to ensure that it flows logically and supports user input's central thesis effectively. Response should  have a clear and detailed outline to help you write a cohesive and compelling piece of content. The user input is [%s]```",
		"social-media-post":           "```Draft a social media post! User will provide the topic or message they want you to convey in there post, and work to craft a concise, engaging message that will resonate with the intended audience. Aim to make the post appealing and eye-catching using relevant relatable texts and anecdotes, and keep the message short and to the point, so it's easy for followers to engage with. Also work on incorporating any relevant hashtags or keywords to help the post reach a wider audience. Response should have a polished and effective social media post that is ready to be published on the desired platform. The user input is [%s]``` ",
		"press-release":               "```Draft a press release! User will provide the topic or event you want to write a press release for, and we'll work together to craft a detailed and engaging story that will capture the attention of journalists and other stakeholders. Start with a strong headline and opening paragraph that grabs the reader's attention and clearly communicates the core message of the release. Also include relevant quotes, statistics, and other supporting information to help bolster the credibility of the story. Work on incorporating clear call-to-actions so that readers know what the next steps are. Response have a polished and professional press release that is ready to be shared with your target audience. The user input is [%s]``` ",
		"creative-story":              "```Brainstorm a creative story! User will provide a general theme or idea that they would like to explore in there story, and you'll work to develop interesting characters, plot twists, and settings that will bring the story to life. Begin with a brainstorm session, generating as many ideas as possible before narrowing down to the most promising concepts. Also work on defining the key aspects of the story such as the plot, setting, and characters. Once you have a solid foundation, work on developing an engaging narrative that will capture the reader's attention and lead them on a journey. Response should have a unique and engaging story that you can be proud to share with your audience. The user input is [%s]```",
		"meeting-agenda":              "",
		"pros-and-cons":               "",
		"sales-email":                 "",
		"recruiting-email":            "",
		"essay":                       "Write an essay about ",
		"job-description":             "Write a job description for ",
		"poem":                        "```Create a poem! User will provide the theme or topic they would like to write a poem about, and work to craft a piece that captures the emotion and essence of the chosen theme. Aim to use evocative language and vivid imagery to convey the message of the poem and bring the reader on a journey through the words. Also consider various poetic elements such as rhyme scheme, meter, and poetic devices like personification or alliteration to enhance the richness and depth of the poem. Response have a beautiful and expressive poem that is ready to be shared with the world. The user input is [%s]``` ",
	}
	if value, ok := promptObject[generateFor]; ok {
		return value
	}

	return "generate engaging and informative text content on the input provided by the user. The user input is [%s]"
}

func constructPrompt(input, generateFor, additionalInstructions string) string {
	prompt := fmt.Sprintf(GetPromptPrefix(generateFor), input)
	if prompt != "" {
		prompt += ". " + additionalInstructions
	}
	return prompt
}

func constructPromptForChat(input, generateFor string) string {
	prompt := fmt.Sprintf(GetPromptPrefix(generateFor), input)
	return prompt
}

func (p *promptService) GenerateText(provider, model string, userID uint, input, generateFor, additionalInstructions string, maxTokens uint) (*models.GenerateTextResponse, error) {
	if provider == "" {
		provider = "openai"
	}

	generativeModel := generative_model.NewTextGenerativeModel(provider)

	err := generativeModel.LoadConfig()
	if err != nil {
		return nil, err
	}
	var output interface{}
	var finishReason string
	isUsingChatModel := models.ModelBelongsToChat(model)
	var prompt string
	if isUsingChatModel {
		prompt = constructPromptForChat(input, generateFor)
		output, finishReason, err = generativeModel.GenerateTextUsingChatModel(prompt, model, additionalInstructions, maxTokens)
		if err != nil {
			return nil, err
		}
	} else {
		prompt = constructPrompt(input, generateFor, additionalInstructions)
		output, finishReason, err = generativeModel.GenerateTextUsingTextModel(prompt, model, maxTokens)
		if err != nil {
			return nil, err
		}
	}

	return &models.GenerateTextResponse{
		Output:       output.(string),
		FinishReason: finishReason,
	}, nil

	// return p.promptRepository.CreatePrompt(userID, input, output.(string), finishReason)
}

func (p *promptService) GenerateTextStream(provider, model string, userID uint, input, generateFor, additionalInstructions string, maxTokens uint, dataChan chan<- string, errChan chan<- error) {
	if provider == "" {
		provider = "openai"
	}
	generativeModel := generative_model.NewTextGenerativeModel(provider)

	err := generativeModel.LoadConfig()
	if err != nil {
		errChan <- err
		return
	}

	isUsingChatModel := models.ModelBelongsToChat(model)
	prompt := constructPromptForChat(input, generateFor)
	if isUsingChatModel {
		generativeModel.GenerateTextUsingChatModelStream(model, prompt, maxTokens, additionalInstructions, dataChan, errChan)
	} else {
		generativeModel.GenerateTextUsingTextModelStream(model, prompt, maxTokens, dataChan, errChan)
	}
}
