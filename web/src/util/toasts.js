import { toast } from "react-toastify";
import ErrorImage from "../assets/icons/Error.svg";
import SuccessImage from "../assets/icons/Success.svg";
import WarningImage from "../assets/icons/Warning.svg";
import XCloseImage from "../assets/icons/XClose.svg";

const CustomToast = ({ type, message, closeToast }) => {
  let icon;
  if (type === "error") {
    icon = ErrorImage;
  } else if (type === "success") {
    icon = SuccessImage;
  } else if (type === "warning") {
    icon = WarningImage;
  }

  return (
    <div className="flex items-center gap-12 justify-between px-2  py-1">
      <div className="flex flex-col justify-between gap-2 ">
        <div className="flex justify-start gap-3">
          <div className="w-[25px] flex justify-center items-center">
            <img src={icon} alt="icon" />
          </div>
          <p
            className={`text-lg not-italic font-medium leading-6 ${
              type === "error"
                ? "text-[#DA3125] "
                : type === "success"
                ? "text-[#03C04A] "
                : type === "warning"
                ? "text-[#EA8700]"
                : ""
            }`}
          >
            {type === "error"
              ? "Error"
              : type === "success"
              ? "Success"
              : "Warning"}
          </p>
        </div>
        <div
          className="text-[#475467] text-base not-italic font-normal leading-6"
          dangerouslySetInnerHTML={{ __html: message }}
        ></div>
      </div>
      <div className="w-[25px] flex items-center justify-center">
        <img src={XCloseImage} alt="close" />
      </div>
    </div>
  );
};

const errorToast = (message) => {
  toast.error(<CustomToast type="error" message={message} />, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 5000,
    hideProgressBar: true,
    closeButton: false,
    icon: false,
  });
};

const successToast = (message) => {
  toast.success(<CustomToast type="success" message={message} />, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 5000,
    hideProgressBar: true,
    closeButton: false,
    icon: false,
  });
};

export const getToastClassNameFromType = (type) => {
  switch (type) {
    case "error":
      return "w-[340px] border-l-[12px] border-[#DA3125] rounded-md shadow-lg bg-[#FFF]";
    case "success":
      return "w-[340px] border-l-[12px] border-[#03C04A] rounded-md shadow-lg bg-[#FFF]";
    default:
      return "w-[340px] border-l-[12px] border-[#EA8700] rounded-md shadow-lg bg-[#FFF]";
  }
};

export { errorToast, successToast };
