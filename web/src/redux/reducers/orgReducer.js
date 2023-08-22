const initialState = {
  details: [],
  selectedOrg: -1,
};

const orgReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ORGS":
      // Add new org to state
      return {
        ...state,
        details: action.payload,
        selectedOrg:
        // a placeholder check to avoid the error of undefined selectedOrg
          (state.selectedOrg === -1 || state?.selectedOrg === undefined) ? action.payload[0]?.id : state.selectedOrg,
      };

    case "SELECT_ORG":
      // Select org
      return {
        ...state,
        selectedOrg: action.payload,
      };

    default:
      return state;
  }
};

export default orgReducer;
