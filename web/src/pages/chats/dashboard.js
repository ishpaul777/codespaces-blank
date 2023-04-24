import React, { useEffect, useRef, useState } from "react";

import {
  MdOutlineClearAll,
  MdOutlineCreateNewFolder,
  MdKeyboardBackspace,
} from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import { FaRobot } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import sendButton from "../../assets/icons/send-button.svg";
import { BeatLoader, ClipLoader } from "react-spinners";
import ReactMarkdown, { Options } from "react-markdown";
import rehypeMathjax from "rehype-mathjax";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { getChatResponse } from "../../actions/chat";
import { useNavigate } from "react-router-dom";
import { CodeBlock } from "../../components/codeblock";

export default function ChatPage() {
  const navigate = useNavigate();

  const initialPrompt =
    "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";
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

  const [chat, setChat] = useState([]);

  const [chatID, setChatID] = useState(null);

  const [currentPrompt, setCurrentPrompt] = useState("");

  // loading state for chat response
  const [loading, setLoading] = useState(false);

  const handlePromptChange = (e) => {
    setCurrentPrompt(e.target.value);
  };

  const handleChatSubmit = () => {
    setLoading(true);
    let currentMessage = {};
    currentMessage.role = "user";

    if (!chatID) {
      currentMessage.content = initialPrompt + currentPrompt;
    } else {
      currentMessage.content = currentPrompt;
    }

    const newMessages = [...chat, currentMessage];

    setChat(newMessages);
    setCurrentPrompt("");

    getChatResponse(chatID, newMessages, "gpt-3.5-turbo", "openai")
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

  const handleChatStream = () => {
    setLoading(true);
    let currentMessage = {};
    currentMessage.role = "user";

    if (!chatID) {
      currentMessage.content = initialPrompt + currentPrompt;
    } else {
      currentMessage.content = currentPrompt;
    }

    const newMessages = [...chat, currentMessage];

    setChat(newMessages);
    setCurrentPrompt("");

    var url = new URL(
      process.env.REACT_APP_TAGORE_API_URL + "/chat/completions/stream"
    );

    var params = {
      prompt: currentMessage.content,
      chat_id: chatID,
      model: "gpt-3.5-turbo",
      provider: "openai",
    };

    url.search = new URLSearchParams(params).toString();

    const source = new EventSource(url);

    source.onmessage = (event) => {
      if (event.data === "[DONE]") {
        source.close();
        setLoading(false);
        return;
      }

      setChat((prevChat) => {
        // add new message to the chat if the last chat was of the user or update the last chat if the last chat was of the bot
        if (
          prevChat.length === 0 ||
          prevChat[prevChat.length - 1].role === "user"
        ) {
          return [...prevChat, { role: "bot", content: event.data }];
        }
        prevChat[prevChat.length - 1].content += `${event.data}`;
        return [...prevChat];
      });
    };

    source.onerror = (event) => {
      source.close();
      if (String(event.data).includes("[DONE]")) {
        console.log("completed stream");
        setLoading(false);
        return;
      }
      setLoading(false);
    };
  };

  // console.log(chat[chat.length - 1]);
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView({ behavior: "smooth" }));
    return <div ref={elementRef} />;
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleChatStream();
    }
  };

  const [chatHistory, setChatHistory] = useState([]);
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_TAGORE_API_URL}/chat/history?` +
        new URLSearchParams({
          limit: 20,
          offset: 0,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User": 1
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setChatHistory(data.chats);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const maxListChars = 25;
  return (
    // chat container, it has 2 sections
    // 1. chat list
    // 2. chat component
    <div className={`grid grid-cols-[2fr_8fr] h-[100vh]`}>
      <div className="bg-white h-full flex flex-col justify-between items-center p-4">
        <div className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-[4fr_1fr] gap-2 w-full">
            <button className="p-2 hover:bg-light-gray  border rounded-md flex items-center gap-2 cursor-pointer">
              <HiPlus size={styles.iconSize} />
              <span className="text-lg">New Chat</span>
            </button>
            <button className="p-2 border hover:bg-light-gray rounded-md cursor-pointer flex justify-center items-center">
              <MdOutlineCreateNewFolder size={styles.fileIconSize} />
            </button>
          </div>
          <input
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Search prompt"
          ></input>
          <hr class="h-px bg-gray-300 border-0"></hr>
          <ul>
          {
            chatHistory.map((item, index) => {
              return (
                <li className="text-lg">
                  <span>{(item?.messages[0].content?.replace(initialPrompt, ""))?.length < maxListChars ? item?.messages[0].content?.replace(initialPrompt, "") : `${item?.messages[0].content?.replace(initialPrompt, "")}`.slice(0, maxListChars) + '...' }</span>
                  
                </li>
              )
            })
          }
          </ul>
          
        </div>
        <div className="w-full">
          <div className="w-[1px] bg-black"></div>
          <ul className="w-full flex justify-center flex-col">
            {chatOptionsList.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-6 ml-2 px-4 py-2 cursor-pointer rounded-md hover:bg-button-primary"
                onClick={item.onClick}
              >
                {item.icon}
                <span className="text-base">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="h-full grid grid-rows-[9fr_1fr] bg-chat-background">
        <div className="w-full overflow-y-auto flex h-[90vh] flex-col">
          {chat.map((item, index) => {
            // console.log(item.content)
            return (
              <div
                key={index}
                className={`border-b border-[#CED0D4] w-full flex justify-center p-4 ${
                  item.role === "user" && "bg-[#E4E7ED]"
                }`}
              >
                <div className={`w-3/5 grid grid-cols-[1fr_9fr] gap-4`}>
                  <div>
                    {item.role === "user" ? (
                      <AiOutlineUser size={styles.fileIconSize}></AiOutlineUser>
                    ) : (
                      <FaRobot size={styles.fileIconSize}></FaRobot>
                    )}
                  </div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeMathjax]}
                    className="prose"
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");

                        return !inline ? (
                          <CodeBlock
                            key={Math.random()}
                            language={(match && match[1]) || ""}
                            // value={String(children)}
                            value={String(children)?.replace(/\n$/, "")}
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
                    {index === 0
                      ? item.content.replace(initialPrompt, "")
                      : item.content}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}
          <AlwaysScrollToBottom />
          {loading && (
            <div className="flex justify-center mt-4">
              <BeatLoader size={styles.iconSize} color={"#CED0D4"} />
            </div>
          )}
        </div>
        {/* chat input container */}
        <div className="px-8 py-4 w-full flex justify-center items-center">
          {/* input division */}
          <div
            className={`w-4/5 shadow-primary border px-4 py-2 bg-white border-primary rounded-lg grid grid-cols-[9fr_1fr]`}
          >
            <input
              value={currentPrompt}
              className="outline-none text-base"
              placeholder="Type a message"
              onChange={handlePromptChange}
              onKeyDown={handleKeypress}
            ></input>
            <div className="flex flex-row-reverse">
              <button
                className={`flex items-center justify-center`}
                onClick={() => handleChatStream()}
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
      </div>
    </div>
  );
}
