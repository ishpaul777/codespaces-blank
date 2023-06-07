import { useState } from "react";
import { Link } from "react-router-dom";
import Arrow from "../../assets/icons/arrow.svg";
import Documents from "../../assets/icons/documents.svg";
import Home from "../../assets/icons/home.svg";
import Images from "../../assets/icons/images.svg";
import Logout from "../../assets/icons/logout.svg";

// import FactlyLogo from '../../assets/factly-logo.svg';

export function SidebarAlt() {
  const [colorTab, setColorTab] = useState(null);
  const [activeTab, setActiveTab] = useState([]);

  const handleArrowClick = (index) => {
    setActiveTab((prevActiveTabs) => {
      if (prevActiveTabs.includes(index)) {
        return prevActiveTabs.filter((tab) => tab !== index); // Close the clicked sub-option
      } else {
        return [...prevActiveTabs, index]; // Open the clicked sub-option
      }
    });
  };

  const isSubMenuVisible = (index) => {
    return activeTab.includes(index);
  };
  const menuOptions = [
    {
      name: "Account",
      icon: Home,
      linkTo: "/",
    },
    {
      name: "History",
      icon: Documents,
      arrow: Arrow,
      subOptions: [
        {
          name: "Text",
        },
        {
          name: "Image",
        },
        {
          name: "Document",
        },
      ],
    },
    {
      name: "Favorites",
      icon: Documents,
      arrow: Arrow,
      subOptions: [
        {
          name: "Text",
        },
        {
          name: "Image",
        },
        {
          name: "Document",
        },
      ],
    },
    {
      name: "Usage",
      icon: Images,
      linkTo: "/usage",
    },
    {
      name: "Playground",
      icon: Images,
      linkTo: "/playground",
    },
  ];

  return (
    <div className="flex flex-col p-5 pt-8 w-1/6 h-full bg-background-sidebar justify-between">
      <div>
        <div className={`flex gap-x-2 items-center justify-center w-fit`}>
          <img
            src="https://images.factly.in/login/applications/logos/factly.png?rs:fill/h:60"
            className="cursor-pointer w-3/4"
            alt="logo"
          />
        </div>

        <ul
          className={`flex flex-col pt-6 items-center justify-center mt-10 w-[100%]`}
        >
          {menuOptions.map((menu, index) => (
            <Link to={menu.linkTo}>
              <li
                key={index}
                className={`flex flex-col justify-between text-base font-normal text-black flex items-center justify-start pr-4 pl-4 pt-2 pb-2 cursor-pointer rounded-lg
              ${colorTab !== index && "hover:bg-button-primary"} 
              ${colorTab === index && "bg-button-primary"} 
              mt-2`}
              >
                <div className="flex justify-between w-[12vw] ">
                  <div className="flex gap-x-4 justify-start">
                    <img src={menu.icon} alt="menu-icon" />
                    <h3>{menu.name}</h3>
                  </div>
                  <div className="flex justify-center items-center">
                    {menu.subOptions && (
                      <img
                        onClick={() => handleArrowClick(index)}
                        className={`-rotate-90 p-[5px] ${
                          isSubMenuVisible(index) && "rotate-0"
                        }`}
                        src={menu.arrow}
                        alt="arrow"
                      />
                    )}
                  </div>
                </div>
                {isSubMenuVisible(index) && menu.subOptions && (
                  <ul className="flex flex-col items-evenly justify-evenly mt-2 h-[100px] mr-11">
                    {menu.subOptions.map((subOption, subIndex) => (
                      <li key={subIndex}>
                        <div className="flex gap-x-4">
                          <h3>{subOption.name}</h3>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="flex gap-x-4 h-[7%] text-base font-normal text-black items-center justify-start p-3 cursor-pointer bg-button-primary">
        <img className="w-[18px] h-[18px]" src={Logout} alt="Logout" />
        <h3>Logout</h3>
      </div>
    </div>
  );
}
