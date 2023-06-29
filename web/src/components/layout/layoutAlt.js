import { Outlet } from "react-router-dom";

import { SidebarAlt } from "./sidebarAlt";
import { ToastContainer } from "react-toastify";
export default function LayoutAlt() {
  return (
    <div className="flex flex-row h-screen w-full">
      <SidebarAlt />
      <main className="w-5/6 max-h-screen overflow-y-auto">
        <Outlet></Outlet>
      </main>
      <ToastContainer
         toastClassName={ ({ type }) =>
          type === "error"
            ? "w-[340px] border-l-[12px] border-[#DA3125] rounded-md shadow-lg bg-[#FFF]"
            : type === "success"
            ? "w-[340px] border-l-4 border-[#03C04A] rounded-md shadow-lg bg-[#FFF]"
            : type === "warning"
            ? "w-[340px] border-l-4 border-[#EA8700] rounded-md shadow-lg bg-[#FFF]"
            : ""
        }
        className="space-y-4  "
      />
    </div>
  );
}
