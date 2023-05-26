package models

import "encoding/json"

type VISIBILITY string

var (

	// VISIBILITY_PUBLIC represents a public visibility
	VISIBILITY_PUBLIC VISIBILITY = "public"
	// VISIBILITY_PRIVATE represents a private visibility
	VISIBILITY_PRIVATE VISIBILITY = "private"
)

type Persona struct {
	Base
	Name        string     `gorm:"column:name;" json:"name"`
	Description string     `gorm:"column:description" json:"description"`
	Prompt      string     `gorm:"column:prompt" json:"prompt"`
	Avatar      string     `gorm:"column:avatar" json:"avatar"`
	Visibility  VISIBILITY `gorm:"column:visibility" json:"visibility"`
	Provider    string     `gorm:"column:provider" json:"provider"`
	Model       string     `gorm:"column:model;" json:"model"`
	IsDefault   bool       `gorm:"column:is_default" json:"is_default"`
}

func ValidateVisibility(v VISIBILITY) bool {
	return (v == VISIBILITY_PUBLIC) || (v == VISIBILITY_PRIVATE)
}

type PersonaChats struct {
	Base
	PersonaID uint `json:"persona_id" gorm:"column:persona_id" `
	// Title is the title of the chat
	Title string `json:"title" gorm:"column:title;DEFAULT 'new title';not null;"`
	// Messages stores the chat history in the json format
	Messages json.RawMessage `json:"messages" gorm:"type:jsonb"`
	// Usage stores the usage of the chatbot in the json format
	Usage json.RawMessage `json:"usage" gorm:"type:jsonb"`
}

/*
example prompt for factcheck writer
I want you to act as research associate who writes factcheck for a media and research company. I will give you Claim: [Enter the claim here] Claim Link: [Provide the link to the claim, if available] Sources Link: [Include the link(s) to the source(s) supporting the claim] Rating: [Rating of factcheck] Fact: [Describes the actual fact after factchecking it] Methodology: [Describe the methodology used to investigate the claim]. You will come with an factcheck article which are engaging and should ensure clarity, objectivity, and concise language in your response. Your response should start with an clear and concise title, introduction of the article which should have a claim link, continued by concise description of claim, claim link and source link, continued by engaging description of the actual fact with the rating of factcheck, continued by clear concise and engaging description of methodologies used and end with clear and concise conclusion derived from the actual fact and other sections. The article should be 550-600 words. Have Fact and Claim Subheadings(IMPORTANT). Do not have Claim Link, Source Link, Methodology subheadings(IMPORTANT). Return in Markdown Format(IMPORTANT).
*/

/*
another prompt to write a factcheck -
{
    "model": "gpt-4",
    "messages": [
        {
            "role": "system",
            "content": "You are a research associate who writes factcheck articles for a media and research company. The user input will give you Claim: [Enter the claim here] Claim Link: [Provide the link to the claim, if available] Sources Link: [Include the link(s) to the source(s) supporting the claim] Rating: [Rating of factcheck] Fact: [Describes the actual fact after factchecking it] Methodology: [Describe the methodology used to investigate the claim]. Write a fact-check article investigating the claim that [Claim]. Evaluate the claim based on the provided sources and methodology, and assign a rating of [Rating of fact-check] to the claim. Your article should include a comprehensive analysis of the available evidence and reference the following Claim Link: [Provide the link to the claim, if available] Sources Link: [Include the link(s) to the source(s) supporting the claim]. In your fact-check article, clearly state the actual fact after investigating the claim ([Fact]) and describe the methodology used to assess the claim ([Methodology]). Ensure that your analysis is objective, evidence-based, and provides readers with a clear understanding of the claim's accuracy. The response should be in markdown format."

        },
        {
            "role": "user",
            "content": "Claim: [Video showing the visuals from a slave market run by ISIS in Syria]. Claim Link: [https://www.facebook.com/reel/637707421722244/]. Fact: [The video shared in the post shows an art performance directed by a Kurdish artist named Aryan Rafiz. This street play by Aryan Rafiq portrays the fate of women who were kidnapped and sold as slaves by ISIS. The video does not show the real visuals of a slave auction conducted by ISIS]. Methodology: [1)Did reverse image search, found TikTok video with similar visuals. The uploader wrote that it an art performance - “The Unheard Screams Of The Ezidkhan Angel” by artist Aryan Rafiq. Source link: https://www.tiktok.com/@zhyarshanoo/video/7230349533098642693  2) Darya Safai, a Member of the Belgian Parliament, also shared it as ISIS sex slave market, but many websites replied to tweet and confirmed it is art performance.3)Aryan Rafiq talked to VRT News and also confirmed the same. Source link: https://www.vrt.be/vrtnws/nl/2023/05/19/check-seksslaven-safai/ 4) Aryan Rafiq also posted about the performance on her Facebook page. Source: https://www.facebook.com/photo?fbid=626906512782391&set=a.504244705048573] Rating:[false]. The output format should have the following structure - ## [Enter the straight-forward and concise title here using the claim and actual fact] \n\n ### Introduction: \n [Concisely introduce the article and mention the claim link.] \n\n ### Claim: \n [concise description of claim] \n\n ### Fact: \n [Provide an engaging description of the actual fact, supported by source links] [Whether the claim is true or false based on the rating of factcheck] \n\n ### Methodology: \n [Describe the methodologies used to investigate the claim in a clear, concise, and engaging manner.] \n\n ###Conclusion \n\n Based on the careful examination of the claim and the evidence presented, it is clear that [Provide a clear and concise conclusion derived from the actual fact and the analysis conducted throughout the article]. The factcheck article should have 600-700 minimum words(IMPORTANT) and it should be in UK english(IMPORTANT)."
        }
    ],
    "temperature": 0.9,
    "n": 1,
    "stream": false,
    "presence_penalty": 0,
    "frequency_penalty": 0
}

*/
