import { PROMPT_TEMPLATES } from "../constants/prompt_templates";

export const getAllPromptTemplates = (pagination) => {
  return fetch(PROMPT_TEMPLATES + "?" + new URLSearchParams(pagination), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
};

export const createPromptTemplate = (requestBody) => {
  return fetch(PROMPT_TEMPLATES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
};

export const updatePromptTemplate = (requestBody) => {
  return fetch(`${PROMPT_TEMPLATES}/${requestBody.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
};

export const deletePromptTemplate = (promptID) => {
  return fetch(`${PROMPT_TEMPLATES}/${promptID}`, {
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
};

export const getPromptTemplateByID = (promptID) => {
  return fetch(`${PROMPT_TEMPLATES}/${promptID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
};
