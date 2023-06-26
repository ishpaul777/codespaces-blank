import { Outlet } from "react-router-dom";

import { SidebarAlt } from "./sidebarAlt";
import { ToastContainer } from "react-toastify";
import useDarkMode from "../../hooks/useDarkMode";

export default function LayoutAlt() {
  const { darkMode } = useDarkMode()
  return (
    <div className="flex flex-row h-screen w-full">
      <SidebarAlt />
      <main className={`w-full max-h-screen overflow-y-auto ${darkMode && 'bg-background-secondary-alt'}`}>
        <Outlet></Outlet>
      </main>
      <ToastContainer />
    </div>
  );
}
