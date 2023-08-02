export const getUsageByUser = ({
  target_month,
  model,
  provider,
  type,
  usage_type,
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
      }),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
