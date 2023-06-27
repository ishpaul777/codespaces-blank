const initialState = [];

const promptCollectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_PROMPT_COLLECTION":
      // Add new collection to state
      return [action.payload, ...state];
    case "DELETE_PROMPT_COLLECTION":
      // Remove collection from state
      return state.filter((collection) => collection.id !== action.payload);
    case "UPDATE_PROMPT_COLLECTION":
      // Update collection in state
      return state.map((collection) =>
        collection.id === action.payload.id ? action.payload : collection
      );
    case "GET_ALL_PROMPT_COLLECTIONS":
      // Set collections in state
      return action.payload;
    case "ADD_PROMPT_TO_PROMPT_COLLECTION": {
      // remove prompt from current collection and add to new collection
      let { collectionId, prompt } = action.payload;
      // remove prompt from current collection
      const newState = state.map((collection) => {
        collection.prompt_templates = collection.prompt_templates?.filter(
          (p) => p.id !== prompt.id
        );
        return collection;
      });
      // add chat to new collection
      return newState.map((collection) => {
        if (collection.id === collectionId) {
          if (collection.prompt_templates)
            return {
              ...collection,
              prompt_templates: [prompt, ...collection.prompt_templates],
            };
          else return { ...collection, prompt_templates: [prompt] };
        } else {
          return collection;
        }
      });
    }
    case "REMOVE_PROMPT_FROM_PROMPT_COLLECTION": {
      let { prompt } = action.payload;
      return state.map((collection) => {
        collection.prompt_templates = collection.prompt_templates?.filter(
          (p) => p.id !== prompt.id
        );
        return collection;
      });
    }

    default:
      return state;
  }
};

export default promptCollectionsReducer;
