export let factcheckIntroPrompt = `Using the information below, write a focused and relevant title heading and introduction paragraph for a fact-check:
- Fact-check title: {factcheck_title}
- Claim: {claim}
- Claimant: {claimant}
- Claim sources: {claimsources}
- Fact: {fact}
- Rating: {rating}
Mention the claim source link in the introduction paragraph using the link html tags(!IMPORTANT). Don't mention the whole link itself (!IMPORTANT). 
Don't mention the rating in introduction paragraph(!IMPORTANT).
After the introduction paragraph add a <blockquote></blockquote>, inside that mention exactly 2 things 1-Claim: {claim provided above}, 2-Fact:{fact provided above and the rating is {rating provided above}}(!IMPORTANT).
Don't add a not or start the title with 'Factcheck:'
`;

export let factcheckMethodologyPrompt = `Using the information below, write a focused and relevant methodology paragraph for a fact-check in a way that it feels like you are continuing the article:
- list of methodologies: {list_of_methodologies_with_there_review_sources}
Mention the Review sources in the methodology paragraphs using the link html tags(!IMPORTANT) and don't use words like continuing the article.
`;

export let factcheckConclusionPrompt = `Using the information below, write a focused and relevant conclusion paragraph for a fact-check:
- Article written till now: {article_written_till_now}
- Points to be highlighted: {highlights}.
`;
