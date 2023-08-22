import { PERSONA_API } from "../constants/persona";

export async function getPersona({ page, limit, search_query }) {
  return fetch(PERSONA_API, {
    params: {
      page: page,
      limit: limit,
      search_query: search_query,
    },
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return response.json().then((data) => {
          throw Error(data.errors?.[0].message);
        });
      }
    })
    .then((data) => {
      return data;
    });
}

export async function getPersonaChatsByUserID(personaID, pagination) {
  return fetch(
    `${PERSONA_API}/${personaID}/chats?` +
      new URLSearchParams({
        limit: pagination.limit,
        page: pagination.page,
        search_query: pagination.search_query,
      }),
    {
      credentials: "include",
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return response.json().then((data) => {
          throw Error(data.errors?.[0].message);
        });
      }
    })
    .then((data) => {
      return data;
    });
}

// deletePersonaChatByID function is used to delete a chat by its ID
// it sends http request to the server and validates and returns the response
// parameters: personaID, chatID
export async function deletePersonaChatByID(personaID, chatID) {
  return fetch(`${PERSONA_API}/${personaID}/chats/${chatID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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

// createPersona function is used to create a persona
// it sends http request to the server and validates and returns the response
// parameters: name, description, avatar, prompt, visibility
export async function createPersona(requestBody, orgID) {
  return fetch(PERSONA_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Org": orgID,
    },
    body: JSON.stringify(requestBody),
    credentials: "include",
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    } else {
      return response.json().then((data) => {
        throw Error(data.errors?.[0].message);
      });
    }
  });
}

// updatePersona function is used to update a persona
// it sends http request to the server and validates and returns the response
// parameters: personaID, name, description, avatar, prompt, visibility
export async function updatePersona(personaID, requestBody) {
  return fetch(`${PERSONA_API}/${personaID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    credentials: "include",
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

// getPersonaByID fetches the persona from the server using its ID
// parameters: personaID
export async function getPersonaByID(personaID) {
  return fetch(`${PERSONA_API}/${personaID}`, {
    credentials: "include",
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

// getDefaultPersona fetches the default persona from the server
// endpoint: /personas/default
export async function getDefaultPersona() {
  return fetch(`${PERSONA_API}/default`, {
    credentials: "include",
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

export async function deletePersonaById(id) {
  return fetch(`${PERSONA_API}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((response) => {
    if (response.status == 200) {
      return response.json();
    } else {
      return response.json().then((data) => {
        throw Error(data.errors?.[0].message);
      });
    }
  });
}
