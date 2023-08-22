import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Arrow from "../../assets/icons/arrow.svg";
import { AiOutlineMenuUnfold, AiOutlineRobot } from "react-icons/ai";
import { logout } from "../../actions/kratos";
import { errorToast } from "../../util/toasts";
import useDarkMode from "../../hooks/useDarkMode";
import useWindowSize from "../../hooks/useWindowSize";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { IoImagesOutline } from "react-icons/io5";
import { TiFlowMerge } from "react-icons/ti";
import { BsChatLeftText } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import logo from "../../assets/FactlyLogotext.svg";
import { getOrganisationsFromKavach } from "../../actions/organisation";
import { useDispatch, useSelector } from "react-redux";
import { withOrg } from "../organisation/withOrg";
import { getInitials } from "../../util/sluger";

export function Sidebar({ sideBarOpen, setSidebarOpen }) {
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { isMobileScreen } = useWindowSize();
  const { darkMode } = useDarkMode();

  const { organisation } = useSelector(({ organisations }) => {
    let org = organisations?.details?.find(
      (org) => org?.id === organisations?.selectedOrg
    );
    return {
      organisation: org,
    };
  });

  const menuOptions = [
    {
      name: "Dashboard",
      icon: MdOutlineSpaceDashboard,
      linkTo: "/",
    },
    {
      name: "Documents",
      icon: HiOutlineDocumentDuplicate,
      linkTo: "/documents",
    },
    {
      name: "Images",
      icon: IoImagesOutline,
      linkTo: "/images",
    },
    {
      name: "Personas",
      icon: AiOutlineRobot,
      linkTo: "/personas",
    },
    {
      name: "Workflows",
      icon: TiFlowMerge,
      linkTo: "/workflows",
    },
    {
      name: "Chat",
      icon: BsChatLeftText,
      linkTo: "/chats/dashboard",
    },
  ];

  const handleLogout = () => {
    logout()
      .then((res) => {
        window.location.href = res.logout_url;
      })
      .catch(() => {
        errorToast("error logging out");
      });
  };

  const manageProfileOptions = [
    {
      name: "Settings",
      icon: FiSettings,
      linkTo: "/org",
    },
    {
      name: "Logout",
      icon: BiLogOutCircle,
      linkTo: "/",
      onClick: handleLogout,
    },
  ];

  // getOrgName trims down the organisation name and adds a ellipsis to the end of it if it's length is greater than MAX_ORG_NAME_LENGTH
  const getOrgName = (name) => {
    const MAX_ORG_NAME_LENGTH = 15;
    if (name.length > MAX_ORG_NAME_LENGTH) {
      return `${name.slice(0, MAX_ORG_NAME_LENGTH)}...`;
    }
    return name;
  };

  useEffect(() => {
    const path = window.location.pathname;

    let index = 0;
    if (process.env.NODE_ENV === "development") {
      // find index of the menu option based on the path
      menuOptions.forEach((option, currentIndex) => {
        if (`/.factly/tagore/web${option}` === path) {
          index = currentIndex;
          return;
        }
      });
    } else {
      index = menuOptions.findIndex((option) => option.linkTo === path);
    }
    if (index > -1) {
      setActiveTab(index);
    } else {
      setActiveTab(0);
    }
  }, []);

  const styles = {
    icons: {
      color: "#000000",
      fontSize: "1.5rem",
    },
    manageicons: {
      fontSize: "1rem",
    },
  };

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

  return (
    <div
      className={`${
        isMobileScreen
          ? sideBarOpen
            ? "w-[100vw] fixed right-0 top-0 z-50 flex flex-row-reverse duration-300"
            : "w-0"
          : "w-full"
      } `}
    >
      {(!isMobileScreen || sideBarOpen) && (
        <>
          <div
            className={`${
              isMobileScreen ? "w-[80vw] z-50" : "w-full"
            } p-5 pt-8 bg-background-sidebar h-screen flex flex-col dark:bg-background-sidebar-alt`}
          >
            <div className={`flex gap-x-2 items-center justify-center w-full`}>
              <img
                src={logo}
                className="cursor-pointer w-full h-[48px]"
                alt="logo"
              />
            </div>
            {/* Sidebar menu options */}
            <ul className={`pt-6 flex-col items-center justify-center mt-10`}>
              {menuOptions.map((menu, index) => (
                <Link to={menu.linkTo} key={index}>
                  <li
                    key={index}
                    className={`text-base font-normal text-black flex items-center justify-start pr-4 pl-4 pt-2 pb-2 cursor-pointer rounded-lg
                ${
                  activeTab !== index
                    ? "dark:hover:bg-button-primary-alt hover:bg-button-primary"
                    : "dark:bg-button-primary-alt bg-button-primary"
                }
                mt-2 dark:text-white`}
                    onClick={() => setActiveTab(index)}
                  >
                    <div className="flex gap-x-4">
                      <menu.icon
                        size={styles.icons.fontSize}
                        color={styles.icons.color}
                      />
                      <h3>{menu.name}</h3>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
            {/* Menu list when they click on the manage profile button */}
            <div className="flex flex-col mt-auto gap-2">
              {openMenu && (
                <ul
                  className={`flex flex-col gap-2 bg-white dark:bg-background-secondary-alt p-2 rounded-lg`}
                >
                  {manageProfileOptions.map((option, index) => (
                    <Link to={option.linkTo} key={index}>
                      <li
                        className={`flex flex-row items-center gap-4 p-2 rounded hover:bg-button-primary dark:hover:bg-background-sidebar-alt cursor-pointer dark:text-white`}
                        onClick={() => {
                          if (option?.onClick) {
                            option.onClick();
                          }
                        }}
                      >
                        <option.icon
                          size={styles.manageicons.fontSize}
                          color={styles.icons.color}
                        />
                        <h3 className="text-base"> {option.name} </h3>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
              {/* <DarkMode /> */}
              {/* manage profile button */}
              <button
                className={`mb-2 flex flex-row justify-between items-center w-full gap-x-2.5 bg-button-primary ${
                  darkMode && "bg-button-primary-alt"
                } rounded pr-4 pl-4 pt-2 pb-2`}
                onClick={() => setOpenMenu((prevState) => !prevState)}
              >
                <div className="flex flex-row gap-4 items-center">
                  <div className={`bg-red-400 p-2 rounded-full text-white`}>
                    {organisation?.title
                      ? getInitials(organisation?.title)
                      : "--"}
                  </div>
                  <span className="dark:text-white">
                    {organisation?.title
                      ? getOrgName(organisation?.title)
                      : "----"}
                  </span>
                </div>
                <img src={Arrow} />
              </button>
            </div>
          </div>
          {isMobileScreen && (
            <div className="z-40 w-full h-screen fixed inset-0 bg-black bg-opacity-50">
              <AiOutlineMenuUnfold
                className="w-6 h-6 m-4 ml-8 text-white"
                onClick={() => setSidebarOpen(false)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Sidebar;
