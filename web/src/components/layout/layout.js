import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { SidebarAlt } from "./sidebarAlt";
import { ToastContainer } from "react-toastify";
export default function Layout() {
  return (
    <div className="flex flex-row h-screen w-full">
      <Sidebar />
      <main className="w-5/6 max-h-screen overflow-y-auto">
        <Outlet></Outlet>
      </main>
      <ToastContainer />
    </div>
  );
}
