export async function getDocuments() {
  const response = await fetch(
    `${window.REACT_APP_TAGORE_API_URL}/documents`,
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
