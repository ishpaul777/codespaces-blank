const intialState = {
  details: {},
};

const profileReducer = (state = intialState, action) => {
  switch (action.type) {
    case "ADD_PROFILE":
      return {
        ...state,
        details: action.payload,
      };
    default:
      return state;
  }
};

export default profileReducer;
