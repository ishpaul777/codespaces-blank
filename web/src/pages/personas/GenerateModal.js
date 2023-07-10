import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import regenerate from "../../assets/icons/regenerate.svg";
import check from "../../assets/icons/check.svg";
import avatar from "../../assets/avatar.png";
import avatar2 from "../../assets/avatar2.png";
import avatar3 from "../../assets/avatar3.png";
import avatar4 from "../../assets/avatar4.png";

function Modal({ open, onClose, children, closeButton = true }) {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.keyCode === 27 && open) {
        setSelectedImage(null);
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open, onClose]);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur">
          <div className="bg-white dark:bg-background-secondary-alt rounded-lg shadow-lg p-4 w-[85%] md:w-[65%] h-auto border-2 border-[#D0D5DD] dark:border-[#3b3b3b]">
            {closeButton && (
              <div className="flex items-center p-2 justify-between">
                <h3 className=" not-italic ml-2 font-semibold text-2xl leading-[29px] w-full text-[#1E1E1E] dark:text-white">
                  Generate Avatar
                </h3>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedImage(null);
                    onClose();
                  }}
                >
                  <AiOutlineClose className="ml-auto" size={25} />
                </div>
              </div>
            )}
            <div className="p-4 box-border mt-5 ">
              {" "}
              <div className="flex flex-col gap-12">
                <form>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full flex flex-row items-center gap-2  h-12 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] p-3 border border-[#D0D5DD] rounded-lg dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b] ring-0"
                      // value={inputValue}
                      // onChange={handleInputChange}
                      placeholder="Enter text"
                    />
                    <button
                      type="submit"
                      className="absolute top-[20%] bottom-0 right-2 flex flex-row justify-center items-center gap-2 w-[84px] h-[30px] border shadow-[0px_1px_2px_rgba(16,24,40,0.05)] px-[18px] py-2.5 rounded-lg border-solid border-[#1E1E1E] not-italic bg-[#1e1e1e] font-semibold text-[13px] leading-6 text-white"
                    >
                      Submit
                    </button>
                  </div>
                </form>
                <div className="flex justify-evenly items-center flex-row flex-wrap">
                  <div
                    className={`md:w-[18%] w-[35%]  h-auto relative flex justify-center rounded-full items-center ${
                      selectedImage === 1
                        ? "border-2 border-black"
                        : "border-2 border-transparent"
                    }`}
                  >
                    <img
                      className={`w-full h-full object-strech cursor-pointer rounded-full`}
                      src={avatar}
                      alt="avatar1"
                      onClick={() => handleImageClick(1)}
                    />
                    {selectedImage === 1 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className=" text-4xl text-white">
                          <img src={check} alt="check" />
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={`md:w-[18%] w-[35%]  h-auto relative flex justify-center rounded-full items-center ${
                      selectedImage === 2
                        ? "border-2 border-black"
                        : "border-2 border-transparent"
                    }`}
                  >
                    <img
                      className={`h-full w-full object-strech cursor-pointer rounded-full `}
                      src={avatar2}
                      alt="avatar2"
                      onClick={() => handleImageClick(2)}
                    />
                    {selectedImage === 2 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className=" text-4xl text-white">
                          <img src={check} alt="check" />
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={`md:w-[18%] w-[35%]  h-auto relative flex justify-center rounded-full items-center ${
                      selectedImage === 3
                        ? "border-2 border-black"
                        : "border-2 border-transparent"
                    }`}
                  >
                    <img
                      className={`h-full w-full object-strech cursor-pointer rounded-full `}
                      src={avatar3}
                      alt="avatar3"
                      onClick={() => handleImageClick(3)}
                    />
                    {selectedImage === 3 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className=" text-4xl text-white">
                          <img src={check} alt="check" />
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={`md:w-[18%] w-[35%]  h-auto relative flex justify-center rounded-full items-center ${
                      selectedImage === 4
                        ? "border-2 border-black"
                        : "border-2 border-transparent"
                    }`}
                  >
                    <img
                      className={`h-full w-full object-strech cursor-pointer rounded-full `}
                      src={avatar4}
                      alt="avatar4"
                      onClick={() => handleImageClick(4)}
                    />
                    {selectedImage === 4 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className=" text-4xl text-white">
                          <img src={check} alt="check" />
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className="flex flex-col justify-center items-center w-24 h-24 sm:h-[150px] sm:w-[150px] border border-[#667085] dark:border-[#fff] border-solid rounded-full cursor-pointer"
                    onClick={() => {
                      return setSelectedImage(null);
                    }}
                  >
                    <div className="h-auto">
                      <img src={regenerate} alt="regenerate" className="w-5 h-5 sm:w-8 sm:h-8"/>
                    </div>
                    <div className="w-fit h-fit mt-2 not-italic font-medium text-[14px] leading-6 text-[#667085] dark:text-white">
                      Regenerate
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 justify-center sm:justify-end not-italic  font-semibold text-[13px] leading-6 ">
                  <button className="flex flex-row justify-center items-center gap-2  w-fit h-fit border px-5 py-3 rounded-lg border-solid border-[#628FF3] text-[#628FF3]">
                    Use Default
                  </button>
                  <button className="flex flex-row justify-center items-center gap-2  w-fit h-fit border px-5 py-3 rounded-lg  bg-[#628FF3] text-white">
                    Set Avatar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
