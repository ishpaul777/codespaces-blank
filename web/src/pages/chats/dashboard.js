import React, { useEffect, useRef, useState } from "react";
import FactlyLogo from "../../assets/icons/factlyLogo.jsx";
import { SSE } from "sse.js";
import {
  MdOutlineClearAll,
  MdOutlineCreateNewFolder,
  MdKeyboardBackspace,
} from "react-icons/md";

import { BsClipboard, BsClipboard2Check } from "react-icons/bs";
import { BiChevronLeft } from "react-icons/bi";

import { AiOutlineMenuUnfold } from "react-icons/ai";

import { HiPlus } from "react-icons/hi";
import { FaRobot } from "react-icons/fa";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";

import { BiMessageDetail } from "react-icons/bi";
import sendButton from "../../assets/icons/send-button.svg";
import { BeatLoader, ClipLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import rehypeMathjax from "rehype-mathjax";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  deleteChatByID,
  getChatHistoryByUserID,
  getChatResponse,
} from "../../actions/chat";
import { Link, useNavigate } from "react-router-dom";
import { CodeBlock } from "../../components/codeblock";
import { ToastContainer } from "react-toastify";
import { errorToast, successToast } from "../../util/toasts";
import { Input } from "../../components/inputs/Input";
import { Select, SelectTemperature } from "../../components/inputs/select";
import PromptBar from "./PromptBar";
import PromptInput from "./PromptInput";

export default function ChatPage() {
  const navigate = useNavigate();

  const [stream, setStream] = useState(true);
  const [initialPrompt, setIntialPrompt] = useState("");
  const [isMobileScreen, setIsMobileScreen] = useState(false)
  const [promptSiderCollapse, setPromptSiderCollapse] = useState(isMobileScreen ? true : false)
  const [chatSiderCollapse, setChatSiderCollapse] = useState(isMobileScreen ? true : false)
  const [chatTitle, setChatTitle] = useState("")
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsMobileScreen(true)
      } else {
        setIsMobileScreen(false)
        setPromptSiderCollapse(false)
        setChatSiderCollapse(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = (content) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };


  const [isEditing, setIsEditing] = useState({
    status: false,
    id: null,
  });
  const editref = useRef(null);

  useEffect(() => {
    if (isEditing.status) {

      editref.current.style.height = "auto";
      const scrollHeight = editref.current.scrollHeight;
      editref.current.style.height = scrollHeight + "px";
    }
  }, [isEditing.status]);


  const modelIDToLabel = {
    "gpt-3.5-turbo": "GPT-3.5 Turbo",
    "gpt-4": "GPT-4",
    "claude-v1.3": "Claude v1.3",
  };

  const modelIDtoProvider = {
    "gpt-3.5-turbo": "openai",
    "gpt-4": "openai",
    "claude-v1.3": "anthropic",
  };

  const styles = {
    fileIconSize: "24px",
    iconSize: "20px",
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
      title: "Back",
      icon: <MdKeyboardBackspace size={styles.iconSize} />,
      onClick: () => {
        navigate("/chats");
      },
    },
  ];

  // chat stores the current selected chat or the new chat that the user created
  // chat is an array of objects with each object having the following structure
  // {
  //   role: "user" or "bot",
  //   content: "message content - mostly markdown"
  // }
  const [chat, setChat] = useState([]);

  // chatID stores the id of the current chat
  // its null if the user is creating a new chat
  // once the user starts the chat with the bot, the chatID is set to the id of the chat which comes from the server
  const [chatID, setChatID] = useState(null);

  // currentPrompt stores the current prompt that the user is typing
  // it is used to update the chat state when the user sends the message
  const [currentPrompt, setCurrentPrompt] = useState("");

  // chatHistory stores the chat history of the current user
  const [chatHistory, setChatHistory] = useState([]);

  // chatCount stores the total number of chats of the current user
  const [chatCount, setChatCount] = useState(0);

  // paginationChatHistory stores the pagination state of the chat history
  const [paginationChatHistory, setPaginationChatHistory] = useState({
    limit: 12,
    page: 1,
    search_query: "",
  });

  // loading state for chat response
  const [loading, setLoading] = useState(false);

  // model is the generative model that the user wants to use
  const [model, setModel] = useState("gpt-3.5-turbo");

  // isSettingVisible is the state for the settings section
  const [isSettingVisible, setIsSettingVisible] = useState(false);

  // temperature is the temperature of the generative model that the user wants to use
  const [temperature, setTemperature] = useState(0.9);

  // handleNewChatClick is called when the user clicks on the new chat button
  // it resets the chat state and the chatID state
  const handleNewChatClick = () => {
    setChat([]);
    setChatID(null);
    setModel("gpt-3.5-turbo");
    setCurrentPrompt("");
    setPaginationChatHistory({
      limit: 12,
      page: 1,
      search_query: "",
    });

    setChatCount(0);

    getChatHistoryByUserID(1, paginationChatHistory)
      .then((data) => {
        setChatHistory(data.chats);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // handlePromptChange is called when the user types in the prompt input
  const handlePromptChange = (value) => {
    setCurrentPrompt(value);
  };

  // handleChatSubmit is called when the user clicks on the send button
  // its the non streaming way of getting the chat response
  // it calls the getChatResponse function from the actions/chat.js file
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
      model: model,
      provider: modelIDtoProvider[model],
      userID: 1,
      temperature: temperature,
      additional_instructions: "Return the content in valid markdown format.",
      stream: stream,
    };

    if (chatID) {
      requestBody.id = chatID;
    }

    setChat(newMessages);
    setCurrentPrompt("");

    getChatResponse(requestBody, 1)
      .then((data) => {
        if (!chatID) {
          setChatID(data.id);
        }
        setChat(data?.messages);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
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
    setLoading(true);
    let currentMessage = {
      role: "user",
      content: currentPrompt,
    };

    const newMessages = [...chat, currentMessage];

    setChat(newMessages);
    setCurrentPrompt("");

    var requestBody = {
      prompt: currentMessage.content,
      model: model,
      provider: "openai",
      userID: 1,
      temperature: temperature,
      additional_instructions: "Return the content in valid markdown format.",
      stream: stream,
    };

    if (chatID) {
      requestBody.id = chatID;
    }

    var source = new SSE(
      process.env.REACT_APP_TAGORE_API_URL + "/chat/completions",
      {
        payload: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          "X-User": 1,
          "Content-Type": "application/json",
        },
      }
    );

    source.addEventListener("message", (event) => {
      let chatObject = JSON.parse(event.data);
      console.log(chatObject);
      setChat(chatObject?.messages);
      setChatID(chatObject?.id);
      setIsEditing({ status: false, id: null });
    });

    source.addEventListener("error", (event) => {
      source.close();
      setLoading(false);
      if (!String(event.data).includes("[DONE]")) {
        return;
      }
    });

    source.stream();
  };

  // AlwaysScrollToBottom is a component that is used to scroll to the bottom of the chat window
  // it is used to scroll to the bottom of the chat window when the user sends a message
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView({ behavior: "smooth" }));
    return <div ref={elementRef} />;
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

  useEffect(() => {
    // get the chat history of the user
    getChatHistoryByUserID(1, paginationChatHistory)
      .then((data) => {
        setChatHistory(data.chats);
        setChatCount(data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [paginationChatHistory.page, paginationChatHistory.limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // get the chat history of the user
      getChatHistoryByUserID(1, paginationChatHistory)
        .then((data) => {
          setChatHistory(data.chats);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [paginationChatHistory.search_query]);

  // maxListChars is the maximum number of characters that can be shown in the chat list
  const maxListChars = 15;

  // deleteChatHistoryIndex is the index of the chat in the chatHistory array
  // which is to be deleted
  const [deleteChatHistoryIndex, setDeleteChatHistoryIndex] = useState(null);

  // handleHistoryDeleteClick makes the the checked and close buttons visible by
  // setting the deleteChatHistoryIndex to the index of the chat in the chatHistory array
  const handleHistoryDeleteClick = (id) => {
    setDeleteChatHistoryIndex(id);
  };

  // handleChatDelete is called when the user clicks on the cross icon in the chat list
  // it deletes the chat from the chatHistory array
  const handleChatDelete = (id) => {
    deleteChatByID(id, 1)
      .then((response) => {
        successToast(response.message);
        setDeleteChatHistoryIndex(null);
        getChatHistoryByUserID(1, paginationChatHistory)
          .then((data) => {
            setChatHistory(data.chats);
          })
          .catch((err) => {
            errorToast(err?.message);
          });
      })
      .catch((err) => {
        errorToast(err?.message);
      });
  };
  return (
    // chat container, it has 2 sections
    // 1. chat list
    // 2. chat component
    <div className="flex min-h-screen max-h-screen flex-row bg-gray-100 text-gray-800">
      {/* sidebar */}
      <aside className={`z-50 sm-fixed sm-left-0 sm-top-0 md:static h-screen sidebar ${chatSiderCollapse ? "translate-x-0 w-0" : `${isMobileScreen ? 'w-3/4 ' : 'w-[20vw] '}bg-black-100`} flex flex-row  ease-in-out duration-300 gap-4`}>
        <div className={`bg-white relative w-full shadow-md ${chatSiderCollapse || 'pt-4 pl-4'}`}>
          <div className={`my-4 w-full text-center justify-between gap-2 ${chatSiderCollapse ? 'd-none' : 'flex pr-4'} `}>
            <button
              className={`p-2 w-full hover:bg-light-gray border rounded-md flex items-center cursor-pointer gap-3  ${chatSiderCollapse ? "d-none" : "flex"
                } `}
              onClick={() => handleNewChatClick()}
            >
              <HiPlus size={styles.iconSize} />
              <span className="text-lg">New Chat</span>
            </button>
            <button className="p-2 border hover:bg-light-gray rounded-md cursor-pointer flex justify-center items-center">
              <MdOutlineCreateNewFolder size={styles.fileIconSize} />
              {/* added the toast container here because had already developed layout without taking toast in consideration, toast container will be hidden */}
              <ToastContainer />
            </button>
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
            className={`overflow-y-auto  ${chatSiderCollapse && "d-none"
              }  mt-3`}
            style={{ maxHeight: "67vh" }}
          >
            {chatHistory.map((item, index) => {
              return (
                <li
                  draggable={true}
                  key={index}
                  onClick={() => {
                    setChat(item?.messages);
                    setChatID(item?.id);
                    setChatTitle(item?.title);
                    setIsEditing({ status: false, id: null });
                  }}
                  className={`mr-4 p-2 text-lg hover:bg-hover-on-white cursor-pointer rounded-md grid grid-cols-[9fr_1fr] items-center mb-2
                    ${chatID === item?.id && "bg-hover-on-white"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <BiMessageDetail size={styles.iconSize} />
                    <span                    >
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
              className={`flex ${paginationChatHistory.page === 1
                ? "flex-row-reverse"
                : "flex-row"
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
        </div>
      </aside>

      {/* chat */}
      <main className="main flex flex-grow flex-col pb-4 transition-all duration-150 ease-in md:ml-0" >
        <div className="w-full scrollbar-custom overflow-y-auto flex h-[90vh] flex-col items-center">
          {chat.length === 0 ? (
            <>
              <div className="flex flex-row justify-between w-full px-3 pt-4">
                <button onClick={() => {
                  setChatSiderCollapse(!chatSiderCollapse)
                  isMobileScreen && setPromptSiderCollapse(true)
                }} style={{ width: 'fit-content', height: 'fit-content' }}>
                  <AiOutlineMenuUnfold size={styles.fileIconSize} />
                </button>
                <button onClick={() => {
                  setPromptSiderCollapse(!promptSiderCollapse)
                  isMobileScreen && setChatSiderCollapse(true)
                }} style={{ width: 'fit-content', height: 'fit-content' }}>
                  <AiOutlineMenuUnfold size={styles.fileIconSize} />
                </button>
              </div>
              <div className="border-none w-full flex flex-col items-center p-4 gap-4">
                <div className="md:w-2/5 top-0 sticky border bg-[#F8F8F8] border-[#DEDEDE] rounded-lg flex flex-col p-4 gap-4" style={{ maxWidth: isMobileScreen ? '80vw' : '400px', width: isMobileScreen ? '80vw' : '' }}>
                  <Select
                    label={"Model"}
                    onChange={(e) => {
                      setModel(e.target.value);
                    }}
                    placeholder={"select model"}
                    initialValue={model}
                  ></Select>
                  <Input
                    initialValue={initialPrompt}
                    label={"System Prompt"}
                    onChange={(e) => {
                      setIntialPrompt(e.target.value);
                    }}
                    placeholder={"Enter your system prompt"}
                  ></Input>
                  <SelectTemperature
                    label={"Conversation Style"}
                    onChange={(e) => {
                      setTemperature(e.target.value);
                    }}
                    value={temperature}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className={`sticky top-0 w-full mb-1 z-40 pt-4 bg-body`}>
              {/* chat header */}
              <Link to="/" className="flex items-center px-4 font-bold ">
                <BiChevronLeft size={28} />
                <span className="text-lg font-bold">{chatTitle.length < 60
                  ? chatTitle
                  : `${chatTitle?.slice(0, 60) + "..."}
                        `}</span>
              </Link>
              <div
                className={`border-none bg-body w-full px-4 py-2 gap-4 flex justify-between`}
              >
                <button
                  onClick={() => setChatSiderCollapse(!chatSiderCollapse)}
                  style={{ width: "fit-content", height: "fit-content" }}
                >
                  <AiOutlineMenuUnfold size={styles.fileIconSize} />
                </button>
                <div>
                  <span>Model: {modelIDToLabel[model]}</span>
                  <IoMdSettings
                    size={styles.iconSize}
                    className="inline ml-4"
                    onClick={() =>
                      setIsSettingVisible((prevState) => !prevState)
                    }
                    cursor={"pointer"}
                  />
                </div>
                {isMobileScreen ? <p className="text-lg font-bold">Tagore AI</p> : null}
                <button onClick={() => setPromptSiderCollapse(!promptSiderCollapse)} style={{ width: 'fit-content', height: 'fit-content' }}>
                  <AiOutlineMenuUnfold size={styles.fileIconSize} />
                </button>
              </div>

              <div className={`bg-body ease-in-out duration-300 ${isSettingVisible ? 'h-fit p-4 w-full translate-y-100 flex flex-col items-center gap-4' : 'h-0 translate-y-0'}`}>
                {isSettingVisible && (
                  <>
                    <div className="md:w-2/5 top-0 sticky border bg-[#F8F8F8] border-[#DEDEDE] rounded-lg flex flex-col p-4 gap-4" style={{ maxWidth: isMobileScreen ? '80vw' : '400px', width: isMobileScreen ? '80vw' : '' }}>
                      <Select
                        label={"Model"}
                        onChange={(e) => {
                          setModel(e.target.value);
                        }}
                        placeholder={"select model"}
                        initialValue={model}
                      ></Select>
                      <Input
                        initialValue={initialPrompt}
                        label={"System Prompt"}
                        onChange={(e) => {
                          setIntialPrompt(e.target.value);
                        }}
                        placeholder={"Enter your system prompt"}
                      ></Input>
                      <SelectTemperature
                        label={"Conversation Style"}
                        onChange={(e) => {
                          setTemperature(e.target.value);
                        }}
                        value={temperature}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {chat.filter((item) => item.role !== "system").map((item, index) => {
            return (
              <div
                key={index}
                className={`rounded-lg my-1 border-[#CED0D4] w-11/12 flex items-center justify-between px-7 py-6 ${item.role === "user" ? "bg-[#ECEDF1]" : "bg-[#E4E7ED]"
                  }`}
              >
                <div className={`w-full flex gap-4`}>
                  <div className={`flex justify-center items-center  h-8 w-8 rounded-full ring-2 ${item.role === "user" ? 'bg-green-600 ring-green-600' : 'ring-red-600 bg-red-600'} text-white mr-2`}>
                    {item.role === "user" ? (
                      <span className="text-lg"> U </span>
                    ) : (
                      <FactlyLogo />
                    )}
                  </div>
                  {
                    isEditing.status && isEditing.id === index ? (
                      <div className="w-[85%] flex flex-col justigy-center">
                        <textarea
                          ref={editref}
                          className="bg-transparent p-2 outline-none text-base border-none focus:ring-0 h-auto scrollbar-hide pt-1"
                          autoFocus={true}
                          style={{
                            borderBottom: '1px solid #000'
                          }}
                          value={item.content}
                        />
                        <div className="flex justify-center items-center gap-4 mt-2">
                          <button className="flex items-center justify-center  bg-black px-3 py-3 rounded-md text-white" onClick={(e) => { e.stopPropagation(); setIsEditing({ status: !isEditing.status, id: isEditing.status ? null : index }) }}> Save & Submit
                          </button>
                          <button className="flex items-center justify-center border-[#eee] " onClick={(e) => { e.stopPropagation(); setIsEditing({ status: !isEditing.status, id: isEditing.status ? null : index }) }}>
                            Cancel
                          </button>

                        </div>
                      </div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeMathjax]}
                        className={`prose ${isMobileScreen ? 'max-w-[17rem]' : (chatSiderCollapse || promptSiderCollapse) ? 'max-w-4xl' : "max-w-2xl"} `}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");

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
                    )
                  }
                </div>
                <div
                  className={`self-start`}
                >
                  {
                    item.role !== "user" ?
                      (<button className="flex items-center justify-center text-lg" onClick={(e) => {
                        e.stopPropagation()
                        handleCopyClick(item.content)
                      }}
                      >           {isCopied ? <BsClipboard2Check /> : <BsClipboard />}
                      </button>)
                      :
                      !(isEditing.status && isEditing.id === index) ?
                        (<button className="flex items-center justify-center text-lg" onClick={(e) => {
                          e.stopPropagation()
                          setIsEditing({ status: !isEditing.status, id: isEditing.status ? null : index })
                          // editref.current.focus()
                        }}
                        >
                          <AiOutlineEdit />
                        </button>
                        ) : (null)
                  }
                </div>
              </div>
            );
          })}
          {loading && (
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
                  stream ? () => handleChatStream() : () => handleChatSubmit()
                }
              >
                {!loading ? (
                  <img src={sendButton} />
                ) : (
                  <ClipLoader size={20} color={"#000"} />
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* prompt bar */}
      <aside className={`sidebar sm-fixed sm-right-0 sm-top-0 md:static h-screen ${promptSiderCollapse ? "translate-x-0 w-0" : `${isMobileScreen ? 'w-3/4 ' : 'w-[20vw] '}`} flex flex-row ease-in-out duration-300 gap-4 z-50`} >
        <div className={`bg-white w-full relative shadow-md ${promptSiderCollapse || 'pt-4 pl-4'}`}>
          <PromptBar open={!promptSiderCollapse} />
        </div>
      </ aside>
      <div className={`
        ${(isMobileScreen) ? (promptSiderCollapse) ? 'd-none ' : 'flex ' : 'd-none'}
        fixed top-2 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40 cursor-pointer
      `} onClick={() => {
          setPromptSiderCollapse(!promptSiderCollapse)
          isMobileScreen && setPromptSiderCollapse(true)
        }}
      >
        <button className="absolute top-4 right-3/4 pr-4"
          onClick={() => {
            setPromptSiderCollapse(!promptSiderCollapse)
            isMobileScreen && setPromptSiderCollapse(true)
          }} style={{ width: 'fit-content', height: 'fit-content' }}>
          <AiOutlineMenuUnfold size={styles.fileIconSize} color="#fff" />
        </button>
      </div>
      <div className={` ${(isMobileScreen) ? (chatSiderCollapse) ? 'd-none ' : 'flex ' : 'd-none'}
        fixed top-2 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40 cursor-pointer
      `} onClick={() => {
          setChatSiderCollapse(!chatSiderCollapse)
        }}>
        <button className="absolute top-4 left-3/4 pl-4"
          onClick={() => {
            setChatSiderCollapse(!chatSiderCollapse)
          }} style={{ width: 'fit-content', height: 'fit-content' }}>
          <AiOutlineMenuUnfold size={styles.fileIconSize} color="#fff" />
        </button>
      </div>
    </div >
  );
}
