import { errorToast } from "../../util/toasts";

const createCollection = (collection) => async (dispatch) => {
  return fetch(`${window.REACT_APP_TAGORE_API_URL}/chat_collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(collection),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else {
        return response.json().then((data) => {
          throw Error(data.errors?.[0].message);
        });
      }
    })
    .then((data) => {
      dispatch({
        type: "CREATE_COLLECTION",
        payload: data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// delete collection
const deleteCollection = (collectionId) => async (dispatch) => {
  return fetch(
    `${window.REACT_APP_TAGORE_API_URL}/chat_collections/${collectionId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
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
      dispatch({
        type: "DELETE_COLLECTION",
        payload: collectionId,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// GER ALL CHAT COLLECTIONS
const getAllChatCollections = () => async (dispatch) => {
  return fetch(`${window.REACT_APP_TAGORE_API_URL}/chat_collections`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
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
      dispatch({
        type: "GET_ALL_COLLECTIONS",
        payload: data.collections,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const addChatToCollection =
  (collectionId, chatId, chatHistory) => async (dispatch) => {
    return fetch(`${window.REACT_APP_TAGORE_API_URL}/chat/collections`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        chat_collection_id: collectionId,
        chat_id: chatId,
      }),
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
        const chat = chatHistory.find((chat) => chat.id === chatId);
        dispatch({
          type: "ADD_CHAT_TO_COLLECTION",
          payload: { collectionId, chat },
        });
      })
      .catch((error) => {
        errorToast(error?.message);
      });
  };

const removeChatFromCollections =
  (chatId, collectionId) => async (dispatch) => {
    return fetch(
      `${window.REACT_APP_TAGORE_API_URL}/chat/collections/remove/${chatId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    )
      .then(async (response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw Error(data.errors);
          });
        }
      })
      .then((data) => {
        dispatch({
          type: "REMOVE_CHAT_FROM_CHAT_COLLECTION",
          payload: { collectionId, chatId },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

export {
  createCollection,
  deleteCollection,
  getAllChatCollections,
  addChatToCollection,
  removeChatFromCollections,
};
