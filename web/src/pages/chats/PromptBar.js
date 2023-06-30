// functionality
// create a sidebar for the prompt page  --- DONE
// inside the sidebar, create a button that will allow the user to create a new prompt --- DONE
// after clicking the button, modal will pop up and ask the user to enter a prompt name, description, and main text --- DONE
// user can name use {{}} to create a variable that user can fill in later when they are creating a story --- DONE
// later when prompt seleted by user will be asked to fill the empty variables
import React, { useEffect, useState, useRef } from "react";
import Modal from "./Modal";
import { errorToast, successToast } from "../../util/toasts";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import {
  createPrompt,
  deletePrompt,
  getAllPrompts,
  updatePrompt,
} from "../../redux/actions/promptsActions";
import {
  createPromptCollection,
  deletePromptCollection,
  getAllPromptCollections,
  addPromptToCollection,
  removePromptFromCollection,
} from "../../redux/actions/promptCollections";

import { BsCaretRightFill, BsCaretDownFill } from "react-icons/bs";
import ModalContent from "./createPrompt/modalContent";

import { HiPlus } from "react-icons/hi";
import { ToastContainer } from "react-toastify";
import { BiBulb } from "react-icons/bi";
import {
  createPromptTemplate,
  deletePromptTemplate,
  getAllPromptTemplates,
  updatePromptTemplate,
} from "../../actions/prompts";
import useWindowSize from "../../hooks/useWindowSize";

function PromptBar({ open, isFolderVisible, setPromptSiderCollapse }) {
  const styles = {
    fileIconSize: "24px",
    iconSize: "20px",
  };
  const { isMobileScreen } = useWindowSize();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatePromptIndex, setUpdatePromptIndex] = useState(null);
  // for drag and drop
  const [draggingPromptId, setDraggingPromptId] = useState(null);
  const [dragOverCollectionId, setDragOverCollectionId] = useState(null);

  const [removePromptFromCollectionID, setRemovePromptFromCollectionID] =
    useState(null);
  const [
    promptcollectionCreateFormVisible,
    setPromptCollectionCreateFormVisible,
  ] = useState(false);
  const [promptcollectionName, setPromptCollectionName] = useState("");
  const [currentPromptCollectionIndex, setCurrentPromptCollectionIndex] =
    useState(null);
  const [deletePromptCollectionIndex, setDeletePromptCollectionIndex] =
    useState(null);

  const handlePromptCollectionCreate = () => {
    if (promptcollectionName === "") return;
    dispatch(createPromptCollection({ name: promptcollectionName }));
    setPromptCollectionName("");
    setPromptCollectionCreateFormVisible(false);
  };

  const promptcreateCollectionRef = useRef(null);
  useEffect(() => {
    if (promptcollectionCreateFormVisible) {
      promptcreateCollectionRef.current.focus();
    }
  }, [promptcollectionCreateFormVisible]);

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
  const promptCollections = useSelector((state) => state.promptCollections);

  useEffect(() => {
    if (isFolderVisible) {
      dispatch(getAllPromptCollections());
    }
  }, []);

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

  const handleChatDragStart = (promptID) => {
    setDraggingPromptId(promptID);
  };

  const handleDrop = () => {
    if (dragOverCollectionId === null) return;
    if (draggingPromptId === null) return;

    const collection = promptCollections.find(
      (collection) => collection.id === dragOverCollectionId
    );
    const prompt = collection?.prompt_templates?.find(
      (prompt) => prompt.id === draggingPromptId
    );
    // console.log("dragOverCollectionId", collection);
    // console.log("draggingPromptId", draggingPromptId);

    if (!prompt) {
      dispatch(
        addPromptToCollection(dragOverCollectionId, draggingPromptId, prompts)
      );
    }

    setDraggingPromptId(null);
    setDragOverCollectionId(null);
  };

  const handleDragEnter = (collectionID) => {
    setDragOverCollectionId(collectionID);
    setCurrentPromptCollectionIndex(collectionID);
  };

  const handleChatRemoveFromCollection = (prompt_id) => {
    if (prompt_id === null) return;
    dispatch(removePromptFromCollection(prompt_id, prompts));
  };
  const renderPrompt = (prompt, index, isInFolder) => (
    <li
      key={index}
      draggable={!isInFolder}
      onDragStart={(e) => {
        if (!isInFolder) {
          handleChatDragStart(prompt.id);
        }
      }}
      onDragEnd={() => {
        if (!isInFolder) {
          handleDrop();
        }
      }}
      className={`mr-4 p-2 text-lg hover:bg-hover-on-white cursor-pointer rounded-md grid grid-cols-[9fr_1fr] items-center mb-2 ${
        isMobileScreen && "border-b border-gray-300"
      }`}
      onClick={() => {
        setUpdatePromptIndex(prompt.id);
        setPromptValues(prompt);
        setShowUpdateModal(true);
      }}
    >
      <div className="flex justify-start gap-4 items-center">
        <div
          className={`flex ${
            isMobileScreen ? "flex-col" : "flex-row items-center gap-2"
          }`}
        >
          {!isMobileScreen && <BiBulb size={styles.iconSize} />}
          <h3 className="font-semibold md:font-normal">{prompt.title}</h3>
          {isMobileScreen && (
            <span className="text-gray-500">
              {prompt.description.length < maxListChars
                ? prompt.description
                : `${prompt.description.slice(0, maxListChars) + "..."}
          `}
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2 items-center">
        {!isInFolder ? (
          deletePromptIndex === prompt.id ? (
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
          )
        ) : removePromptFromCollectionID === prompt.id ? (
          <>
            <AiOutlineCheck
              size={styles.iconSize}
              onClick={(e) => {
                e.stopPropagation();
                handleChatRemoveFromCollection(removePromptFromCollectionID);
              }}
            />
            <AiOutlineClose
              size={styles.iconSize}
              onClick={(e) => {
                e.stopPropagation();
                setRemovePromptFromCollectionID(null);
              }}
            />
          </>
        ) : (
          <AiOutlineDelete
            size={styles.iconSize}
            onClick={(e) => {
              e.stopPropagation();
              setRemovePromptFromCollectionID(prompt.id);
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

  const maxListChars = isMobileScreen ? 40 : 15;

  return (
    <>
      {isMobileScreen ? (
        <div className="flex flex-wrap justify-between items-center pr-6 mt-8 mb-4">
          <hr className="h-px bg-gray-300 mb-3 border-0 w-full"></hr>
          <h2 className="text-xl font-semibold">Prompts</h2>
          <RxCross1 size={24} onClick={() => setPromptSiderCollapse(true)} />
        </div>
      ) : (
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
          {isFolderVisible ? (
            <button
              className="p-2 border hover:bg-light-gray rounded-md cursor-pointer flex justify-center items-center"
              onClick={() => {
                setPromptCollectionCreateFormVisible(true);
              }}
            >
              <MdOutlineCreateNewFolder size={styles.fileIconSize} />
              {/* added the toast container here because had already developed layout without taking toast in consideration, toast container will be hidden */}
              <ToastContainer
         toastClassName={ ({ type }) =>
          type === "error"
            ? "w-[340px] border-l-[12px] border-[#DA3125] rounded-md shadow-lg bg-[#FFF]"
            : type === "success"
            ? "w-[340px] border-l-[12px] border-[#03C04A] rounded-md shadow-lg bg-[#FFF]"
            : type === "warning"
            ? "w-[340px] border-l-[12px] border-[#EA8700] rounded-md shadow-lg bg-[#FFF]"
            : ""
        }
        className="space-y-4  "
      />
            </button>
          ) : (
            <div>
            <ToastContainer
         toastClassName={ ({ type }) =>
          type === "error"
            ? "w-[340px] border-l-[12px] border-[#DA3125] rounded-md shadow-lg bg-[#FFF]"
            : type === "success"
            ? "w-[340px] border-l-4 border-[#03C04A] rounded-md shadow-lg bg-[#FFF]"
            : type === "warning"
            ? "w-[340px] border-l-4 border-[#EA8700] rounded-md shadow-lg bg-[#FFF]"
            : ""
        }
        className="space-y-4  "
      />
            </div>
          )}
        </div>
      )}

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
        {promptcollectionCreateFormVisible && (
          <li
            className={`mr-4 p-3 bg-hover-on-white cursor-pointer rounded-md flex items-center justify-between mb-2`}
          >
            <div className="flex items-center gap-3">
              <BsCaretRightFill size={16} />
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePromptCollectionCreate();
                  }
                }}
                ref={promptcreateCollectionRef}
                value={promptcollectionName}
                onChange={(e) => setPromptCollectionName(e.target.value)}
                className="bg-transparent outline-none border-none w-3/4 max-w-[200px]"
                placeholder="Collection Name"
              />
              <div className="flex gap-2">
                <AiOutlineCheck
                  size={styles.iconSize}
                  onClick={() => handlePromptCollectionCreate()}
                />
                <AiOutlineClose
                  size={styles.iconSize}
                  onClick={() => {
                    setPromptCollectionName("");
                    setPromptCollectionCreateFormVisible(false);
                  }}
                />
              </div>
            </div>
          </li>
        )}
        <div
          className={`flex ${
            isMobileScreen
              ? "flex-row bg-white border border-gray-300 py-3 px-4"
              : "flex-col"
          } flex-wrap mr-4 justify-between`}
        >
          {/* collections */}
          {promptCollections !== null &&
            promptCollections.length > 0 &&
            promptCollections?.map((item, index) => {
              return (
                <>
                  {/* // {handleDragEnter,  dragOverCollectionId } */}
                  <li
                    key={index}
                    onDragEnter={() => {
                      // e.preventDefault();
                      handleDragEnter(item.id);
                    }}
                    className={`text-lg hover:bg-hover-on-white cursor-pointer rounded-md items-center mb-2 ${
                      isMobileScreen
                        ? "w-[45%] p-1"
                        : "flex w-full p-2 justify-between"
                    }`}
                    onClick={() => {
                      if (currentPromptCollectionIndex === item.id) {
                        setCurrentPromptCollectionIndex(null);
                      } else {
                        setCurrentPromptCollectionIndex(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {currentPromptCollectionIndex === item.id ? (
                        <BsCaretDownFill size={16} />
                      ) : (
                        <BsCaretRightFill size={16} />
                      )}
                      <span>
                        {item?.name < maxListChars
                          ? item?.name
                          : `${item?.name?.slice(0, maxListChars) + "..."}
                        `}
                      </span>
                    </div>
                    {!isMobileScreen && (
                      <div className="flex gap-2 justify-end">
                        {
                          // if the deleteIndex is equal to the index of the chat then show the checked and close buttons
                          // else show the delete button
                          deletePromptCollectionIndex === item.id ? (
                            <>
                              <AiOutlineCheck
                                size={styles.iconSize}
                                onClick={(E) => {
                                  E.stopPropagation();
                                  dispatch(deletePromptCollection(item.id));
                                }}
                              />
                              <AiOutlineClose
                                size={styles.iconSize}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletePromptCollectionIndex(null);
                                }}
                              />
                            </>
                          ) : (
                            <AiOutlineDelete
                              size={styles.iconSize}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletePromptCollectionIndex(item.id);
                              }}
                            />
                          )
                        }
                      </div>
                    )}
                  </li>
                  {/* <ul className="ml-3 border-l-2 border-gray-300 pl-2">
                    {currentPromptCollectionIndex === item.id &&
                      item?.prompt_templates?.length > 0 &&
                      item?.prompt_templates?.map((prompt, index) => { return renderPrompt(prompt, index, true) })}
                  </ul> */}
                  <ul
                    className={`
                      sm-fixed sm-left-0 sm-top-0 md:static bg-white ${
                        currentPromptCollectionIndex === item.id &&
                        item?.prompt_templates?.length > 0
                          ? `${
                              isMobileScreen
                                ? "w-[100vw] h-screen p-4 gap-4"
                                : "border-l-2 ml-4 border-gray-300 pl-2 w-full"
                            }`
                          : "translate-x-0 w-0"
                      } flex flex-col ease-in-out duration-300
                      `}
                    style={{
                      zIndex: isMobileScreen && 100,
                    }}
                  >
                    {isMobileScreen &&
                      currentPromptCollectionIndex === item.id &&
                      item?.prompt_templates?.length > 0 && (
                        <div className="flex flex-wrap justify-between items-center my-8">
                          <hr className="h-px bg-gray-300 mb-3 border-0 w-full"></hr>
                          <h2 className="text-xl font-semibold pl-2">
                            {item?.name}
                          </h2>
                          <RxCross1
                            size={24}
                            onClick={() =>
                              setCurrentPromptCollectionIndex(null)
                            }
                          />
                        </div>
                      )}
                    {currentPromptCollectionIndex === item.id &&
                      item?.prompt_templates?.length > 0 &&
                      item?.prompt_templates?.map((prompt, index) => {
                        return renderPrompt(prompt, index, true);
                      })}
                  </ul>
                </>
              );
            })}
        </div>
        <hr className="h-px bg-gray-300 mt-3 border-0 mr-4 mb-3"></hr>
        {prompts?.map((prompt, index) => renderPrompt(prompt, index, false))}
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
