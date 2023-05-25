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
import SideBar from "./sidebar.js";
import ChatBar from "./chatbar.js";

export default function ChatPage() {
  const navigate = useNavigate();

  const [stream, setStream] = useState(true);
  const [initialPrompt, setIntialPrompt] = useState("");
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [promptSiderCollapse, setPromptSiderCollapse] = useState(
    isMobileScreen ? true : false
  );
  const [chatSiderCollapse, setChatSiderCollapse] = useState(
    isMobileScreen ? true : false
  );
  const [chatTitle, setChatTitle] = useState("");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsMobileScreen(true);
      } else {
        setIsMobileScreen(false);
        setPromptSiderCollapse(false);
        setChatSiderCollapse(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <SideBar
        isMobileScreen={isMobileScreen}
        chatSiderCollapse={chatSiderCollapse}
        handleNewChatClick={handleNewChatClick}
        paginationChatHistory={paginationChatHistory}
        setPaginationChatHistory={setPaginationChatHistory}
        chatHistory={chatHistory}
        setChat={setChat}
        setChatID={setChatID}
        setChatTitle={setChatTitle}
        setIsEditing={setIsEditing}
        chatID={chatID}
        deleteChatHistoryIndex={deleteChatHistoryIndex}
        handleChatDelete={handleChatDelete}
        setDeleteChatHistoryIndex={setDeleteChatHistoryIndex}
        handleHistoryDeleteClick={handleHistoryDeleteClick}
        chatCount={chatCount}
        chatOptionsList={chatOptionsList}
      />

      {/* chat */}
      <ChatBar
        chat={chat}
        setChatSiderCollapse={setChatSiderCollapse}
        chatSiderCollapse={chatSiderCollapse}
        isMobileScreen={isMobileScreen}
        setPromptSiderCollapse={setPromptSiderCollapse}
        styles={styles}
        isEditing={isEditing}
        promptSiderCollapse={promptSiderCollapse}
        setModel={setModel}
        model={model}
        temperature={temperature}
        setTemperature={setTemperature}
        initialPrompt={initialPrompt}
        setIntialPrompt={setIntialPrompt}
        chatTitle={chatTitle}
        AlwaysScrollToBottom={AlwaysScrollToBottom}
        modelIDToLabel={modelIDToLabel}
        setIsSettingVisible={setIsSettingVisible}
        isSettingVisible={isSettingVisible}
        editref={editref}
        setIsEditing={setIsEditing}
        handleCopyClick={handleCopyClick}
        isCopied={isCopied}
        loading={loading}
        currentPrompt={currentPrompt}
        handlePromptChange={handlePromptChange}
        handleKeypress={handleKeypress}
        stream={stream}
        handleChatStream={handleChatStream}
        handleChatSubmit={handleChatSubmit}
        sendButton={sendButton}
      />

      {/* prompt bar */}
      <aside
        className={`sidebar sm-fixed sm-right-0 sm-top-0 md:static h-screen ${
          promptSiderCollapse
            ? "translate-x-0 w-0"
            : `${isMobileScreen ? "w-3/4 " : "w-[20vw] "}`
        } flex flex-row ease-in-out duration-300 gap-4 z-50`}
      >
        <div
          className={`bg-white w-full relative shadow-md ${
            promptSiderCollapse || "pt-4 pl-4"
          }`}
        >
          <PromptBar open={!promptSiderCollapse} />
        </div>
      </aside>
      <div
        className={`
        ${
          isMobileScreen
            ? promptSiderCollapse
              ? "d-none "
              : "flex "
            : "d-none"
        }
        fixed top-2 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40 cursor-pointer
      `}
        onClick={() => {
          setPromptSiderCollapse(!promptSiderCollapse);
          isMobileScreen && setPromptSiderCollapse(true);
        }}
      >
        <button
          className="absolute top-4 right-3/4 pr-4"
          onClick={() => {
            setPromptSiderCollapse(!promptSiderCollapse);
            isMobileScreen && setPromptSiderCollapse(true);
          }}
          style={{ width: "fit-content", height: "fit-content" }}
        >
          <AiOutlineMenuUnfold size={styles.fileIconSize} color="#fff" />
        </button>
      </div>
      <div
        className={` ${
          isMobileScreen ? (chatSiderCollapse ? "d-none " : "flex ") : "d-none"
        }
        fixed top-2 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40 cursor-pointer
      `}
        onClick={() => {
          setChatSiderCollapse(!chatSiderCollapse);
        }}
      >
        <button
          className="absolute top-4 left-3/4 pl-4"
          onClick={() => {
            setChatSiderCollapse(!chatSiderCollapse);
          }}
          style={{ width: "fit-content", height: "fit-content" }}
        >
          <AiOutlineMenuUnfold size={styles.fileIconSize} color="#fff" />
        </button>
      </div>
    </div>
  );
}
