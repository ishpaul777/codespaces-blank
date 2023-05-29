export async function getDocuments(userID) {
  const response = await fetch(
    `${process.env.REACT_APP_TAGORE_API_URL}/documents`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-User": userID,
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

export const generateTextFromPrompt = async (requestBody, userID) => {
  const response = await fetch(
    `${process.env.REACT_APP_TAGORE_API_URL}/prompts/generate`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-User": userID,
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
