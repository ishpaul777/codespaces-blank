export const updateProfile = (data) => {
  return fetch(`${window.REACT_APP_KAVACH_SERVER_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Credentials: "include",
    },
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

export const getProfile = () => {
  return fetch(`${window.REACT_APP_KAVACH_SERVER_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Credentials: "include",
    },
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

export const getInvitations = () => {
  return fetch(`${window.REACT_APP_KAVACH_SERVER_URL}/profile/invite`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Credentials: "include",
    },
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

export const acceptInvitation = (inviteId, data) => {
  return fetch(
    `${window.REACT_APP_KAVACH_SERVER_URL}/profile/invite/${inviteId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Credentials: "include",
      },
      body: JSON.stringify(data),
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

export const rejectInvitation = (inviteId) => {
  return fetch(
    `${window.REACT_APP_KAVACH_SERVER_URL}/profile/invite/${inviteId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Credentials: "include",
      },
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
