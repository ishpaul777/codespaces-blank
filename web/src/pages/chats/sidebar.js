import { HiPlus } from "react-icons/hi";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { BiMessageDetail } from "react-icons/bi";
import {
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";

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
  isFolderVisible=true
}) {
  const maxListChars = 15;
  const styles = {
    fileIconSize: "24px",
    iconSize: "20px",
  };

  return (
    <aside
      className={`z-50 sm-fixed sm-left-0 sm-top-0 md:static h-screen sidebar ${
        chatSiderCollapse
          ? "translate-x-0 w-0"
          : `${isMobileScreen ? "w-3/4 " : "w-[20vw] "}bg-black-100`
      } flex flex-row  ease-in-out duration-300 gap-4`}
    >
      <div
        className={`bg-white relative w-full shadow-md ${
          chatSiderCollapse || "pt-4 pl-4"
        }`}
      >
        <div
          className={`my-4 w-full text-center justify-between gap-2 ${
            chatSiderCollapse ? "d-none" : "flex pr-4"
          } `}
        >
          <button
            className={`p-2 w-full hover:bg-light-gray border rounded-md flex items-center cursor-pointer gap-3  ${
              chatSiderCollapse ? "d-none" : "flex"
            } `}
            onClick={() => handleNewChatClick()}
          >
            <HiPlus size={styles.iconSize} />
            <span className="text-lg">New Chat</span>
          </button>
          {
            isFolderVisible ? (
              <button className="p-2 border hover:bg-light-gray rounded-md cursor-pointer flex justify-center items-center">
              <MdOutlineCreateNewFolder size={styles.fileIconSize} />
              {/* added the toast container here because had already developed layout without taking toast in consideration, toast container will be hidden */}
              <ToastContainer />
            </button>
            )
            : (
              <div>
                    <ToastContainer />
              </div>
            )
          }
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
          className={`overflow-y-auto  ${chatSiderCollapse && "d-none"}  mt-3`}
          style={{ maxHeight: "67vh" }}
        >
          {chatHistory.map((item, index) => {
            return (
              <li
                draggable={true}
                key={index}
                className={`mr-4 p-2 text-lg hover:bg-hover-on-white cursor-pointer rounded-md grid grid-cols-[9fr_1fr] items-center mb-2
                    ${chatID === item?.id && "bg-hover-on-white"}
                  `}
              >
                <div
                  className="flex items-center gap-3"
                  onClick={() => {
                    setChat(item?.messages);
                    setChatID(item?.id);
                    setChatTitle(item?.title);
                    setIsEditing({ status: false, id: null });
                  }}
                >
                  <BiMessageDetail size={styles.iconSize} />
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
                    deleteChatHistoryIndex === index ? (
                      <>
                        <AiOutlineCheck
                          size={styles.iconSize}
                          onClick={() => handleChatDelete(item.id)}
                        />
                        <AiOutlineClose
                          size={styles.iconSize}
                          onClick={() => setDeleteChatHistoryIndex(null)}
                        />
                      </>
                    ) : (
                      <AiOutlineDelete
                        size={styles.iconSize}
                        onClick={() => handleHistoryDeleteClick(index)}
                      />
                    )
                  }
                </div>
              </li>
            );
          })}
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
      </div>
    </aside>
  );
}
