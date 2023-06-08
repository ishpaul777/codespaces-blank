export async function getDocuments(limit, page, search_query) {
  const response = await fetch(
    `${window.REACT_APP_TAGORE_API_URL}/documents?` +
      new URLSearchParams({
        limit,
        page,
        search_query,
      }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    }
  );

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    const errorMessage = await response.json();
    throw new Error(errorMessage.errors?.[0].message);
  }
}

export const generateTextFromPrompt = async (requestBody) => {
  const response = await fetch(
    `${window.REACT_APP_TAGORE_API_URL}/prompts/generate`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(requestBody),
      credentials: "include",
    }
  );

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    const errorMessage = await response.json();
    throw new Error(errorMessage.errors?.[0].message);
  }
};

export const createDocument = async (requestBody) => {
  const response = await fetch(`${window.REACT_APP_TAGORE_API_URL}/documents`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(requestBody),
    credentials: "include",
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    const errorMessage = await response.json();
    throw new Error(errorMessage.errors?.[0].message);
  }
};

export const getDocumentByID = async (documentID) => {
  const response = await fetch(
    `${window.REACT_APP_TAGORE_API_URL}/documents/${documentID}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    }
  );

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    const errorMessage = await response.json();
    throw new Error(errorMessage.errors?.[0].message);
  }
};

export const updateDocument = async (documentID, requestBody) => {
  const response = await fetch(
    `${window.REACT_APP_TAGORE_API_URL}/documents/${documentID}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(requestBody),
      credentials: "include",
    }
  );

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    const errorMessage = await response.json();
    throw new Error(errorMessage.errors?.[0].message);
  }
};

export const deleteDocument = async (documentID) => {
  const response = await fetch(
    `${window.REACT_APP_TAGORE_API_URL}/documents/${documentID}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      credentials: "include",
    }
  );

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    const errorMessage = await response.json();
    throw new Error(errorMessage.errors?.[0].message);
  }
};
