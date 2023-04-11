import { toast } from "react-toastify";

const errorToast = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 5000,
  });
};

const successToast = (message) => {
  toast.success(message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 5000,
  });
};

export { errorToast, successToast };
