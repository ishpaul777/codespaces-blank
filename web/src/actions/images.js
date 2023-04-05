export const getGeneratedImages = (request, userID) => {
  return fetch(`${process.env.REACT_APP_TAGORE_API_URL}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User": userID,
    },
    body: JSON.stringify(request),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      return response.json().then((data) => {
        throw Error(data.errors?.[0].message);
      });
    }
  });
};
