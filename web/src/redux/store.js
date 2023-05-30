// store.js

import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import promptsReducer from "./reducers/prompts";
import thunk from "redux-thunk";
import collectionsReducer from "./reducers/collections";

// Middleware to save state to local storage after every action
const saveStateToLocalStorage = (store) => (next) => (action) => {
  const result = next(action);
  localStorage.setItem("prompts", JSON.stringify(store.getState()));
  return result;
};

const rootReducer = combineReducers({
  prompts: promptsReducer,
  collections: collectionsReducer,
});

// Create store with promptsReducer and middleware using configureStore
const store = configureStore({
  reducer: rootReducer,
  preloadedState: JSON.parse(localStorage.getItem("prompts")) || [],
  middleware: [saveStateToLocalStorage, thunk],
});

export default store;
