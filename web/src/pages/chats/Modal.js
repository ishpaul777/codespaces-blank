import React, { useState } from "react";
import userWindowSize from "../../hooks/useWindowSize";

function Modal(props) {
  const handleOk = () => {
    props.onOk();
  };
  const { isMobileScreen } = userWindowSize();

  const handleCancel = () => {
    props.onCancel();
  };
  const overlayClasses =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
  const modalClasses = `fixed z-50 left-1/2 ${
    isMobileScreen ? "w-[90vw]" : "w-2/6"
  } top-1/2 transform -translate-x-1/2 flex flex-col justify-between -translate-y-1/2 bg-white rounded-md shadow-lg p-4 minh-2/5 transition-all duration-300 ease-in-out dark:bg-background-sidebar-alt dark:text-white dark:border-[#3B3B3B]`;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div
      className={props.visible ? overlayClasses : " w-0 h-0"}
      onClick={handleOverlayClick}
    >
      <div className={props.visible ? modalClasses : " w-0 h-0"}>
        {props.visible && props.title && (
          <div className=" text-xl font-bold px-4 py-3 border-b border-gray-300">
            {props.title}
          </div>
        )}
        <div className={!props.visible ? "hidden" : "px-4 h-full py-3"}>
          {props.children}
        </div>
        <div
          className={
            !props.visible
              ? "hidden"
              : "flex px-4 py-3 border-t border-gray-300"
          }
        >
          <button
            className="mr-2 px-4 py-2 text-white bg-black dark:bg-white rounded-md hover:bg-white focus:outline-none dark:text-black-50"
            onClick={() => handleOk()}
          >
            {props.okText}
          </button>
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none dark:text-white"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
