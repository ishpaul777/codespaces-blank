export const getOrganisationsFromKavach = () => {
  return fetch(`${window.REACT_APP_KAVACH_SERVER_URL}/organisations/my`, {
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
        throw response;
      }
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

export const updateOrganisation = (orgId, data) => {
  return fetch(`${window.REACT_APP_KAVACH_SERVER_URL}/organisations/${orgId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

export const sendInvites = (orgId, data, return_to) => {
  return fetch(
    `${window.REACT_APP_KAVACH_SERVER_URL}/organisations/${orgId}/users?` +
      new URLSearchParams({
        return_to: return_to,
      }),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        users: data,
      }),
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

export const createOrganisation = (data) => {
  return fetch(`${window.REACT_APP_KAVACH_SERVER_URL}/organisations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 201 || response.status === 200) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};
