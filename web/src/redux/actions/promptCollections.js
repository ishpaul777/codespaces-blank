const createPromptCollection = (promptCollection) => async (dispatch) => {
	return fetch(`${process.env.REACT_APP_TAGORE_API_URL}/prompt_template_collection`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(promptCollection),
	})
		.then(async (response) => {
			if (response.status === 200) {
				return response.json();
			} else {
				return response.json().then((data) => {
					throw Error(data.errors?.[0].message);
				});
			}
		})
		.then((data) => {
			dispatch({
				type: "CREATE_PROMPT_COLLECTION",
				payload: data,
			});
		})
		.catch((error) => {
			console.log(error);
		});
};

const deletePromptCollection = (promptCollectionId) => async (dispatch) => {
	return fetch(`${process.env.REACT_APP_TAGORE_API_URL}/prompt_template_collection/${promptCollectionId}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	})
		.then((response) => {
			if (response.status === 200) {
				return response.json();
			} else {
				return response.json().then((data) => {
					throw Error(data.errors?.[0].message);
				});
			}
		})
		.then((data) => {
			dispatch({
				type: "DELETE_PROMPT_COLLECTION",
				payload: promptCollectionId,
			});
		})
		.catch((error) => {
			console.log(error);
		});
}

const getAllPromptCollections = () => async (dispatch) => {
	return fetch(`${process.env.REACT_APP_TAGORE_API_URL}/prompt_template_collection`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	})
		.then(async (response) => {
			if (response.status === 200) {
				return response.json();
			} else {
				return response.json().then((data) => {
					throw Error(data.errors?.[0].message);
				});
			}
		})
		.then((data) => {
			dispatch({
				type: "GET_ALL_PROMPT_COLLECTIONS",
				payload: data.prompt_template_collections,
			});
		})
		.catch((error) => {
			console.log(error);
		});
}

export { createPromptCollection, deletePromptCollection, getAllPromptCollections }
