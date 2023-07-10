const initialState = localStorage.getItem('darkMode') === 'true';

const darkModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      // Toggle website theme
      return action.payload;

    default:
      return state;
  }
};

export default darkModeReducer;
