import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useDarkMode from "../../hooks/useDarkMode";
import { AiOutlineBarChart } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { FiSettings, FiUser, FiUsers } from "react-icons/fi";
import { getOrganisationsFromKavach } from "../../actions/organisation";
import { useDispatch } from "react-redux";
import { MdOutlineMailOutline } from "react-icons/md";
import { errorToast } from "../../util/toasts";
import { getProfile } from "../../actions/profile";

export function SidebarAlt() {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [colorTab, setColorTab] = useState(0);
  const { darkMode } = useDarkMode();

  const [selectedTab, setSelectedTab] = useState({
    index: 0,
    section: "Organisation",
  });
  const menuOptions = [
    {
      title: "Organisation",
      options: [
        {
          name: "Settings",
          icon: FiSettings,
          linkTo: "/org",
        },
        {
          name: "Usage",
          icon: AiOutlineBarChart,
          linkTo: "/usage",
        },
        {
          name: "Members",
          icon: FiUsers,
          linkTo: "/org/members",
        },
      ],
    },
    {
      title: "Profile",
      options: [
        {
          name: "Profile",
          icon: FiUser,
          linkTo: "/profile",
        },
        {
          name: "Invitations",
          icon: MdOutlineMailOutline,
          linkTo: "/profile/invitations",
        },
        {
          name: "Authentication",
          icon: FiSettings,
          linkTo: "/passwords",
        },
      ],
    },
  ];

  const style = {
    color: "#6e6e81",
    fontSize: "1.5rem",
    selectedColor: "#000000",
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

  const fetchProfile = async () => {
    getProfile()
      .then((res) => {
        dispatch({
          type: "ADD_PROFILE",
          payload: res,
        });
      })
      .catch(() => {
        errorToast("Unable to fetch profile. Please try again later.");
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <div
      className={`flex flex-col p-5 pt-8 w-1/6 h-full ${
        darkMode ? "bg-background-sidebar-alt" : "bg-background-sidebar"
      } justify-between`}
    >
      <div>
        <div className={`flex gap-x-2 items-center justify-center w-fit`}>
          <img
            src="https://images.factly.in/login/applications/logos/factly.png?rs:fill/h:60"
            className="cursor-pointer w-3/4"
            alt="logo"
          />
        </div>

        <ul
          className={`flex flex-col gap-4 pt-6 items-center justify-center mt-10 w-[100%]`}
        >
          {menuOptions.map((menuOption, mIndex) => {
            return (
              <div className="flex flex-col gap-1" key={mIndex}>
                <span className="text-lg font-medium">{menuOption.title}</span>
                <div>
                  {menuOption.options.map((menu, index) => {
                    const isSelected =
                      selectedTab.section === menuOption.title &&
                      selectedTab.index === index;
                    return (
                      <Link to={menu.linkTo} key={index}>
                        <li
                          key={index}
                          className={`flex flex-col justify-between text-base font-normal text-black items-center px-4 py-2 cursor-pointer rounded-lg
                          ${colorTab !== index && "hover:bg-button-primary"}
                          ${
                            colorTab === index &&
                            (darkMode
                              ? "bg-button-primary-alt"
                              : "hover:bg-button-primary")
                          }
                          mt-2 ${
                            darkMode && "text-white hover:bg-button-primary-alt"
                          }`}
                        >
                          <div className="flex justify-between w-[12vw] ">
                            <div
                              className="flex gap-x-4 justify-start items-center"
                              onClick={() => {
                                setSelectedTab({
                                  index: index,
                                  section: menuOption.title,
                                });
                              }}
                            >
                              <menu.icon
                                size={style.fontSize}
                                color={
                                  isSelected ? style.selectedColor : style.color
                                }
                              />
                              <h3
                                className={`${
                                  isSelected ? "text-black" : "text-[#6e6e81]"
                                }`}
                              >
                                {menu.name}
                              </h3>
                            </div>
                          </div>
                        </li>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </ul>
      </div>
      <div
        className={`mb-2 flex flex-row gap-2 items-center justify-center w-full gap-x-2.5 ${
          darkMode && "bg-button-primary-alt"
        } rounded p-3 dark:text-white cursor-pointer`}
        onClick={() => {
          navigate("/");
        }}
      >
        <BiArrowBack size={"16px"} />
        <span className="text-base">Go back</span>
      </div>
    </div>
  );
}
