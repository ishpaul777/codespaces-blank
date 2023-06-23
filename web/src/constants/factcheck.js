export let factcheckIntroPrompt = `Using the information below, write a focused and relevant title heading and introduction paragraph for a fact-check:

- Fact-check title: {factcheck_title}
- Claim: {claim}
- Claimant: {claimant}
- Claim sources: {claimsources}
- Fact: {fact}
- Rating: {rating}

Fact-check title and introduction:`;

export let factCheckTitlePrompt = `Using the information below, write a focused and relevant introduction paragraph for a fact-check:

- Fact-check title: {factcheck_title}
- Claim: {claim}
- Claimant: {claimant}
- Claim sources: {claimsources}
- Fact: {fact}
- Rating: {rating}

Fact-check title:`;

export let factcheckMethodologyPrompt = `Using the information below, write a focused and relevant methodology paragraph for a fact-check in a way that it feels like you are continuing the article:
- Article written till now: {article_written_till_now}
- Methodology: {methodology}
- Review Sources: {review_sources}.

Describe the Review sources and don't use words like continuing the article or anything similar, make it organic.
`;

export let factcheckConclusionPrompt = `Using the information below, write a focused and relevant conclusion paragraph for a fact-check:
- Article written till now: {article_written_till_now}
- Points to be highlighted: {highlights}
`;