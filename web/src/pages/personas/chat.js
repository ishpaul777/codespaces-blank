import { useEffect, useRef, useState } from "react";
import FactlyLogo from "../../assets/icons/factlyLogo";
import { AiOutlineEdit } from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "../../components/codeblock";
import { BsClipboard, BsClipboard2Check } from "react-icons/bs";
import { BeatLoader, ClipLoader } from "react-spinners";
import PromptInput from "../chats/PromptInput";
import rehypeMathjax from "rehype-mathjax";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import SideBar from "../chats/sidebar";
import { SSE } from "sse.js";
import sendButton from "../../assets/icons/send-button.svg";

import {
  MdOutlineClearAll,
  // MdOutlineCreateNewFolder,
  MdKeyboardBackspace,
} from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  deletePersonaChatByID,
  getPersonaByID,
  getPersonaChatsByUserID,
} from "../../actions/persona";
import { errorToast, successToast } from "../../util/toasts";
import CentralLoading from "../../components/loader/centralLoading";
export const PersonaChat = () => {
  const navigate = useNavigate();
  // constants for styling the chat page
  const styles = {
    fileIconSize: "24px",
    iconSize: "20px",
  };

  const { id } = useParams();

  // reading data send from the link in react router dom
  const location = useLocation();
  const { name, desc, image } = location.state;

  const [persona, setPersona] = useState({});

  // state variables for the chat page
  const [stream, setStream] = useState(true);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [chatLoading, setChatLoading] = useState(false);
  const [chatSiderCollapse, setChatSiderCollapse] = useState(
    isMobileScreen ? true : false
  );

  // paginationChatHistory stores the pagination state of the chat history
  const [paginationChatHistory, setPaginationChatHistory] = useState({
    limit: 12,
    page: 1,
    search_query: "",
  });

  const [isCopied, setIsCopied] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);
  const [chat, setChat] = useState([]);
  const [chatID, setChatID] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isEditing, setIsEditing] = useState({
    status: false,
    id: null,
    value: "",
  });
  const [deleteChatHistoryIndex, setDeleteChatHistoryIndex] = useState(null);

  /* 
    handlers for the chat page
  */
  // it deletes the chat from the chatHistory array
  const handleChatDelete = (chatID) => {
    deletePersonaChatByID(id, chatID)
      .then(() => {
        successToast("Chat delete successfully");
      })
      .then(() => {
        getPersonaChatsByUserID(id, paginationChatHistory).then((data) => {
          setChatHistory(data.chats);
          setChatCount(data.count);
        });
      })
      .catch(() => {
        errorToast("Unable to delete chat. Please try again.");
      });
  };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView({ behavior: "smooth" }));
    return <div ref={elementRef} />;
  };

  // handleHistoryDeleteClick makes the the checked and close buttons visible by
  // setting the deleteChatHistoryIndex to the index of the chat in the chatHistory array
  const handleHistoryDeleteClick = (id) => {
    setDeleteChatHistoryIndex(id);
  };

  const handleCopyClick = (content) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };

  const chatOptionsList = [
    {
      title: "Clear conversations",
      icon: <MdOutlineClearAll size={styles.iconSize} />,
      onClick: () => {
        setChat([]);
        setChatID(null);
      },
    },
    {
      title: "Go back to personas",
      icon: <MdKeyboardBackspace size={styles.iconSize} />,
      onClick: () => {
        navigate("/personas");
      },
    },
  ];

  // chatCount stores the total number of chats of the current user
  const [chatCount, setChatCount] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsMobileScreen(true);
      } else {
        setIsMobileScreen(false);
        // setPromptSiderCollapse(false);
        setChatSiderCollapse(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    getPersonaChatsByUserID(id, paginationChatHistory)
      .then((res) => {
        setChatHistory(res.chats);
        setChatCount(res.count);
      })
      .catch((err) => {
        errorToast(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [paginationChatHistory]);

  useEffect(() => {
    setLoading(true);
    getPersonaByID(id)
      .then((response) => {
        setPersona(response);
      })
      .catch(() => {
        errorToast("Unable to fetch persona. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // handleNewChatClick is called when the user clicks on the new chat button
  // it resets the chat state and the chatID state
  const handleNewChatClick = () => {
    setChat([]);
    setChatID(null);
    setCurrentPrompt("");
    setPaginationChatHistory({
      limit: 12,
      page: 1,
      search_query: "",
    });

    setChatCount(0);

    getPersonaChatsByUserID(id, paginationChatHistory);
  };

  // handleKeypress is called when the user presses key in the prompt input
  // it calls the handleChatSubmit function when the user presses the enter key
  // it is used when the user is not using the streaming way of getting the chat response
  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (stream) {
        handleChatStream();
      } else {
        handleChatSubmit();
      }
    }
  };

  // handleChatStream is called when the user clicks on the send button
  // its the streaming way of getting the chat response
  // it updates the chat state with the response from the server
  // uses the EventSource API to get the response from the server as it is a server side event
  const handleChatStream = () => {
    if (window.event.shiftKey && window.event.keyCode === 13) {
      setCurrentPrompt(currentPrompt + "\n");
      return;
    }
    setChatLoading(true);
    let currentMessage = {
      role: "user",
      content: currentPrompt,
    };

    const newMessages = [...chat, currentMessage];

    setChat(newMessages);
    setCurrentPrompt("");

    var requestBody = {
      messages: newMessages,
      additional_instructions:
        "The response should be in markdown format(IMPORTANT).",
      stream: stream,
    };

    if (chatID) {
      requestBody.id = chatID;
    }

    var source = new SSE(
      process.env.REACT_APP_TAGORE_API_URL + `/personas/${id}/chats`,
      {
        payload: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    source.addEventListener("message", (event) => {
      let chatObject = JSON.parse(event.data);
      setChat(chatObject?.messages);
      setChatID(chatObject?.id);
    });

    source.addEventListener("error", (event) => {
      setIsEditing({ status: false, id: null });
      source.close();
      setChatLoading(false);
      if (!String(event.data).includes("[DONE]")) {
        return;
      }
    });

    source.stream();
  };

  const handleEdit = (messages, index) => {
    setChatLoading(true);
    messages[index].content = isEditing.value;
    setChat(messages);
    var requestBody = {
      messages: messages,
      additional_instructions:
        "The response should be in markdown format(IMPORTANT).",
      stream: stream,
      id: chatID,
    };

    var source = new SSE(
      process.env.REACT_APP_TAGORE_API_URL + `/personas/${id}/chats`,
      {
        payload: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    source.addEventListener("message", (event) => {
      let chatObject = JSON.parse(event.data);
      setChat(chatObject?.messages);
      setChatID(chatObject?.id);
    });

    source.addEventListener("error", (event) => {
      setIsEditing({ status: false, id: null });
      source.close();
      setChatLoading(false);
      if (!String(event.data).includes("[DONE]")) {
        return;
      }
    });

    source.stream();
  };

  // handlePromptChange is called when the user types in the prompt input
  const handlePromptChange = (value) => {
    setCurrentPrompt(value);
  };

  // handleChatSubmit is called when the user clicks on the send button
  // its the non streaming way of getting the chat response
  // it updates the chat state with the response from the server
  // the chatID state if the chatID is null
  // also updates the loading state
  const handleChatSubmit = () => {
    setLoading(true);
    let currentMessage = {
      role: "user",
      content: currentPrompt,
    };

    const newMessages = [...chat, currentMessage];

    var requestBody = {
      prompt: currentMessage.content,
      userID: 1,
      additional_instructions: "Return the content in valid markdown format.",
      stream: stream,
    };

    if (chatID) {
      requestBody.id = chatID;
    }

    setChat(newMessages);
    setCurrentPrompt("");
  };

  const editref = useRef(null);

  useEffect(() => {
    if (isEditing.status) {
      editref.current.style.height = "auto";
      const scrollHeight = editref.current.scrollHeight;
      editref.current.style.height = scrollHeight + "px";
    }
  }, [isEditing.status]);

  return (
    <div className="flex min-h-screen max-h-screen flex-row bg-gray-100 text-gray-800">
      {loading ? (
        <CentralLoading />
      ) : (
        <>
          <SideBar
            isMobileScreen={isMobileScreen}
            chatSiderCollapse={chatSiderCollapse}
            handleNewChatClick={handleNewChatClick}
            paginationChatHistory={paginationChatHistory}
            setPaginationChatHistory={setPaginationChatHistory}
            chatHistory={chatHistory}
            setChat={setChat}
            setChatID={setChatID}
            setIsEditing={setIsEditing}
            chatID={chatID}
            setChatTitle={() => {}}
            deleteChatHistoryIndex={deleteChatHistoryIndex}
            handleChatDelete={handleChatDelete}
            setDeleteChatHistoryIndex={setDeleteChatHistoryIndex}
            handleHistoryDeleteClick={handleHistoryDeleteClick}
            chatCount={chatCount}
            chatOptionsList={chatOptionsList}
            isFolderVisible={false}
          />
          <main className="main flex flex-grow flex-col pb-4 transition-all duration-150 ease-in md:ml-0">
            <div className="w-full scrollbar-custom overflow-y-auto flex h-[90vh] flex-col items-center">
              <div
                className={`sticky px-8 py-4 top-0 w-full mb-1 z-40 bg-body`}
              >
                {/* chat header */}
                {/* <BiChevronLeft size={28} /> */}
                <span className="text-lg font-bold px-8">
                  {persona?.name?.length < 60
                    ? persona?.name
                    : `${persona?.name?.slice(0, 60) + "..."}
                        `}
                </span>
              </div>
              {chat
                .filter((item) => item.role !== "system")
                .map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`rounded-lg my-1 border-[#CED0D4] w-11/12 flex items-center justify-between px-7 py-6 ${
                        item.role === "user" ? "bg-[#ECEDF1]" : "bg-[#E4E7ED]"
                      }`}
                    >
                      <div className={`w-full flex gap-4`}>
                        <div
                          className={`flex justify-center items-center  h-8 w-8 rounded-full ring-2 ${
                            item.role === "user"
                              ? "bg-green-600 ring-green-600"
                              : "ring-red-600 bg-red-600"
                          } text-white mr-2`}
                        >
                          {item.role === "user" ? (
                            <span className="text-lg"> U </span>
                          ) : (
                            <FactlyLogo />
                          )}
                        </div>
                        {isEditing.status && isEditing.id === index ? (
                          <div className="w-[85%] flex flex-col justigy-center">
                            <textarea
                              ref={editref}
                              className="bg-transparent p-2 outline-none text-base border-none focus:ring-0 h-auto scrollbar-hide pt-1"
                              autoFocus={true}
                              style={{
                                borderBottom: "1px solid #000",
                              }}
                              onChange={(e) => {
                                setIsEditing({
                                  ...isEditing,
                                  value: e.target.value,
                                });
                              }}
                              defaultValue={item.content}
                            />
                            <div className="flex justify-center items-center gap-4 mt-2">
                              <button
                                className="flex items-center justify-center  bg-black px-3 py-3 rounded-md text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsEditing({
                                    status: !isEditing.status,
                                    id: isEditing.status ? null : index,
                                  });
                                  handleEdit(
                                    chat
                                      .filter((obj) => obj.role !== "system")
                                      .slice(0, index + 1),
                                    index
                                  );
                                }}
                              >
                                {" "}
                                Save & Submit
                              </button>
                              <button
                                className="flex items-center justify-center border-[#eee] "
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsEditing({
                                    status: !isEditing.status,
                                    id: isEditing.status ? null : index,
                                  });
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeMathjax]}
                            className={`prose ${
                              isMobileScreen
                                ? "max-w-[17rem]"
                                : chatSiderCollapse
                                ? "max-w-4xl"
                                : "max-w-2xl"
                            } `}
                            components={{
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );

                                return !inline ? (
                                  <CodeBlock
                                    key={index}
                                    language={(match && match[1]) || ""}
                                    value={String(children).replace(/\n$/, "")}
                                    {...props}
                                  />
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {item.content}
                          </ReactMarkdown>
                        )}
                      </div>
                      <div className={`self-start`}>
                        {item.role !== "user" ? (
                          <button
                            className="flex items-center justify-center text-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyClick(item.content);
                            }}
                          >
                            {" "}
                            {isCopied ? <BsClipboard2Check /> : <BsClipboard />}
                          </button>
                        ) : !(isEditing.status && isEditing.id === index) ? (
                          <button
                            className="flex items-center justify-center text-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditing((prevState) => ({
                                ...prevState,
                                status: !prevState.status,
                                id: prevState.status ? null : index,
                                value: item.content,
                              }));
                              // editref.current.focus()
                            }}
                          >
                            <AiOutlineEdit />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              {chatLoading && (
                <div className="flex justify-center mt-4">
                  <AlwaysScrollToBottom />
                  <BeatLoader size={styles.iconSize} color={"#CED0D4"} />
                </div>
              )}
            </div>
            {/* chat input container */}
            <div className="py-4 w-full flex justify-center items-center">
              {/* input division */}
              <div
                className={`w-11/12 relative shadow-primary border px-4 py-2 bg-white border-primary rounded-lg grid grid-cols-[9fr_1fr] max-h-96`}
              >
                <PromptInput
                  value={currentPrompt}
                  className="outline-none text-base border-none focus:ring-0"
                  placeholder="Type a message"
                  onChange={handlePromptChange}
                  onEnter={handleKeypress}
                ></PromptInput>
                <div className="flex flex-row-reverse">
                  <button
                    className={`flex items-center justify-center`}
                    onClick={
                      stream
                        ? () => handleChatStream()
                        : () => handleChatSubmit()
                    }
                  >
                    {!chatLoading ? (
                      <img src={sendButton} />
                    ) : (
                      <ClipLoader size={20} color={"#000"} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};
