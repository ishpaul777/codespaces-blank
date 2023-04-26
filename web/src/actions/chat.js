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

// getChatHistoryByUserID function is used to get chat history by user ID
// it sends http request to the server and validates and returns the response
// parameters: userID
export async function getChatHistoryByUserID(userID, pagination) {
  return fetch(
    `${process.env.REACT_APP_TAGORE_API_URL}/chat/history?` +
      new URLSearchParams({
        limit: pagination.limit,
        page: pagination.page,
        search_query: pagination.search_query,
      }),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User": userID,
      },
    }
  ).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      return response.json().then((data) => {
        throw Error(data.errors?.[0].message);
      });
    }
  });
}

// deleteChatByID function is used to delete a chat by its ID
// it sends http request to the server and validates and returns the response
// parameters: chatID, userID
export async function deleteChatByID(chatID, userID) {
  return fetch(`${process.env.REACT_APP_TAGORE_API_URL}/chat/${chatID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-User": userID,
    },
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
