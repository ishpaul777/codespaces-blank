import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import promptsReducer from "./reducers/prompts";
import thunk from "redux-thunk";
import collectionsReducer from "./reducers/chatcollections";
import darkModeReducer from "./reducers/darkMode";
import promptCollectionsReducer from "./reducers/promptCollections";

const rootReducer = combineReducers({
  prompts: promptsReducer,
  collections: collectionsReducer,
  promptCollections: promptCollectionsReducer,
  darkMode: darkModeReducer,
});

// Create store with promptsReducer and middleware using configureStore
const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export default store;
