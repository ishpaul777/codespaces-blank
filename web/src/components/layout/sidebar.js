import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import ArrowWithTail from "../../assets/icons/arrow-with-tail.svg";
import Arrow from "../../assets/icons/arrow.svg";
import Bookmark from "../../assets/icons/bookmark.svg";
import Chat from "../../assets/icons/chat.svg";
import Documents from "../../assets/icons/documents.svg";
import Home from "../../assets/icons/home.svg";
import History from "../../assets/icons/history.svg";
import Images from "../../assets/icons/images.svg";
import Logout from "../../assets/icons/logout.svg";
import Profile from "../../assets/icons/profile.svg";
import Templates from "../../assets/icons/templates.svg";
import Usage from "../../assets/icons/usage.svg";

// import FactlyLogo from '../../assets/factly-logo.svg';

export function Sidebar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const menuOptions = [
    {
      name: "Dashboard",
      icon: Home,
      linkTo: "/",
    },
    {
      name: "Documents",
      icon: Documents,
      linkTo: "/documents",
    },
    {
      name: "Images",
      icon: Images,
      linkTo: "/images",
    },
    {
      name: "Personas",
      icon: Templates,
      linkTo: "/personas",
    },
    {
      name: "Chat",
      icon: Chat,
      linkTo: "/chats/dashboard",
    },
  ];

  const manageProfileOptions = [
    {
      name: "View Profile",
      icon: Profile,
      linkTo: "/profile",
    },
    {
      name: "History",
      icon: History,
      linkTo: "/history",
      arrow: ArrowLeft,
    },
    {
      name: "Favorites",
      icon: Bookmark,
      linkTo: "/favorites",
      arrow: ArrowLeft,
    },
    {
      name: "Usage",
      icon: Usage,
      linkTo: "/usage",
    },
    {
      name: "Logout",
      icon: Logout,
      linkTo: "/logout",
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
      className={`p-5 pt-8 w-fit bg-background-sidebar h-screen flex flex-col`}
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
                ${activeTab !== index && "hover:bg-button-primary"} 
                ${activeTab === index && "bg-button-primary"} 
                mt-2`}
              onClick={() => setActiveTab(index)}
            >
              <div className="flex gap-x-4">
                <img src={menu.icon} alt="menu-icon" />
                <h3>{menu.name}</h3>
              </div>
              <div>{menu.arrow}</div>
            </li>
          </Link>
        ))}
      </ul>
      {/* Menu list when they click on the manage profile button */}
      <div className="flex flex-col mt-auto gap-2">
        {openMenu && (
          <ul className={`flex flex-col gap-2 bg-white p-2 rounded-lg`}>
            {manageProfileOptions.map((option) => (
              <Link to={option.linkTo}>
                <li
                  className={`flex flex-row items-center gap-4 p-2 ${
                    option.name !== "Logout"
                      ? "hover:bg-button-primary"
                      : "hover:bg-red-600 hover:text-white border-t"
                  } cursor-pointer`}
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
        {/* manage profile button */}
        <button
          className={`mb-2 flex flex-row justify-between items-center w-full gap-x-2.5 bg-button-primary rounded pr-4 pl-4 pt-2 pb-2`}
          onClick={() => setOpenMenu((prevState) => !prevState)}
        >
          <div className="flex flex-row gap-4 items-center">
            <div className="bg-red-400 p-2 rounded-full text-white"> FM </div>
            <span>{getOrgName("Factly Media and Research")}</span>
          </div>
          <img src={Arrow} />
        </button>
      </div>
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
