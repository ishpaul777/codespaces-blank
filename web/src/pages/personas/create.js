import { RiShareBoxLine } from "react-icons/ri";
import UppyUploader from "../../components/Uppy";
import { useState } from "react";
import Modal from "../../components/Modal";
import { AiOutlineDelete } from "react-icons/ai";

function Link({ to, children, className, onDelete }) {
  return (
    <div className="flex items-center">
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
      <AiOutlineDelete onClick={onDelete} className="ml-2 text-red-500" />
    </div>
  );
}

export default function CreatePersona() {
  const [avatar, setAvatar] = useState("");
  const [open, setOpen] = useState(false);

  const [requestBody, setRequestBody] = useState({
    name: {
      value: "",
      error: "",
    },
    description: {
      value: "",
      error: "",
    },
    prompt: {
      value: "",
      error: "",
    },
    visibility: {
      value: "",
      error: "",
    },
    avatar: {
      value: "",
      error: "",
    },
  });

  const handleChange = (e) => {};
  const onDelete = () => {
    setAvatar("");
  };
  const handleUpload = (url) => {
    setAvatar(url);
    setOpen(false);
  };
  const handleModalClose = () => {
    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form submitted:", {
      requestBody,
    });
  };

  const styles = {
    text: {
      heading: "",
      description: "",
    },
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5 mx-10">
        <div className="flex flex-row justify-between my-3">
          <h1 className="text-[24px] font-semibold">Create Persona</h1>
          <button
            type="submit"
            className="text-[14px] font-semibold bg-black-50 py-[9px] px-[20px] text-white rounded-lg"
          >
            Create and chat
          </button>
        </div>
        <div className="grid-cols-2 my-10"></div>
        <Modal open={open} onClose={handleModalClose}>
          <UppyUploader onUpload={handleUpload}></UppyUploader>
        </Modal>
      </div>
    </form>
  );
}
