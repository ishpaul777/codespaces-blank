const initialState = {
  details: [],
  selectedOrg: -1,
};

const orgReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ORGS":
      console.log(state)

      console.log({
        payload: action?.payload
      })

      console.log({
        selectedOrg: state.selectedOrg 
      })

      // Add new org to state
      return {
        ...state,
        details: action.payload,
        selectedOrg:
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
