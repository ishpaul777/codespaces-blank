import React from "react";
import Factly from "../../assets/FactlyLogotext.svg";
import { Outlet } from "react-router-dom";

function AuthLayout({ title }) {
  return (
    <div className="h-screen md:flex-row flex flex-col bg-[#f3f5f8]">
      <div className="relative overflow-hidden flex w-1/2 md:bg-white justify-around items-center bg-[#f3f5f8] p-4 md:p-0">
        <div>
          <img src={Factly} alt="Factly Logo" />
        </div>
      </div>
      <div className="flex flex-col gap-10 md:w-1/2 justify-center py-10 px-16 md:px-36 items-center bg-[#F3F5F8]">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
