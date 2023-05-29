import { HiPlus } from "react-icons/hi";
import { MdFolder, MdFolderOpen, MdOutlineCreateNewFolder } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { BiMessageDetail } from "react-icons/bi";
import {
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { BsCaretDownFill, BsCaretRightFill } from "react-icons/bs";
import { render } from "react-dom";

export default function SideBar({
  isMobileScreen,
  chatSiderCollapse,
  handleNewChatClick,
  paginationChatHistory,
  setPaginationChatHistory,
  chatHistory,
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
  const maxListChars = 15;
  const styles = {
    fileIconSize: "24px",
    iconSize: "20px",
  };

  const [collectionCreateFormVisible, setCollectionCreateFormVisible] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collections, setCollections] = useState([
    { title: "Collection 1", chats: [], id: 1 }, { title: "Collection 2", chats: [], id: 2 },
  ]);

  const createCollectionRef = useRef(null);
  const [deleteCollectionIndex, setDeleteCollectionIndex] = useState(null);
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(null);

  // for drag and drop
  const [draggingChatId, setDraggingChatId] = useState(null);
  const [dragOverCollectionId, setDragOverCollectionId] = useState(null);

  const handleDragStart = (id) => {
    setDraggingChatId(id);
  };

  const handleDragEnter = (id) => {
    // e.preventDefault();
    setDragOverCollectionId(id);
    setCurrentCollectionIndex(id);
  };
  const handdleDrop = () => {
    console.log("drop", draggingChatId, dragOverCollectionId);
    if (draggingChatId && dragOverCollectionId) {
      // TODO: add chat to collection
    }
    setDraggingChatId(null);
    setDragOverCollectionId(null);
  };
  console.log(draggingChatId, dragOverCollectionId);


  useEffect(() => {
    if (collectionCreateFormVisible) {
      createCollectionRef.current.focus();
    }
  }, [collectionCreateFormVisible]);

  const handleCollectionCreate = () => {
    if (collectionName) {
      setCollections([...collections, { title: collectionName, chats: [...chatHistory] }]);
      setCollectionName("");
      setCollectionCreateFormVisible(false);
    }
  };

  const renderChats = (chats) => {
    return chats.map((chat, index) => {
      return (
        <li
          draggable={true}
          key={index}
          onDragStart={(e) => { handleDragStart(chat.id) }}
          onDragEnd={() => { handdleDrop(); }}
          className={`mr-4 p-2 text-lg hover:bg-hover-on-white cursor-pointer rounded-md grid grid-cols-[9fr_1fr] items-center mb-2
  ${chatID === chat?.id && "bg-hover-on-white"}
`}
        >
          <div
            className="flex items-center gap-3"
            onClick={() => {
              setChat(chat?.messages);
              setChatID(chat?.id);
              setChatTitle(chat?.title);
              setIsEditing({ status: false, id: null });
            }}
          >
            <BiMessageDetail size={styles.iconSize} />
            <span>
              {chat?.title < maxListChars
                ? chat?.title
                : `${chat?.title?.slice(0, maxListChars) + "..."}
      `}
            </span>
          </div>

          <div className="flex gap-2">
            {
              // if the deleteIndex is equal to the index of the chat then show the checked and close buttons
              // else show the delete button
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
            }
          </div>
        </li>
      )
    })
  }



  return (
    <aside
      className={`z-50 sm-fixed sm-left-0 sm-top-0 md:static h-screen sidebar ${chatSiderCollapse
        ? "translate-x-0 w-0"
        : `${isMobileScreen ? "w-3/4 " : "w-[20vw] "}bg-black-100`
        } flex flex-row  ease-in-out duration-300 gap-4`}
    >
      <div
        className={`bg-white relative w-full shadow-md ${chatSiderCollapse || "pt-4 pl-4"
          }`}
      >
        <div
          className={`my-4 w-full text-center justify-between gap-2 ${chatSiderCollapse ? "d-none" : "flex pr-4"
            } `}
        >
          <button
            className={`p-2 w-full hover:bg-light-gray border rounded-md flex items-center cursor-pointer gap-3  ${chatSiderCollapse ? "d-none" : "flex"
              } `}
            onClick={() => handleNewChatClick()}
          >
            <HiPlus size={styles.iconSize} />
            <span className="text-lg">New Chat</span>
          </button>
          {isFolderVisible ? (
            <button className="p-2 border hover:bg-light-gray rounded-md cursor-pointer flex justify-center items-center" onClick={() => {
              setCollectionCreateFormVisible(true);
            }}>
              <MdOutlineCreateNewFolder size={styles.fileIconSize} />
              {/* added the toast container here because had already developed layout without taking toast in consideration, toast container will be hidden */}
              <ToastContainer />
            </button>
          ) : (
            <div>
              <ToastContainer />
            </div>
          )}
        </div>
        <div className={`${chatSiderCollapse || "pr-4"}`}>
          <input
            className={`w-full p-3 border border-gray-300 rounded-md  ${chatSiderCollapse ? "d-none" : "flex"
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
          className={`overflow-y-auto  ${chatSiderCollapse && "d-none"}  mt-3`}
          style={{ maxHeight: "67vh" }}
        >
          {
            collectionCreateFormVisible && (
              <li
                className={`mr-4 p-3 bg-hover-on-white cursor-pointer rounded-md flex items-center justify-between mb-2`
                }
              >
                <div
                  className="flex items-center gap-3"
                >
                  <BsCaretRightFill size={16} />
                  <input
                    ref={createCollectionRef}
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    className="bg-transparent outline-none border-none w-3/4 max-w-[200px]" placeholder="Collection Name" />
                  <div className="flex gap-2">

                    <AiOutlineCheck
                      size={styles.iconSize}
                      onClick={() => handleCollectionCreate()}
                    />
                    <AiOutlineClose
                      size={styles.iconSize}
                      onClick={() => setCollectionCreateFormVisible(false)}
                    />
                  </div>
                </div>
              </li>
            )
          }
          {
            collections.map((item, index) => {
              return (
                <>
                  <li
                    key={index}
                    onDragEnter={() => {
                      // e.preventDefault();
                      handleDragEnter(item.id);
                    }}
                    className={`mr-4 p-2 text-lg hover:bg-hover-on-white cursor-pointer rounded-md grid grid-cols-[9fr_1fr] items-center mb-2
                    ${dragOverCollectionId === item.id && "bg-hover-on-white"}
                    `}
                    onClick={() => {
                      if (currentCollectionIndex === item.id) {
                        setCurrentCollectionIndex(null);
                      } else {
                        setCurrentCollectionIndex(item.id)
                      }
                    }}
                  >
                    <div
                      className="flex items-center gap-3"
                    >
                      {
                        currentCollectionIndex === item.id ? (
                          <BsCaretDownFill size={16} />
                        ) : (<BsCaretRightFill size={16} />)
                      }
                      <span>
                        {item?.title < maxListChars
                          ? item?.title
                          : `${item?.title?.slice(0, maxListChars) + "..."}
                        `}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {
                        // if the deleteIndex is equal to the index of the chat then show the checked and close buttons
                        // else show the delete button
                        deleteCollectionIndex === item.id ? (
                          <>
                            <AiOutlineCheck
                              size={styles.iconSize}
                            // todo: handle chat delete
                            // onClick={() => handleChatDelete(item.id)}
                            />
                            <AiOutlineClose
                              size={styles.iconSize}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteCollectionIndex(null)
                              }}
                            />
                          </>
                        ) : (
                          <AiOutlineDelete
                            size={styles.iconSize}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteCollectionIndex(item.id)
                            }}
                          />
                        )
                      }
                    </div>
                  </li>
                  <ul className="ml-3 border-l-2 border-gray-300 pl-2">
                    {
                      currentCollectionIndex === item.id && (
                        renderChats(item?.chats)
                      )
                    }
                  </ul>
                </>
              )
            })
          }
          <hr className="h-px bg-gray-300 mt-3 border-0 mr-4 mb-3"></hr>
          {
            renderChats(chatHistory)
          }
          <div
            className={`flex ${paginationChatHistory.page === 1 ? "flex-row-reverse" : "flex-row"
              } ${paginationChatHistory.offset !== 0 &&
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
        <div
          className={`w-full px-2 flex absolute bottom-4 left-0 z-40 flex-col gap-2 ${chatSiderCollapse ? "d-none" : "flex"
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
      </div >
    </aside >
  );
}


// when the chats fetched we need the chats that are not in any collection
// when collections are fetched we need collections with chats []
// when a chat without collection is dragged to a collection we need to update the chat with collection id and remove it from the chats list
