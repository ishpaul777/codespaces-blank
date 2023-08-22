import { useDispatch, useSelector } from "react-redux";
import { getOrganisationsFromKavach } from "../../actions/organisation";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const withOrg = (Component) => (props) => {
  const { selectedOrgID } = useSelector(({ organisations }) => {
    return {
      selectedOrgID: organisations?.selectedOrg,
    };
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchOrganisationsFromKavach = async () => {
    const response = await getOrganisationsFromKavach();

    if (response?.length === 0) {
      navigate("/createOrg");
    }
    // if(true) {
    //   navigate('/createOrg');
    // }
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

  return <Component {...props} selectedOrg={selectedOrgID} />;
};
