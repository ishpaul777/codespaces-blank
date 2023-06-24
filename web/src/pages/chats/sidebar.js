import { HiPlus } from "react-icons/hi";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { BiMessageDetail } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import {
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { BsCaretDownFill, BsCaretRightFill, BsFolder } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  addChatToCollection,
  createCollection,
  deleteCollection,
  getAllChatCollections,
  removeChatFromCollections,
} from "../../redux/actions/chatcollections";
import { useDispatch } from "react-redux";

export default function SideBar({
  isMobileScreen,
  chatSiderCollapse,
  setChatSiderCollapse,
  handleNewChatClick,
  paginationChatHistory,
  setPaginationChatHistory,
  chatHistory,
  setChatHistory,
  setChat,
  setChatID,
  setChatTitle,
  setIsEditing,
  chatID,
  deleteChatHistoryIndex,
  handleChatDelete,
  setDeleteChatHistoryIndex,
  handleHistoryDeleteClick,
  chatCount,
  chatOptionsList,
  isFolderVisible = true,
}) {
  const maxListChars = isMobileScreen ? 30 : 15;
  const styles = {
    fileIconSize: "24px",
    iconSize: "20px",
  };
  const dispatch = useDispatch();

  const [collectionCreateFormVisible, setCollectionCreateFormVisible] =
    useState(false);
  const [collectionName, setCollectionName] = useState("");
  const collections = useSelector((state) => state.collections);

  const createCollectionRef = useRef(null);
  const [deleteCollectionIndex, setDeleteCollectionIndex] = useState(null);
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(null);

  // for drag and drop
  const [draggingChatId, setDraggingChatId] = useState(null);
  const [dragOverCollectionId, setDragOverCollectionId] = useState(null);

  const [removeChatFromCollection, setRemoveChatFromCollection] = useState({
    chat_id: null,
    collection_id: null,
  });

  const handleChatDragStart = (chatId) => {
    setDraggingChatId(chatId);
  };

  const handleDragEnter = (collectionID) => {
    // e.preventDefault();
    setDragOverCollectionId(collectionID);
    setCurrentCollectionIndex(collectionID);
  };

  const handleDrop = () => {
    if (draggingChatId && dragOverCollectionId) {
      // if the chat is not already in the collection add it
      const collection = collections.find(
        (collection) => collection.id === dragOverCollectionId
      );

      const chat = collection.chats.find((chat) => chat.id === draggingChatId);
      if (!chat) {
        dispatch(
          addChatToCollection(dragOverCollectionId, draggingChatId, chatHistory)
        );
      }
    }

    //   setCollections(newCollections);
    //   // remove chat from chatHistory array
    //   const newChatHistory = chatHistory.filter(
    //     (chat) => chat.id !== draggingChatId
    //   );
    //   setChatHistory(newChatHistory);
    // } else if (draggingChatId && !dragOverCollectionId) {
    //   // if the chat is dragged outside of the collection
    //   // add chat to chatHistory array if it is not already there
    //   let chat = chatHistory.find((chat) => chat.id === draggingChatId);
    //   if (!chat) {
    //     let collection = collections.find((collection) =>
    //       collection.map((chat) => chat.id === draggingChatId)
    //     );
    //     chat = collection.chats.find((chat) => chat.id === draggingChatId);
    //     setChatHistory([...chatHistory, chat]);
    //   }
    // }

    setDraggingChatId(null);
    setDragOverCollectionId(null);
  };
  // console.log(draggingChatId, dragOverCollectionId);

  useEffect(() => {
    if (collectionCreateFormVisible) {
      createCollectionRef.current.focus();
    }
  }, [collectionCreateFormVisible]);

  useEffect(() => {
    if (isFolderVisible) {
      // fetchCollections({ limit: 10, page: 1, search_query: "" }).then((data) => {
      //   setCollections(data.collections);
      // });
      dispatch(getAllChatCollections());
    }
  }, []);

  const handleCollectionCreate = () => {
    if (collectionName) {
      dispatch(createCollection({ name: collectionName }));
      setCollectionName("");
      setCollectionCreateFormVisible(false);
    }
  };

  const handleCollectionDelete = (collectionID) => {
    dispatch(deleteCollection(collectionID));
  };

  const renderChats = (chats, isInFolder) => {
    return chats.map((chat, index) => {
      return (
        <li
          draggable={isInFolder ? false : true}
          key={index}
          onDragStart={(e) => {
            if (!isInFolder) {
              handleChatDragStart(chat.id);
            }
          }}
          onDragEnd={() => {
            if (!isInFolder) {
              handleDrop();
            }
          }}
          className={`p-2 text-lg hover:bg-hover-on-white cursor-pointer rounded-md grid grid-cols-[9fr_1fr] items-center mb-2
          ${chatID === chat?.id && "bg-hover-on-white"} ${
            isMobileScreen && "border-b border-gray-300"
          }`}
        >
          <div
            className="flex items-center gap-3"
            onClick={() => {
              setChat(chat?.messages);
              setChatID(chat?.id);
              setChatTitle(chat?.title);
              setIsEditing({ status: false, id: null });
              if (isMobileScreen) setChatSiderCollapse(true);
            }}
          >
            {!isMobileScreen && <BiMessageDetail size={styles.iconSize} />}
            <div className="flex flex-col">
              <span className="md:font-normal font-semibold">
                {chat?.title < maxListChars
                  ? chat?.title
                  : `${chat?.title?.slice(0, maxListChars) + "..."}
                `}
              </span>
              {isMobileScreen && (
                <span className="text-gray-500">
                  {chat?.messages[2].content.length < maxListChars
                    ? chat?.messages[2].content
                    : `${
                        chat?.messages[2].content.slice(0, maxListChars) + "..."
                      }
                  `}
                </span>
              )}
            </div>
          </div>
          <div className={`flex gap-2`}>
            {
              // if the deleteIndex is equal to the index of the chat then show the checked and close buttons
              // else show the delete button
              !isInFolder ? (
                deleteChatHistoryIndex === chat.id ? (
                  <>
                    <AiOutlineCheck
                      size={styles.iconSize}
                      onClick={() => handleChatDelete(chat.id)}
                    />
                    <AiOutlineClose
                      size={styles.iconSize}
                      onClick={() => setDeleteChatHistoryIndex(null)}
                    />
                  </>
                ) : (
                  <AiOutlineDelete
                    size={styles.iconSize}
                    onClick={() => handleHistoryDeleteClick(chat.id)}
                  />
                )
              ) : removeChatFromCollection.chat_id === chat.id ? (
                <>
                  <AiOutlineCheck
                    size={styles.iconSize}
                    onClick={() =>
                      dispatch(removeChatFromCollections(chat.id, chatHistory))
                    }
                  />
                  <AiOutlineClose
                    size={styles.iconSize}
                    onClick={() =>
                      setRemoveChatFromCollection({
                        chat_id: null,
                        collection_id: null,
                      })
                    }
                  />
                </>
              ) : (
                <AiOutlineDelete
                  size={styles.iconSize}
                  onClick={() =>
                    setRemoveChatFromCollection({
                      chat_id: chat.id,
                      collection_id: currentCollectionIndex,
                    })
                  }
                />
              )
            }
          </div>
        </li>
      );
    });
  };

  return (
    <aside
      className={`z-50 sm-fixed sm-left-0 sm-top-0 md:static h-screen sidebar ${
        chatSiderCollapse
          ? "translate-x-0 w-0"
          : `${isMobileScreen ? "w-full " : "w-[350px] "}`
      } flex flex-row  ease-in-out duration-300 gap-4`}
    >
      <div
        className={`bg-white relative w-full shadow-md ${
          chatSiderCollapse || "pt-4 pl-4"
        }`}
      >
        {isMobileScreen && !chatSiderCollapse && (
          <div className="flex flex-wrap justify-between items-center pr-6 mt-8">
            <hr className="h-px bg-gray-300 mb-3 border-0 w-full"></hr>
            <h2 className="text-xl font-semibold">History</h2>
            <RxCross1 size={24} onClick={() => setChatSiderCollapse(true)} />
          </div>
        )}
        <div
          className={`${
            isMobileScreen ? "my-2" : "my-4"
          } w-full text-center justify-between gap-2 ${
            chatSiderCollapse ? "d-none" : "flex pr-4"
          } `}
        >
          {!isMobileScreen && (
            <>
              <button
                className={`p-2 w-full hover:bg-light-gray border rounded-md flex items-center cursor-pointer gap-3  ${
                  chatSiderCollapse ? "d-none" : "flex"
                } `}
                onClick={() => handleNewChatClick()}
              >
                <HiPlus size={styles.iconSize} />
                <span className="text-lg">New Chat</span>
              </button>
              {isFolderVisible ? (
                <button
                  className="p-2 border hover:bg-light-gray rounded-md cursor-pointer flex justify-center items-center"
                  onClick={() => {
                    setCollectionCreateFormVisible(true);
                  }}
                >
                  <MdOutlineCreateNewFolder size={styles.fileIconSize} />
                  {/* added the toast container here because had already developed layout without taking toast in consideration, toast container will be hidden */}
                </button>
              ) : (
                <div>
                  <ToastContainer />
                </div>
              )}
            </>
          )}
        </div>
        <div className={`${chatSiderCollapse || "pr-4"}`}>
          <input
            className={`w-full p-3 border border-gray-300 rounded-md  ${
              chatSiderCollapse ? "d-none" : "flex"
            } `}
            placeholder="Search prompt"
            onChange={(e) =>
              setPaginationChatHistory({
                ...paginationChatHistory,
                search_query: e.target.value,
              })
            }
          />
          <hr className="h-px bg-gray-300 mt-3 border-0"></hr>
        </div>
        <ul
          className={`overflow-y-auto overflow-x-hidden  ${
            chatSiderCollapse && "d-none"
          }  mt-3`}
          style={{ maxHeight: "65vh" }}
        >
          {collectionCreateFormVisible && (
            <li
              className={`mr-4 p-3 bg-hover-on-white cursor-pointer rounded-md flex items-center justify-between mb-2`}
            >
              <div className="flex items-center gap-3">
                <BsCaretRightFill size={16} />
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCollectionCreate();
                    }
                  }}
                  ref={createCollectionRef}
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="bg-transparent outline-none border-none w-3/4 max-w-[200px]"
                  placeholder="Collection Name"
                />
                <div className="flex gap-2">
                  <AiOutlineCheck
                    size={styles.iconSize}
                    onClick={() => handleCollectionCreate()}
                  />
                  <AiOutlineClose
                    size={styles.iconSize}
                    onClick={() => {
                      setCollectionName("");
                      setCollectionCreateFormVisible(false);
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
            {collections !== null &&
              collections.length > 0 &&
              collections?.map((item, index) => {
                return (
                  <>
                    <li
                      key={index}
                      onDragEnter={() => {
                        // e.preventDefault();
                        handleDragEnter(item.id);
                      }}
                      className={`text-lg hover:bg-hover-on-white cursor-pointer rounded-md  items-center mb-2 ${
                        isMobileScreen
                          ? "w-[45%] p-1"
                          : "flex p-2  justify-between"
                      }
                    ${dragOverCollectionId === item.id && "bg-hover-on-white"}
                    `}
                      onClick={() => {
                        if (
                          !isMobileScreen &&
                          currentCollectionIndex === item.id
                        ) {
                          setCurrentCollectionIndex(null);
                        } else {
                          setCurrentCollectionIndex(item.id);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 w-[1000%]">
                        {isMobileScreen ? (
                          <BsFolder size={16} />
                        ) : currentCollectionIndex === item.id ? (
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
                      {
                        // if the deleteIndex is equal to the index of the chat then show the checked and close buttons
                        // else show the delete button
                        !isMobileScreen ? (
                          <div className="flex gap-2">
                            {deleteCollectionIndex === item.id ? (
                              <>
                                <AiOutlineCheck
                                  size={styles.iconSize}
                                  // todo: handle chat delete
                                  onClick={(E) => {
                                    E.stopPropagation();
                                    handleCollectionDelete(item.id);
                                  }}
                                />
                                <AiOutlineClose
                                  size={styles.iconSize}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteCollectionIndex(null);
                                  }}
                                />
                              </>
                            ) : (
                              <AiOutlineDelete
                                size={styles.iconSize}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteCollectionIndex(item.id);
                                }}
                              />
                            )}
                          </div>
                        ) : null
                      }
                    </li>
                    <ul
                      className={`
                      sm-fixed sm-left-0 sm-top-0 md:static bg-white ${
                        currentCollectionIndex === item.id &&
                        item?.chats?.length > 0
                          ? `${
                              isMobileScreen
                                ? "w-[100vw] h-screen p-4 gap-4"
                                : "border-l-2 ml-4 border-gray-300 pl-2 w-full"
                            }`
                          : "translate-x-0 w-0"
                      } flex flex-col ease-in-out duration-300
                      `}
                      style={{
                        zIndex: 100,
                      }}
                    >
                      {isMobileScreen &&
                        currentCollectionIndex === item.id &&
                        item?.chats?.length > 0 && (
                          <div className="flex flex-wrap justify-between items-center my-8">
                            <hr className="h-px bg-gray-300 mb-3 border-0 w-full"></hr>
                            <h2 className="text-xl font-semibold pl-2">
                              {item?.name}
                            </h2>
                            <RxCross1
                              size={24}
                              onClick={() => setCurrentCollectionIndex(null)}
                            />
                          </div>
                        )}
                      {currentCollectionIndex === item.id &&
                        item?.chats?.length > 0 &&
                        renderChats(item?.chats, true)}
                    </ul>
                  </>
                );
              })}
          </div>
          <hr className="h-px bg-gray-300 mt-3 border-0 mr-4 mb-3"></hr>
          <ul
            className="mr-4"
            onDragEnter={() => {
              handleDragEnter(null);
            }}
          >
            {renderChats(chatHistory, false)}
          </ul>
          <div
            className={`flex ${
              paginationChatHistory.page === 1 ? "flex-row-reverse" : "flex-row"
            } ${
              paginationChatHistory.offset !== 0 &&
              chatCount > paginationChatHistory.limit &&
              "justify-between"
            } p-2 text-base cursor-pointer mt-4`}
          >
            {paginationChatHistory.page > 1 && (
              <span
                onClick={() => {
                  setPaginationChatHistory((prevPage) => {
                    return { ...prevPage, page: prevPage.page - 1 };
                  });
                }}
              >
                Previous
              </span>
            )}
            {chatCount > paginationChatHistory.limit && (
              <span
                onClick={() =>
                  setPaginationChatHistory((prevPage) => {
                    return { ...prevPage, page: prevPage.page + 1 };
                  })
                }
              >
                Next
              </span>
            )}
          </div>
        </ul>
        {!isMobileScreen && (
          <div
            className={`w-full px-2 flex absolute bottom-4 left-0 z-40 flex-col gap-2 ${
              chatSiderCollapse ? "d-none" : "flex"
            } `}
          >
            <ul className="flex justify-center flex-col">
              {chatOptionsList.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-6 px-4 py-2 cursor-pointer rounded-md hover:bg-button-primary"
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span className="text-base">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
