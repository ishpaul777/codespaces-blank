import React, { useState } from "react";
function Modal(props) {
  const [isOpen, setIsOpen] = useState(props.visible);

  const handleOk = () => {
    props.onOk();
    setIsOpen(false);
  };

  const handleCancel = () => {
    props.onCancel();
    setIsOpen(false);
  };
  const overlayClasses =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
  const modalClasses =
    "fixed z-50 left-1/2 w-2/6 top-1/2 transform -translate-x-1/2 flex flex-col justify-between -translate-y-1/2 bg-white rounded-md shadow-lg p-4 minh-2/5 transition-all duration-300 ease-in-out";
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
            className="mr-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            onClick={() => handleOk()}
            {...props.okButtonProps}
          >
            {props.okText}
          </button>
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
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
