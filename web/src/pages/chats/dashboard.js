import React, { useEffect, useRef, useState } from "react";
import { SSE } from "sse.js";
import { MdOutlineClearAll, MdKeyboardBackspace } from "react-icons/md";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import sendButton from "../../assets/icons/send-button.svg";
import {
  deleteChatByID,
  getChatHistoryByUserID,
  getChatResponse,
} from "../../actions/chat";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../util/toasts";
import PromptBar from "./PromptBar";
import SideBar from "./sidebar.js";
import ChatBar from "./chatbar.js";

export default function ChatPage() {
  const navigate = useNavigate();

  const [stream, setStream] = useState(false);
  const [initialPrompt, setIntialPrompt] = useState("");
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [promptSiderCollapse, setPromptSiderCollapse] = useState(
    !isMobileScreen
  );
  const [chatSiderCollapse, setChatSiderCollapse] = useState(!isMobileScreen);
  const [chatTitle, setChatTitle] = useState("");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsMobileScreen(true);
        setPromptSiderCollapse(true);
        setChatSiderCollapse(true);
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
    value: "",
  });
  const editref = useRef(null);

  // sseClient is the client for the server sent events
  // it is used to get the chat response from the server
  const [sseClient, setSSEClient] = useState(null);

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
    "chat-bison@001": "Chat Bison(Google)",
  };

  const modelIDtoProvider = {
    "gpt-3.5-turbo": "openai",
    "gpt-4": "openai",
    "claude-v1.3": "anthropic",
    "chat-bison@001": "google",
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
      title: "Back to Dashboard",
      icon: <MdKeyboardBackspace size={styles.iconSize} />,
      onClick: () => {
        navigate("/");
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
    setSSEClient(null);
    getChatHistoryByUserID(paginationChatHistory)
      .then((data) => {
        setChatHistory(data.chats);
      })
      .catch((err) => {
        errorToast(err);
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
      messages: newMessages,
      model: model,
      provider: modelIDtoProvider[model],
      temperature: temperature,
      additional_instructions: "Return the content in valid markdown format.",
      stream: false,
    };

    if (chatID) {
      requestBody.id = chatID;
    }

    setChat(newMessages);
    setCurrentPrompt("");

    getChatResponse(requestBody)
      .then((data) => {
        if (!chatID) {
          setChatID(data.id);
        }
        setChat(data?.messages);
      })
      .catch((err) => {
        errorToast(err);
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
      messages: newMessages,
      model: model,
      provider: modelIDtoProvider[model],
      temperature: temperature,
      additional_instructions: "Return the content in valid markdown format.",
      stream: stream,
    };

    if (initialPrompt !== "") {
      requestBody.system_prompt = initialPrompt;
    }

    if (chatID) {
      requestBody.id = chatID;
    }

    var source = new SSE(
      window.REACT_APP_TAGORE_API_URL + "/chat/completions",
      {
        payload: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    setSSEClient(source);

    source.addEventListener("message", (event) => {
      let chatObject = JSON.parse(event.data);
      setChat(chatObject?.messages);
      setChatID(chatObject?.id);
    });

    source.addEventListener("error", (event) => {
      setIsEditing({ status: false, id: null });
      source.close();
      setSSEClient(null);
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
      if (stream && modelIDtoProvider[model] !== "google") {
        handleChatStream();
      } else {
        handleChatSubmit();
      }
    }
  };

  useEffect(() => {
    // get the chat history of the user
    getChatHistoryByUserID(paginationChatHistory)
      .then((data) => {
        setChatHistory(data.chats);
        setChatCount(data.total);
      })
      .catch((err) => {
        errorToast(err);
      });
  }, [paginationChatHistory.page, paginationChatHistory.limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // get the chat history of the user
      getChatHistoryByUserID(paginationChatHistory)
        .then((data) => {
          setChatHistory(data.chats);
        })
        .catch((err) => {
          errorToast(err);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [paginationChatHistory.search_query]);

  // maxListChars is the maximum number of characters that can be shown in the chat list
  // const maxListChars = 15;

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
    deleteChatByID(id)
      .then((response) => {
        successToast(response.message);
        setDeleteChatHistoryIndex(null);
        getChatHistoryByUserID(paginationChatHistory)
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

  const handleChatEdit = (id, messages, index) => {
    setLoading(true);
    var editedMessages = messages?.slice(0, index + 2);
    editedMessages[editedMessages?.length - 1].content = isEditing.value;

    setChat(editedMessages);
    var requestBody = {
      messages: editedMessages,
      model: model,
      provider: modelIDtoProvider[model],
      temperature: temperature,
      additional_instructions: "Return the content in valid markdown format.",
      stream: stream,
      id: id,
    };

    if (stream) {
      var source = new SSE(
        window.REACT_APP_TAGORE_API_URL + "/chat/completions",
        {
          payload: JSON.stringify(requestBody),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSSEClient(source);
      source.addEventListener("message", (event) => {
        let chatObject = JSON.parse(event.data);
        setChat(chatObject?.messages);
        setChatID(chatObject?.id);
      });

      source.addEventListener("error", (event) => {
        setIsEditing({ status: false, id: null });
        source.close();
        setLoading(false);
        setSSEClient(null);
        if (!String(event.data).includes("[DONE]")) {
          return;
        }
      });

      source.stream();
    } else {
      getChatResponse(requestBody)
        .then((data) => {
          if (!chatID) {
            setChatID(data.id);
          }
          setChat(data?.messages);
        })
        .catch((err) => {
          errorToast(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // handleRegenerate is called when the user clicks on the regenerate button
  // it regenerates the chat response
  const handleRegenerate = () => {
    let newMessages = chat.slice(0, chat.length - 1);
    setLoading(true);
    setChat(newMessages);

    var requestBody = {
      messages: newMessages,
      model: model,
      provider: modelIDtoProvider[model],
      temperature: temperature,
      additional_instructions: "Return the content in valid markdown format.",
      stream: stream,
      id: chatID,
    };

    if (stream && modelIDtoProvider[model] !== "google") {
      var source = new SSE(
        window.REACT_APP_TAGORE_API_URL + "/chat/completions",
        {
          payload: JSON.stringify(requestBody),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSSEClient(source);
      source.addEventListener("message", (event) => {
        let chatObject = JSON.parse(event.data);
        setChat(chatObject?.messages);
        setChatID(chatObject?.id);
      });

      source.addEventListener("error", (event) => {
        setIsEditing({ status: false, id: null });
        source.close();
        setSSEClient(null);
        setLoading(false);
        if (!String(event.data).includes("[DONE]")) {
          return;
        }
      });

      source.stream();
    } else {
      requestBody.stream = false;
      getChatResponse(requestBody)
        .then((data) => {
          if (!chatID) {
            setChatID(data.id);
          }
          setChat(data?.messages);
        })
        .catch((err) => {
          errorToast(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // handleStop is called when the user clicks on the 'Stop Generating' button
  // it stops the chat response generation by aborting the sse connection
  const handleStop = () => {
    sseClient?.close();
    setSSEClient(null);
    setIsEditing({ status: false, id: null });
    setLoading(false);
  };

  const handleSubmit = () => {
    if (stream) {
      if (modelIDtoProvider[model] === "google") {
        handleChatSubmit();
      } else {
        handleChatStream();
      }
    } else {
      handleChatSubmit();
    }
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
        setChatSiderCollapse={setChatSiderCollapse}
        handleNewChatClick={handleNewChatClick}
        paginationChatHistory={paginationChatHistory}
        setPaginationChatHistory={setPaginationChatHistory}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
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
        isFolderVisible={true}
      />

      <ChatBar
        chat={chat}
        setChatSiderCollapse={setChatSiderCollapse}
        chatSiderCollapse={chatSiderCollapse}
        handleNewChatClick={handleNewChatClick}
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
        handleChatEdit={handleChatEdit}
        chatID={chatID}
        handleRegenerate={handleRegenerate}
        handleStop={handleStop}
        handleSubmit={handleSubmit}
      />

      {/* prompt bar */}
      <aside
        className={`sidebar sm-fixed sm-right-0 sm-top-0 md:static h-screen ${
          promptSiderCollapse
            ? "translate-x-0 w-0"
            : `${isMobileScreen ? "w-full " : "w-[350px] "}`
        } flex flex-row ease-in-out duration-300 gap-4 z-50`}
      >
        <div
          className={`bg-white w-full relative shadow-md ${
            promptSiderCollapse || "pt-4 pl-4"
          }`}
        >
          <PromptBar
            open={!promptSiderCollapse}
            isFolderVisible={true}
            setPromptSiderCollapse={setPromptSiderCollapse}
          />
        </div>
      </aside>
    </div>
  );
}
