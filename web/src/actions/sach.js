export const getRelatedFactcheck = async (title, existing_article) => {
  const response = await fetch(
    `${window.REACT_APP_SACH_API_URL}/api/v1/tagore/related_fact_checks`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        title: title,
        existing_article: existing_article,
      }),
    }
  );

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    const errorMessage = await response.json();
    throw new Error("unable to get related fact check");
  }
};
