// promptsReducer.js

const initialState = [];

const promptsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_PROMPT':
      // Add new prompt to state
      return [...state, action.payload];
    case 'DELETE_PROMPT':
      // Remove prompt from state
      return state.filter(prompt => prompt.id !== action.payload);
    case 'UPDATE_PROMPT':
      // Update prompt in state
      return state.map(prompt =>
        prompt.id === action.payload.id ? action.payload : prompt
      );
    case 'GET_ALL_PROMPTS':
      // Set prompts in state
      return action.payload;
    default:
      return state;
  }
};

export default promptsReducer;
