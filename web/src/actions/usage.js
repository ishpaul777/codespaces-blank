export const getUsage = ({
  target_month,
  model,
  provider,
  type,
  usage_type,
  org_id,
  is_admin,
  view,
  other_user_id,
}) => {
  // query parameters:
  //  - target_month: the month and year to get usage for
  //  - model: the model to get usage for
  //  - provider: the provider to get usage for
  //  - type: chat, generate or persona
  return fetch(
    `${window.REACT_APP_TAGORE_API_URL}/usage?` +
      new URLSearchParams({
        target_month,
        model,
        provider,
        type,
        usage_type,
        is_admin,
        view,
        other_user_id
      }),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Organisation": org_id,
      },
      credentials: "include",
    }
  ).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      return response.json().then((data) => {
        throw Error(data.errors?.[0].message);
      });
    }
  });
};
