import React, { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

function Modal({ open, onClose, children, closeButton = true }) {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.keyCode === 27 && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white rounded-lg shadow-lg p-4">
            {closeButton && (
              <div className="pb-5" onClick={onClose}>
                <AiOutlineClose className="ml-auto" size={20} />
              </div>
            )}
            <div className="p-4 box-border"> {children}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
