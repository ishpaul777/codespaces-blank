import { PERSONA_API } from "../constants/persona";

export const getPersona = ({ page, limit, search_query }) => {
  return fetch(PERSONA_API, {
    params: {
      page: page,
      limit: limit,
      search_query: search_query,
    },
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
      return data;
    });
  // ;
};
