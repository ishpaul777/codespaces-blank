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

// generateVariationsOfImage is a function that sends a request to the backend to generate variations of an image
// and returns the generated images
// params:
//  - file: the image file to be used for generating variations
//  - n: the number of variations to be generated
//  - model: the model to be used for generating variations
//  - provider: the provider to be used for generating variations
export const generateVariationsOfImage = (file, n, model, provider) => {
  var formData = new FormData();
  formData.append("image", file);
  formData.append("n", n);
  formData.append("model", model);
  formData.append("provider", provider);
  return fetch(`${process.env.REACT_APP_TAGORE_API_URL}/images/variation`, {
    method: "POST",
    body: formData,
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
