// getKratosSessionDetails
export const getKratosSessionDetails = async () => {
  const response = await fetch(
    `${window.REACT_APP_KRATOS_PUBLIC_URL}/sessions/whoami`,
    {
      credentials: "include",
    }
  );
  if (response.status === 401) {
    return Error("Unauthorized");
  }
  const data = await response.json();
  return data;
};

export const logout = async () => {
  const response = await fetch(
    window.REACT_APP_KRATOS_PUBLIC_URL + "/self-service/logout/browser",
    {
      credentials: "include",
    }
  );

  if (response.status === 401) {
    return Error("Unauthorized");
  }
  const data = await response.json();
  return data;
};
