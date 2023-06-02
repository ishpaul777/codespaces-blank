const initialState = [
	{
		id: 1, name: "First Collection",
		prompts: [{
			created_at: "2023-06-02T08:06:16.014478Z", created_by_id: 3,
			deleted_at: null, description: "this is test", id: 1, prompt: "{{new}}",
			prompt_template_collection: null,
			prompt_template_collection_id: null,
			title: "new",
			updated_at: "2023-06-02T08:06:16.014478Z",
			updated_by_id: 0
		}]
	},
	{
		id: 2, name: "Second Collection",
		chats: [{ id: 1, name: "Chat 1" }, { id: 2, name: "Chat 2" }]
	},
];

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
		// case "ADD_PROMPT_TO_PROMPT_COLLECTION":
		//   // remove chat from current collection and add to new collection
		//   const { collectionId, chat } = action.payload;
		//   // remove chat from current collection
		//   const newState = state.map((collection) => {
		//     collection.chats = collection.chats.filter( (c) => c.id !== chat.id);
		//     return collection;
		//   });
		//   // add chat to new collection
		//   return newState.map((collection) => {
		//     if (collection.id === collectionId) {
		//       return { ...collection, chats: [chat, ...collection.chats] };
		//     } else {
		//       return collection;
		//     }
		//   });

		default:
			return state;
	}
};

export default promptCollectionsReducer;
