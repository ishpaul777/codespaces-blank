import React, { useEffect, useRef, useState } from "react";
import FactlyLogo from "../../assets/icons/factlyLogo";
import { AiOutlineEdit, AiOutlineMenuUnfold } from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "../../components/codeblock";
import { BsClipboard, BsClipboard2Check } from "react-icons/bs";
import { BeatLoader, ClipLoader } from "react-spinners";
import PromptInput from "../chats/PromptInput";
import rehypeMathjax from "rehype-mathjax";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import SideBar from "../chats/sidebar";
import sendButton from "../../assets/icons/send-button.svg";

import {
  // MdOutlineCreateNewFolder,
  MdKeyboardBackspace,
} from "react-icons/md";
import { IoReloadOutline } from "react-icons/io5";
import useSocket from "../../util/useSocket";
import { useNavigate } from "react-router-dom";
import { GrStop } from "react-icons/gr";

const styles = {
  fileIconSize: "24px",
  iconSize: "20px",
};

export const PersonaSachChat = () => {
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const editref = useRef(null);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [streaming, setStreaming] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [chatSiderCollapse, setChatSiderCollapse] = useState(!isMobileScreen);

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

  const socket = useSocket("wss://sach-chat-server.factly.in/api/v1/chat");
  useEffect(() => {
    const processWebSocketResponse = (data) => {
      setChatLoading(true);
      if (
        data.type === "body"
        //  && data.sender !== 'system'
      ) {
        return; // Ignore body messages
      }

      let updatedMessages = [...messages];

      if (data.sender === "ai") {
        setChatLoading(false);
        setStreaming(true);
        if (data.type === "start") {
          // Start a new AI message
          updatedMessages.push({ sender: "ai", content: "" });
        } else if (data.type === "stream") {
          // Combine content of stream messages into the latest AI message
          const aiMessages = updatedMessages.filter(
            (message) => message.sender === "ai"
          );
          const lastAiMessage = aiMessages[aiMessages.length - 1];
          if (lastAiMessage) {
            lastAiMessage.content += data.content;
          }
        } else if (data.type === "end") {
          setStreaming(false);
          // Finish the last AI message by trimming trailing whitespace
          const aiMessages = updatedMessages.filter(
            (message) => message.sender === "ai"
          );
          const lastAiMessage = aiMessages[aiMessages.length - 1];
          if (lastAiMessage) {
            lastAiMessage.content = lastAiMessage.content.trim();
          }
        }
      } else if (data.sender === "human") {
        // Add user message to the messages array
        const userMessage = { sender: "human", content: data.content };
        updatedMessages.push(userMessage);
      }

      setMessages(updatedMessages);
    };
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        processWebSocketResponse(message);
      };
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (content) => {
    if (socket && content) {
      const message = {
        sender: "human",
        content: content,
      };
      socket.send(JSON.stringify(message));
      setCurrentPrompt("");
    }
  };

  const handleSendMessage = (lastMessage) => {
    const newMessage = {
      content: lastMessage ? lastMessage : currentPrompt,
      sender: "human",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    sendMessage(newMessage.content);
  };

  const handleCopyClick = (content) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };

  return (
    <div className="flex min-h-screen max-h-screen flex-row bg-gray-100 text-gray-800 dark:text-white dark:bg-background-secondary-alt">
      {
        <>
          <SideBar
            isMobileScreen={isMobileScreen}
            chatSiderCollapse={chatSiderCollapse}
            setChatSiderCollapse={setChatSiderCollapse}
            handleNewChatClick={() => {}}
            paginationChatHistory={{
              limit: 12,
              page: 1,
              search_query: "",
            }}
            setPaginationChatHistory={() => {}}
            chatHistory={[]}
            setChat={[]}
            setChatID={1}
            setIsEditing={false}
            chatID={1}
            setChatTitle={() => {}}
            deleteChatHistoryIndex={() => {}}
            handleChatDelete={() => {}}
            setDeleteChatHistoryIndex={() => {}}
            handleHistoryDeleteClick={() => {}}
            chatCount={1}
            chatOptionsList={[
              {
                title: "Go back to personas",
                icon: <MdKeyboardBackspace size={styles.iconSize} />,
                onClick: () => {
                  navigate("/personas");
                },
              },
            ]}
            isFolderVisible={false}
          />
          <main className="main flex flex-grow flex-col pb-4 transition-all duration-150 ease-in md:ml-0 w-full">
            <div
              className="relative w-full scrollbar-custom overflow-y-auto flex h-[90vh] flex-col items-center"
              ref={chatContainerRef}
            >
              <div
                className={`sticky px-8 py-4 top-0 w-full mb-1 bg-body z-[999] dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b]
                ${
                  isMobileScreen
                    ? chatSiderCollapse
                      ? "flex"
                      : "hidden"
                    : "flex"
                }
              `}
              >
                {/* chat header */}
                {/* <BiChevronLeft size={28} /> */}
                <div className="dark:text-white text-[1e1e1e] mr-2">
                  <button onClick={() => setChatSiderCollapse((prev) => !prev)}>
                    <AiOutlineMenuUnfold size={styles.fileIconSize} />
                  </button>
                </div>
                <span className="text-lg font-bold px-8">Sach Fact Check</span>
              </div>
              <div className="absolute top-[20px] left-[15px] z-9">
                <button onClick={() => {}}>
                  <AiOutlineMenuUnfold
                    size={styles.fileIconSize}
                    color="#1e1e1e"
                  />
                </button>
              </div>
              <div
                className={` ${false ? (false ? "d-none " : "flex ") : "d-none"}
        fixed top-2 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40 cursor-pointer
      `}
                onClick={() => {
                  // setChatSiderCollapse(!false);
                }}
              >
                <button
                  className="absolute top-4 left-3/4 pl-4"
                  onClick={() => {
                    // setChatSiderCollapse(!false);
                  }}
                  style={{ width: "fit-content", height: "fit-content" }}
                >
                  <AiOutlineMenuUnfold
                    size={styles.fileIconSize}
                    color="#fff"
                  />
                </button>
              </div>
              {messages.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`rounded-lg my-1 dark:text-white border-[#CED0D4] w-11/12 flex items-center justify-between px-7 py-6 ${
                      item.role === "user"
                        ? "dark:text-white bg-[#ECEDF1] dark:bg-transparent"
                        : "dark:bg-[#4A4A4A] dark:text-white bg-[#E4E7ED]"
                    }`}
                  >
                    <div className={`w-full flex gap-4`}>
                      <div
                        className={`flex justify-center items-center  h-8 w-8 rounded-full ring-2 ${
                          item.sender === "human"
                            ? "bg-green-600 ring-green-600"
                            : "ring-red-600 bg-red-600"
                        } text-white mr-2`}
                      >
                        {item.sender === "human" ? (
                          <span className="text-lg"> U </span>
                        ) : (
                          <FactlyLogo />
                        )}
                      </div>
                      {editIndex === index ? (
                        <div className="w-[85%] flex flex-col justigy-center">
                          <textarea
                            ref={editref}
                            className="bg-transparent p-2 outline-none text-base border-b boder-black dark:border-white resize-none focus:ring-0 h-auto scrollbar-hide pt-1"
                            autoFocus={true}
                            style={{
                              borderBottom: "1px solid #000",
                            }}
                            onChange={(e) => {
                              setEditPrompt(e.target.value);
                            }}
                            defaultValue={item.content}
                          />
                          <div className="flex justify-center items-center gap-4 mt-2">
                            <button
                              className="flex items-center justify-center  bg-black px-3 py-3 rounded-md text-white"
                              onClick={() => {
                                setEditIndex(-1);
                                setMessages((prevMessages) => {
                                  prevMessages.splice(index);
                                  return prevMessages;
                                });
                                setEditPrompt("");
                                handleSendMessage(editPrompt);
                              }}
                            >
                              {" "}
                              Save & Submit
                            </button>
                            <button
                              className="flex items-center justify-center border-[#eee] "
                              onClick={() => {
                                setEditIndex(-1);
                                setCurrentPrompt("");
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
                          className={`prose dark:text-white ${
                            false
                              ? "max-w-[17rem]"
                              : false
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
                      {item.sender !== "human" ? (
                        <button
                          className="flex items-center justify-center text-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyClick(item.content);
                          }}
                        >
                          {isCopied ? <BsClipboard2Check /> : <BsClipboard />}
                        </button>
                      ) : true ? (
                        <button
                          className="flex items-center justify-center text-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditIndex(index);
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
                  <BeatLoader size={styles.iconSize} color={"#CED0D4"} />
                </div>
              )}
            </div>
            {/* chat input container */}
            <div className="py-4 w-full flex flex-col gap-4 justify-center items-center">
              {/* {chatLoading && (
								<button
									className="bg-white shadow-primary px-3 py-2 rounded-md text-sm flex items-center gap-2"
									onClick={() => {
										socket?.close();
										setChatLoading(false);
									}}
								>
									<GrStop color="#000" size={"16px"} />
									Stop Generating
								</button>
							)} */}
              {!chatLoading && !streaming && messages?.length >= 2 && (
                <button
                  className="bg-white dark:bg-background-sidebar-alt dark:text-white dark:shadow-black shadow-primary px-3 py-2 rounded-md text-sm flex items-center gap-2"
                  onClick={() => {
                    let lastMessage;
                    setMessages((prevMessages) => {
                      lastMessage =
                        prevMessages[prevMessages.length - 2].content;
                      prevMessages.splice(prevMessages.length - 2);
                      return prevMessages;
                    });
                    handleSendMessage(lastMessage);
                  }}
                >
                  <IoReloadOutline color="#000" size={"16px"} />
                  Regenerate Response
                </button>
              )}
              <div
                className={`w-11/12 relative shadow-primary border px-4 py-2 bg-white border-primary dark:bg-background-sidebar-alt dark:border-[#3b3b3b] dark:shadow-none  rounded-lg grid grid-cols-[9fr_1fr] max-h-96`}
              >
                <PromptInput
                  value={currentPrompt}
                  className="outline-none text-base border-none focus:ring-0"
                  placeholder="Type a message"
                  onChange={(value) => {
                    setCurrentPrompt(value);
                  }}
                  onEnter={(e) => {
                    //it triggers by pressing the enter key
                    if (e.keyCode === 13) {
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex flex-row-reverse">
                  <button
                    className={`flex items-center justify-center`}
                    onClick={() => handleSendMessage()}
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
      }
    </div>
  );
};
