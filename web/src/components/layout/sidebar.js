import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import ArrowWithTail from "../../assets/icons/arrow-with-tail.svg";
import Arrow from "../../assets/icons/arrow.svg";
import Bookmark from "../../assets/icons/bookmark.svg";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import Chat from "../../assets/icons/chat.svg";
import ChatDark from "../../assets/icons/chatDark.svg";
import Documents from "../../assets/icons/documents.svg";
import Home from "../../assets/icons/home.svg";
import History from "../../assets/icons/history.svg";
import Images from "../../assets/icons/images.svg";
import Logout from "../../assets/icons/logout.svg";
import Profile from "../../assets/icons/profile.svg";
import Templates from "../../assets/icons/templates.svg";
import TemplatesDark from "../../assets/icons/templatesDark.svg";
import Usage from "../../assets/icons/usage.svg";
import UsageDark from "../../assets/icons/usageDark.svg";
import Workflow from "../../assets/icons/workflow.svg";
import WorkFlowDark from "../../assets/icons/workflowDark.svg";
import DocumentsDark from "../../assets/icons/documents_dark.svg";
import ImagesDark from "../../assets/icons/images_dark.svg";
import DashboardDark from "../../assets/icons/dashboard_dark.svg";
import { logout } from "../../actions/kratos";
import { errorToast } from "../../util/toasts";
import useDarkMode from "../../hooks/useDarkMode";
import useWindowSize from "../../hooks/useWindowSize";
import DarkMode from "../buttons/DarkMode";

// import FactlyLogo from '../../assets/factly-logo.svg';

export function Sidebar({ sideBarOpen, setSidebarOpen }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { isMobileScreen } = useWindowSize();
  const { darkMode } = useDarkMode();

  const menuOptions = [
    {
      name: "Dashboard",
      icon: darkMode ? DashboardDark : Home,
      linkTo: "/",
    },
    {
      name: "Documents",
      icon: darkMode ? DocumentsDark : Documents,
      linkTo: "/documents",
    },
    {
      name: "Images",
      icon: darkMode ? ImagesDark : Images,
      linkTo: "/images",
    },
    {
      name: "Personas",
      icon: darkMode ? TemplatesDark : Templates,
      linkTo: "/personas",
    },
    {
      name: "Workflows",
      icon: darkMode ? WorkFlowDark : Workflow,
      linkTo: "/workflows",
    },
    {
      name: "Chat",
      icon: darkMode ? ChatDark : Chat,
      linkTo: "/chats/dashboard",
    },
    {
      name: "Usage",
      icon: darkMode ? UsageDark : Usage,
      linkTo: "/usage",
    }
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
    // {
    //   icon: Profile,
    //   linkTo: "/profile",
    // },
    // {
    //   name: "History",
    //   icon: History,
    //   linkTo: "/history",
    //   arrow: ArrowLeft,
    // },
    // {
    //   name: "Favorites",
    //   icon: Bookmark,
    //   linkTo: "/favorites",
    //   arrow: ArrowLeft,
    // },
    // {
    //   name: "Usage",
    //   icon: Usage,
    //   linkTo: "/usage",
    // },
    {
      name: "Logout",
      icon: Logout,
      linkTo: "/logout",
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
            <div className={`flex gap-x-2 items-center justify-center w-fit`}>
              <img
                src="https://images.factly.in/login/applications/logos/factly.png?rs:fill/h:60"
                className="cursor-pointer w-3/4"
                alt="logo"
              />
            </div>
            {/* Sidebar menu options */}
            <ul className={`pt-6 flex-col items-center justify-center mt-10`}>
              {menuOptions.map((menu, index) => (
                <Link to={menu.linkTo}>
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
                      <img src={menu.icon} alt="menu-icon" />
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
                  {manageProfileOptions.map((option) => (
                    <Link to={option.linkTo}>
                      <li
                        className={`flex flex-row items-center gap-4 p-2 rounded hover:bg-button-primary dark:hover:bg-background-sidebar-alt cursor-pointer dark:text-white`}
                        onClick={() => {
                          if (option?.onClick) {
                            option.onClick();
                          }
                        }}
                      >
                        {option.name === "View Profile" ? (
                          <div className="bg-red-400 rounded-full text-white text-center  h-6 w-6 ">
                            {" "}
                            F{" "}
                          </div>
                        ) : (
                          <img src={option.icon} />
                        )}
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
                    {" "}
                    FM{" "}
                  </div>
                  <span className="dark:text-white">
                    {getOrgName("Factly Media and Research")}
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
// export function Sidebar({ children }) {

//   const [openMenu, setOpenMenu] = useState(false);

//   const menuOptions = [
//     {
//       name: "Dashboard",
//       icon: "home",
//       linkTo: "/",
//     },
//     {
//       name: "Documents",
//       icon: "documents",
//       linkTo: "/documents",
//     },
//     {
//       name: "Images",
//       icon: "images",
//       linkTo: "/images",
//     },
//     {
//       name: "Templates",
//       icon: "templates",
//       linkTo: "/templates",
//     },
//     {
//       name: "Chat",
//       icon: "chat",
//       linkTo: "/chats",
//     },
//   ];

//   const manageProfileOptions = [
//     {
//       name: "View Profile",
//       icon: "profile",
//       linkTo: "/profile",
//     },
//     {
//       name: "History",
//       icon: "history",
//       linkTo: "/history",
//     },
//     {
//       name: "Favorites",
//       icon: "bookmark",
//       linkTo: "/favorites",
//     },
//     {
//       name: "Usage",
//       icon: "usage",
//       linkTo: "/usage",
//     },
//     {
//       name: "Logout",
//       icon: "logout",
//       linkTo: "/logout",
//     },
//   ];

//   const handleSidebarClick = (index) => {
//     sidebarData.setActiveTabSetter(index);
//   };

//   if (!sidebarData.visible) return null;

//   return (
//     <div
//       className={`p-5 pt-8 w-1/6 bg-background-sidebar h-screen flex flex-col`}
//     >
//       <div
//         className={`flex gap-x-2 items-center justify-center ${
//           open ? "ml-2" : null
//         }`}
//       >
//         {open ? (
//           <img
//             src="https://images.factly.in/login/applications/logos/factly.png?rs:fill/h:60"
//             className="cursor-pointer w-3/4"
//           />
//         ) : (
//           <img src="/factly-logo.png" className="object-cover cursor-pointer" />
//         )}
//       </div>
//       {/* Sidebar menu options */}
//       <ul className={`pt-6 flex-col items-center justify-center mt-10`}>
//         {menuOptions.map((menu, index) => (
//           <Link to={menu.linkTo}>
//             <li
//               key={index}
//               className={`text-base font-normal text-black flex items-center justify-start pr-4 pl-4 pt-2 pb-2 cursor-pointer rounded-lg
//                 ${
//                   sidebarData?.activeTab !== index && "hover:bg-button-primary"
//                 }
//                 ${sidebarData?.activeTab === index && "bg-button-primary"}
//                 mt-2`}
//               onClick={() => handleSidebarClick(index)}
//             >
//               <div className="flex gap-x-4">
//                 <img src={`/icons/${menu.icon}.svg`} />
//                 {open ? <h3>{menu.name}</h3> : null}
//               </div>
//             </li>
//           </Link>
//         ))}
//       </ul>
//       {/* Menu list when they click on the manage profile button */}
//       <div className="flex flex-col mt-auto gap-2">
//         {openMenu && (
//           <ul className={`flex flex-col gap-2 bg-white p-2 rounded-lg`}>
//             {manageProfileOptions.map((option) => (
//               <Link to={option.linkTo}>
//                 <li
//                   className={`flex flex-row items-center gap-4 p-2 ${
//                     option.name !== "Logout"
//                       ? "hover:bg-button-primary"
//                       : "hover:bg-red-600 hover:text-white border-t"
//                   } cursor-pointer`}
//                 >
//                   {option.name === "View Profile" ? (
//                     <div className="bg-red-400 rounded-full text-white text-center  h-6 w-6 ">
//                       {" "}
//                       F{" "}
//                     </div>
//                   ) : (
//                     <img src={`/icons/${option.icon}.svg`} />
//                   )}
//                   <h3 className="text-base"> {option.name} </h3>
//                 </li>
//               </Link>
//             ))}
//           </ul>
//         )}
//         {/* manage profile button */}
//         <button
//           className={`mb-2 flex flex-row justify-between items-center w-full gap-x-2.5 bg-button-primary rounded pr-4 pl-4 pt-2 pb-2`}
//           onClick={() => setOpenMenu((prevState) => !prevState)}
//         >
//           <div className="flex flex-row gap-4 items-center">
//             <div className="bg-red-400 p-2 rounded-full text-white"> FM </div>
//             <span>{getOrgName("Factly Media and Research")}</span>
//           </div>
//           <img src={"/icons/arrow.svg"} />
//         </button>
//       </div>
//     </div>
//   );
// }
