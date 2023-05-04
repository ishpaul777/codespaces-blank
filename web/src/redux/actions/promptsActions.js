// promptsActions.js

// Action creator for creating a new prompt
export const createPrompt = prompt => ({
  type: 'CREATE_PROMPT',
  payload: prompt
});

// Action creator for deleting a prompt
export const deletePrompt = promptId => ({
  type: 'DELETE_PROMPT',
  payload: promptId
});

// Action creator for updating a prompt
export const updatePrompt = prompt => ({
  type: 'UPDATE_PROMPT',
  payload: prompt
});

// Action creator for getting all prompts
export const getAllPrompts = prompts => ({
  type: 'GET_ALL_PROMPTS',
  payload: prompts
});
