export function getDataFromURL(url) {
  return fetch(
    `${window.REACT_APP_TAGORE_API_URL}/scrape?` +
      new URLSearchParams({
        url: url,
      }),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
