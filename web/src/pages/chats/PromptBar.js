// functionality
// create a sidebar for the prompt page  --- DONE
// inside the sidebar, create a button that will allow the user to create a new prompt --- DONE
// after clicking the button, modal will pop up and ask the user to enter a prompt name, description, and main text --- DONE
// user can name use {{}} to create a variable that user can fill in later when they are creating a story --- DONE
// later when prompt seleted by user will be asked to fill the empty variables
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { errorToast, successToast } from "../../util/toasts";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  createPrompt,
  deletePrompt,
  getAllPrompts,
  updatePrompt,
} from "../../redux/actions/promptsActions";
import { HiPlus } from "react-icons/hi";
import { ToastContainer } from "react-toastify";
import { BiBulb } from "react-icons/bi";
import {
  createPromptTemplate,
  deletePromptTemplate,
  getAllPromptTemplates,
  updatePromptTemplate,
} from "../../actions/prompts";

function PromptBar({ open }) {
  const styles = {
    fileIconSize: "24px",
    iconSize: "20px",
  };
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatePromptIndex, setUpdatePromptIndex] = useState(null);
  const [showerror, setShowerror] = useState({
    title: false,
    description: false,
    prompt: false,
  });

  const [pagination, setPagination] = useState({
    limit: 12,
    page: 1,
    search_query: "",
  });

  const [promptValues, setPromptValues] = useState({
    title: "",
    description: "",
    prompt: "",
  });
  const [deletePromptIndex, setDeletePromptIndex] = useState(null);
  const dispatch = useDispatch();
  function handleValueChange(event) {
    const { name, value } = event.target;
    setPromptValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  function handleFormSubmit(values) {
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
        getAllPromptTemplates(pagination)
          .then((data) => {
            dispatch(getAllPrompts(data?.prompt_templates));
            setPromptCount(data?.count);
          })
          .catch((error) => {
            errorToast(error.message);
          });
        setShowModal(false);
        setPromptValues({ title: "", description: "", content: "" });
        setShowerror(false);
      })
      .catch((error) => {
        errorToast(error.message);
      });
  }

  useEffect(() => {
    getAllPromptTemplates(pagination)
      .then((data) => {
        dispatch(getAllPrompts(data?.prompt_templates));
        setPromptCount(data?.count);
      })
      .catch((error) => {
        errorToast(error.message);
      });
  }, [pagination]);

  function handleDeletePrompt(index) {
    deletePromptTemplate(index)
      .then(() => {
        dispatch(deletePrompt(deletePromptIndex));
        setDeletePromptIndex(null);
        successToast("Prompt template deleted successfully");
      })
      .catch((error) => {
        errorToast(error.message);
      });
  }

  const prompts = useSelector((state) => state.prompts);

  const [promptCount, setPromptCount] = useState(0);

  const handleUpdateFormSubmit = (values) => {
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

    updatePromptTemplate({ ...values, id: updatePromptIndex }).then(() => {
      setShowUpdateModal(false);
      setUpdatePromptIndex(null);
      setPromptValues({ title: "", description: "", content: "" });
      setShowerror(false);
      getAllPromptTemplates(pagination)
        .then((data) => {
          dispatch(getAllPrompts(data?.prompt_templates));
          setPromptCount(data?.count);
        })
        .catch((error) => {
          errorToast(error.message);
        });
    });
  };

  const renderPrompt = (prompt, index) => (
    <li
      key={index}
      className="mr-4 p-2 text-lg hover:bg-hover-on-white cursor-pointer rounded-md grid grid-cols-[9fr_1fr] items-center mb-2 justify-between"
      onClick={() => {
        setUpdatePromptIndex(prompt.id);
        setPromptValues(prompt);
        setShowUpdateModal(true);
      }}
    >
      <div className="flex justify-start gap-4 items-center">
        <BiBulb size={styles.iconSize} />
        <h3 className="text-lg">{prompt.title}</h3>
      </div>
      <div className="flex justify-end gap-2 items-center">
        {deletePromptIndex === prompt.id ? (
          <>
            <AiOutlineCheck
              size={styles.iconSize}
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePrompt(prompt.id);
              }}
            />
            <AiOutlineClose
              size={styles.iconSize}
              onClick={(e) => {
                e.stopPropagation();
                setDeletePromptIndex(null);
              }}
            />
          </>
        ) : (
          <AiOutlineDelete
            size={styles.iconSize}
            onClick={(e) => {
              e.stopPropagation();
              setDeletePromptIndex(prompt.id);
            }}
          />
        )}
      </div>
    </li>
  );

  const handlePromptSearch = (e) => {
    setPagination((prevValues) => ({
      ...prevValues,
      search_query: e.target.value,
    }));
  };

  return (
    <>
      <div
        className={`my-4 w-full text-center justify-between gap-2 ${
          !open ? "d-none" : "flex pr-4"
        } `}
      >
        <button
          className={`p-2 w-full hover:bg-light-gray border rounded-md flex items-center cursor-pointer gap-3  ${
            !open ? "d-none" : "flex"
          } `}
          onClick={() => {
            setShowModal(true);
            setPromptValues({
              title: "",
              description: "",
              prompt: "",
            });
          }}
        >
          <HiPlus size={styles.iconSize} />
          <span className="text-lg">New Prompt</span>
        </button>
        {/* <button className="p-2 border hover:bg-light-gray rounded-md cursor-pointer flex justify-center items-center">
          <MdOutlineCreateNewFolder size={styles.fileIconSize} />
          {/* added the toast container here because had already developed layout without taking toast in consideration, toast container will be hidden */}

        {/* </button> */}
        <ToastContainer />
      </div>

      {/* create modal */}
      <Modal
        centered
        closable={false}
        visible={showModal}
        okButtonProps={{ style: { backgroundColor: "#000" } }}
        onOk={(e) => handleFormSubmit(promptValues)}
        okText="Save"
        onCancel={() => {
          setShowerror(false);
          setShowModal(false);
          setPromptValues({ title: "", description: "", content: "" });
        }}
      >
        <ModalContent
          handleValueChange={handleValueChange}
          promptValues={promptValues}
          showerror={showerror}
        />
      </Modal>
      {/* update modal */}
      <Modal
        centered
        closable={false}
        visible={showUpdateModal}
        okButtonProps={{ style: { backgroundColor: "#000" } }}
        onOk={(e) => handleUpdateFormSubmit(promptValues)}
        okText="Save"
        onCancel={() => {
          setShowUpdateModal(false);
          setShowerror(false);
          setUpdatePromptIndex(null);
          setPromptValues({ title: "", description: "", content: "" });
        }}
      >
        <ModalContent
          handleValueChange={handleValueChange}
          promptValues={promptValues}
          showerror={showerror}
        />
      </Modal>

      <div className={`${!open || "pr-4"}`}>
        <input
          className={`w-full p-3 border border-gray-300 rounded-md  ${
            !open ? "d-none" : "flex"
          } `}
          placeholder="Search prompt"
          onChange={handlePromptSearch}
        />
        <hr className="h-px bg-gray-300 mt-3 border-0"></hr>
      </div>
      <ul
        className={`overflow-y-auto  ${!open && "d-none"}  mt-3`}
        style={{ maxHeight: "70vh" }}
      >
        {prompts?.map((prompt, index) => renderPrompt(prompt, index))}
        <div
          className={`flex ${
            pagination.page === 1 ? "flex-row-reverse" : "flex-row"
          } ${
            pagination.offset !== 0 &&
            promptCount > pagination.limit &&
            "justify-between"
          } p-2 text-base cursor-pointer mt-4`}
        >
          {pagination.page > 1 && (
            <span
              onClick={() => {
                setPagination((prevPage) => {
                  return { ...prevPage, page: prevPage.page - 1 };
                });
              }}
            >
              Previous
            </span>
          )}
          {promptCount > pagination.limit && (
            <span
              onClick={() =>
                setPagination((prevPage) => {
                  return { ...prevPage, page: prevPage.page + 1 };
                })
              }
            >
              Next
            </span>
          )}
        </div>
      </ul>
    </>
  );
}

export default PromptBar;

const ModalContent = ({ handleValueChange, promptValues, showerror }) => {
  return (
    <form className="flex flex-col w-full gap-4">
      <div className="flex flex-col w-ful gap-2">
        <label className="font-medium text-gray-700 text-base">Title</label>
        <input
          placeholder="Name of the prompt"
          className="p-2 border border-[#CED0D4] rounded-md bg-transparent"
          type="input"
          name="title"
          value={promptValues.title}
          onChange={handleValueChange}
        />
        <p
          className={`mt-1 ${
            showerror.title ? "block" : "d-none"
          } text-pink-600 text-sm`}
        >
          Please provide a title for prompt.
        </p>
      </div>
      <div className="flex flex-col w-ful gap-2">
        <label className="font-medium text-gray-700 text-base">
          Description
        </label>
        <textarea
          name={"description"}
          placeholder="A short description of the prompt"
          className="p-2 border border-[#CED0D4] rounded-md bg-transparent resize-none"
          value={promptValues.description}
          rows={4}
          onChange={handleValueChange}
        />
        <p
          className={`mt-1 ${
            showerror.description ? "block" : "d-none"
          } text-pink-600 text-sm`}
        >
          Please provide a description for prompt.
        </p>
      </div>
      <div className="flex flex-col w-ful gap-2">
        <label className="font-medium text-gray-700 text-base">Prompt</label>
        <textarea
          placeholder="Prompt content. Use {{}} to denote a variable. Ex: {{name}} is a {{adjective}} {{noun}}"
          name={"prompt"}
          className="p-2 border border-[#CED0D4] rounded-md bg-transparent resize-none"
          value={promptValues.prompt}
          rows={10}
          onChange={handleValueChange}
        />
        <p
          className={`mt-1 ${
            showerror.prompt ? "block" : "d-none"
          } text-pink-600 text-sm`}
        >
          Please provide a template for prompt.
        </p>
      </div>
    </form>
  );
};
