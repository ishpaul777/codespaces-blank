export async function getChatResponse(chatID, messages, model, provider) {
  let requestBody = {};
  if (chatID) {
    requestBody.id = chatID;
  }
  requestBody.messages = messages;
  requestBody.model = model;
  requestBody.provider = provider;

  return fetch(`${process.env.REACT_APP_TAGORE_API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User": 1,
    },
    body: JSON.stringify(requestBody),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      return response.json().then((data) => {
        throw Error(data.errors?.[0].message);
      });
    }
  });
}
