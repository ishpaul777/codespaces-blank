import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { SidebarAlt } from './sidebarAlt';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import useWindowSize from '../../hooks/useWindowSize';
import MenuIcon from '../MenuIcon';
import useDarkMode from '../../hooks/useDarkMode';
import DarkMode from '../buttons/DarkMode';
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
  const { isMobileScreen } = useWindowSize();
  const [sideBarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`${isMobileScreen ? 'w-full flex-wrap' : ''
        } flex flex-row h-screen max-h-screen overflow-y-auto`}
    >
      <div className="">
        {isMobileScreen && (
          <nav className="w-screen flex justify-between items-end fixed top-0 bg-[#DCE4E7] dark:bg-background-sidebar-alt px-8 pb-4 pt-10 z-30">
            <img
              src="https://images.factly.in/login/applications/logos/factly.png?rs:fill/h:60"
              className="cursor-pointer w-[123px] h-[32px]"
              alt="logo"
            />
            <div onClick={() => setSidebarOpen(true)}>
              <MenuIcon className="w-8 h-8 dark:text-white" />
            </div>
          </nav>
        )}
        <Sidebar sideBarOpen={sideBarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
      <main
        className={`${isMobileScreen ? 'mt-10 w-full' : 'w-5/6 max-h-screen overflow-y-auto'
          } dark:bg-background-secondary-alt`}
      >
        <Outlet></Outlet>
      </main>
      {!isMobileScreen && <DarkMode />}
      <ToastContainer
        toastClassName={({ type }) =>
          type === "error"
            ? "w-[340px] border-l-[12px] border-[#DA3125] rounded-md shadow-lg bg-[#FFF]"
            : type === "success"
              ? "w-[340px] border-l-[12px] border-[#03C04A] rounded-md shadow-lg bg-[#FFF]"
              : type === "warning"
                ? "w-[340px] border-l-[12px] border-[#EA8700] rounded-md shadow-lg bg-[#FFF]"
                : ""
        }
        className="space-y-4  "
      />
    </div>
  );
}
