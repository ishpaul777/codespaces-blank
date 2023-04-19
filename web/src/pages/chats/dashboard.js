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

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView({ behavior: "smooth" }));
    return <div ref={elementRef} />;
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleChatSubmit();
    }
  };

  return (
    // chat container, it has 2 sections
    // 1. chat list
    // 2. chat component
    <div className={`grid grid-cols-[2fr_8fr] h-[100vh]`}>
      <div className="bg-white h-full flex flex-col justify-between items-center p-7">
        <div className="grid grid-cols-[4fr_1fr] gap-2">
          <button className="py-2 px-3 border rounded-md flex items-center gap-2 cursor-pointer">
            <HiPlus size={styles.iconSize} />
            <span className="text-lg">New Chat</span>
          </button>
          <button className="py-2 px-3 border rounded-md cursor-pointer">
            <MdOutlineCreateNewFolder size={styles.fileIconSize} />
          </button>
        </div>
        {/* <div className="w-full text-center"> 
          <button className="w-4/5 py-4 px-6 border rounded-md flex items-center gap-2 cursor-pointer">
            <HiPlus size={styles.iconSize} /> 
            <span className="text-lg">New Chat</span>
          </button>
        </div> */}
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
          {chat.map((item, index) => (
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
          ))}
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
                onClick={() => handleChatSubmit()}
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
