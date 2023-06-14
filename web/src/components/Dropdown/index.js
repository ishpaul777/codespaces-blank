import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdOutlineHistory } from 'react-icons/md';
import { useDispatch } from "react-redux";
import { VscSettings } from 'react-icons/vsc'
import Modal from "../../pages/chats/Modal";
import ModalContent from "../../pages/chats/createPrompt/modalContent";
import { AiOutlinePlus } from 'react-icons/ai'
import {
  createPromptTemplate,
  getAllPromptTemplates,
} from "../../actions/prompts";
import { createPrompt } from '../../redux/actions/promptsActions'
import { errorToast, successToast } from "../../util/toasts";


const Dropdown = ({ setChatSiderCollapse, handleNewChatClick, setPromptSiderCollapse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch()
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [showPromptCreateModal, setShowPromptCreateModal] = useState(false);
  const [showerror, setShowerror] = useState({
    title: false,
    description: false,
    prompt: false,
  });
  const [promptValues, setPromptValues] = useState({
    title: "",
    description: "",
    prompt: "",
  });

  function handleCreateFormSubmit(values) {
    var error = false;
    if (!values.title || values.title === "") {
      setShowerror((prevValues) => ({ ...prevValues, title: true }));
      error = true;
    }

    if (!values.prompt || values.prompt === "") {
      setShowerror((prevValues) => ({ ...prevValues, prompt: true }));
      error = true;
    }

    if (!values.description || values.description === "") {
      setShowerror((prevValues) => ({ ...prevValues, description: true }));
      error = true;
    }

    if (error) return;

    createPromptTemplate(values)
      .then((data) => {
        dispatch(createPrompt(data))
      })
      .catch((error) => {
        errorToast(error.message);
      });
    setShowPromptCreateModal(false);
    setPromptValues({ title: "", description: "", prompt: "" });
    setShowerror({
      title: "",
      description: "",
      prompt: "",
    });
  }

  function handleValueChange(event) {
    const { name, value } = event.target;
    setPromptValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  return (
    <div>
      <BsThreeDotsVertical
        size={16}
        onClick={toggleDropdown}
      />
      {isOpen && (
        <div
          id="dropdown"
          className="absolute right-5 mt-9 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
            <li className="flex justify-between items-center px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                toggleDropdown()
                setChatSiderCollapse(false)
              }}
            >
              <span>
                History
              </span>
              <MdOutlineHistory
                color={"#667085"}
                size={20}
              />
            </li>
            <hr className="h-px w-[80%] mx-auto bg-gray-300  border-0"></hr>
            <li className="flex justify-between items-center  px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                toggleDropdown()
                setPromptSiderCollapse(false)
              }}
            >
              <span>
                Prompts
              </span>
              <VscSettings
                className='rotate-90'
                color={"#667085"}
                size={18}
              />
            </li>
            <hr className="h-px w-[80%] mx-auto bg-gray-300  border-0"></hr>
            <li className="flex justify-between items-center  px-4 py-2 hover:bg-gray-100 "
              onClick={() => {
                toggleDropdown()
                handleNewChatClick()
              }}
            >
              <span>
                New Chat
              </span>
              <AiOutlinePlus
                className='rotate-90'
                color={"#667085"}
                size={18}
              />
            </li>
            <hr className="h-px w-[80%] mx-auto bg-gray-300  border-0"></hr>
            <li className="flex justify-between items-center  px-4 py-2 hover:bg-gray-100 "
              onClick={() => {
                toggleDropdown()
                setShowPromptCreateModal(true)
              }}
            >
              <span>
                New Prompt
              </span>
              <AiOutlinePlus
                className='rotate-90'
                color={"#667085"}
                size={18}
              />
            </li>
          </ul>
        </div>
      )}
      {
        isOpen && <div className="fixed top-24 h-full inset-0 z-40 backdrop-filter backdrop-blur-md"></div>
      }
      <Modal
        centered
        closable={false}
        visible={showPromptCreateModal}
        okButtonProps={{ style: { backgroundColor: "#000" } }}
        onOk={(e) => handleCreateFormSubmit(promptValues)}
        okText="Save"
        onCancel={() => {
          setShowerror(false);
          setShowPromptCreateModal(false);
          setPromptValues({ title: "", description: "", content: "" });
        }}
      >
        <ModalContent
          handleValueChange={handleValueChange}
          promptValues={promptValues}
          showerror={showerror}
        />
      </Modal>
    </div>
  );
};

export default Dropdown;
