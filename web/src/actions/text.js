export async function getDocuments(orgID, limit, page, search_query) {
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
        "X-Org": orgID,
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

export const generateTextFromPrompt = async (orgID, requestBody) => {
  const response = await fetch(
    `${window.REACT_APP_TAGORE_API_URL}/prompts/generate`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Org": orgID,
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

export const createDocument = async (orgID ,requestBody) => {
  const response = await fetch(`${window.REACT_APP_TAGORE_API_URL}/documents`, {
    headers: {
      "Content-Type": "application/json",
      "X-Org": orgID,
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

export const getDocumentByID = async (orgID, documentID) => {
  const response = await fetch(
    `${window.REACT_APP_TAGORE_API_URL}/documents/${documentID}`,
    {
      headers: {
        "X-Org": orgID,
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

export const updateDocument = async (orgID ,documentID, requestBody) => {
  const response = await fetch(
    `${window.REACT_APP_TAGORE_API_URL}/documents/${documentID}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Org": orgID,
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
