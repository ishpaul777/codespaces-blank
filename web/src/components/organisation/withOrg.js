import { useDispatch, useSelector } from "react-redux";
import { getOrganisationsFromKavach } from "../../actions/organisation";
import { useEffect } from "react";

export const withOrg = (Component) => (props) => {
  const dispatch = useDispatch();
  const fetchOrganisationsFromKavach = async () => {
    const response = await getOrganisationsFromKavach();
    dispatch({
      type: "ADD_ORGS",
      payload: response?.map((org) => ({
        ...org?.organisation,
        role: org?.permission?.role,
      })),
    });
  };

  useEffect(() => {
    fetchOrganisationsFromKavach();
  }, []);

  const { selectedOrgID } = useSelector(({ organisations }) => {
    return {
      selectedOrgID: organisations?.selectedOrg,
    };
  });

  return <Component {...props} selectedOrg={selectedOrgID} />;
};
