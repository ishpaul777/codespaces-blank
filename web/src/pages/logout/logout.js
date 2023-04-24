import React, { useState } from "react";
import XClose from "../../assets/icons/XClose.svg";
function LogoutModal() {
  const [showModal, setShowModal] = useState(true);

  const handleLogout = () => {
    // code to handle logout
    setShowModal(!showModal);
  };

  return (
    <div>
      {showModal && (
        <div className="fixed bg-[rgba(0,0,0,0.5)] flex justify-center items-center inset-0">
          <div className="bg-[#ffffff] flex flex-col items-center relative w-[400px] h-[154px] shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)] p-0 rounded-xl">
            <div className="relative top-3 bg-[#ffffff] flex  items-center w-[400px] h-[52px] p-[5%]">
              <div className="flex flex-col items-start gap-1 w-[352px] h-7 p-0 not-italic font-semibold text-lg leading-7">
                Are you sure you want to log out?
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="relative right-2"
              >
                <img src={XClose} alt="Close" />
              </button>
            </div>

            <div className=" flex gap-3 w-[100%] h-[65%] relative left-5 top-7 ">
              <button
                className="bg-[#1e1e1e] text-[#ffffff] flex flex-row justify-center items-center gap-2 w-[126px] h-11 border shadow-[0px_1px_2px_rgba(16,24,40,0.05)] px-[18px] py-2.5 rounded-lg border-solid border-[#1E1E1E] not-italic font-semibold text-base leading-6"
                onClick={handleLogout}
              >
                Yes, log out
              </button>
              <button
                className="bg-[#ffffff] box-border flex flex-row justify-center items-center gap-2 w-[101px] h-11 border shadow-[0px_1px_2px_rgba(16,24,40,0.05)] px-[18px] py-2.5 border-solid border-[#D0D5DD] rounded-lg not-italic font-semibold text-base leading-6 text-[#344054]"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default LogoutModal;
