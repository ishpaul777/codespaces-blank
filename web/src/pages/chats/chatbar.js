import React from "react";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import FactlyLogo from "../../assets/icons/factlyLogo";
import { AiOutlineEdit } from "react-icons/ai";
import { BiChevronLeft } from "react-icons/bi";
import { Select, SelectTemperature } from "../../components/inputs/select";
import { Input } from "../../components/inputs/Input";
import { IoMdSettings } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "../../components/codeblock";
import {
  BsClipboard,
  BsClipboard2Check,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { BeatLoader, ClipLoader } from "react-spinners";
import PromptInput from "./PromptInput";
import rehypeMathjax from "rehype-mathjax";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { IoReloadOutline } from "react-icons/io5";
import { GrStop } from "react-icons/gr";
import useDarkMode from "../../hooks/useDarkMode";
// import Dropdown from "../../components/Dropdown";

export default function ChatBar({
  chat,
  setChatSiderCollapse,
  chatSiderCollapse,
  isMobileScreen,
  setPromptSiderCollapse,
  styles,
  isEditing,
  promptSiderCollapse,
  setModel,
  model,
  temperature,
  setTemperature,
  initialPrompt,
  setIntialPrompt,
  AlwaysScrollToBottom,
  handleNewChatClick,
  modelIDToLabel,
  setIsSettingVisible,
  isSettingVisible,
  editref,
  setIsEditing,
  handleCopyClick,
  isCopied,
  loading,
  currentPrompt,
  handlePromptChange,
  handleKeypress,
  stream,
  handleChatStream,
  handleChatSubmit,
  sendButton,
  handleChatEdit,
  chatID,
  handleRegenerate,
  handleStop,
  handleSubmit,
}) {
  const [isPromptModalVisible, setIsPromptModalVisible] = React.useState(false);
  const [isInitialPromptModalVisible, setIsInitialPromptModalVisible] =
    React.useState(false);

  const { darkMode } = useDarkMode();
  return (
    <main
      className={`main flex flex-grow flex-col pb-4 transition-all duration-150 ease-in md:ml-0 w-[80%] ${
        darkMode && "bg-button-primary-alt"
      }`}
    >
      <div className="w-full scrollbar-custom overflow-y-auto flex h-[90vh] flex-col items-center">
        {chat.length === 0 ? (
          <>
            {isMobileScreen ? (
              <div
                className={`sticky ${
                  isMobileScreen ? "px-4" : "px-8"
                } py-4 top-0 w-full mb-1 z-40 bg-white border-b border-b-[#DCE4E7] dark:bg-background-sidebar-alt dark:border-background-sidebar-alt dark:text-white`}
              >
                <div
                  className={`border-none bg-white dark:bg-background-sidebar-alt dark:text-white w-full ${
                    isMobileScreen ? "pt-8 pb-2" : "py-3"
                  } px-4  gap-4 flex justify-between`}
                >
                  <button className="flex items-center">
                    <BiChevronLeft size={24} />
                    <span className="text-lg">Back to Dashboard</span>
                  </button>
                  {/* <BsThreeDotsVertical size={20} /> */}
                  {/* <Dropdown
                    handleNewChatClick={handleNewChatClick}
                    setPromptSiderCollapse={setPromptSiderCollapse}
                    setChatSiderCollapse={setChatSiderCollapse}
                  /> */}
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-row justify-between w-full px-3 pt-4">
                  <button
                    onClick={() => {
                      setChatSiderCollapse(!chatSiderCollapse);
                      isMobileScreen && setPromptSiderCollapse(true);
                    }}
                    style={{ width: "fit-content", height: "fit-content" }}
                  >
                    {chatSiderCollapse ? (
                      <AiOutlineMenuUnfold
                        className={`${darkMode && "text-white"}`}
                        size={styles.fileIconSize}
                      />
                    ) : (
                      <AiOutlineMenuFold
                        className={`${darkMode && "text-white"}`}
                        size={styles.fileIconSize}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setPromptSiderCollapse(!promptSiderCollapse);
                      isMobileScreen && setChatSiderCollapse(true);
                    }}
                    style={{ width: "fit-content", height: "fit-content" }}
                  >
                    {promptSiderCollapse ? (
                      <AiOutlineMenuFold
                        className={`${darkMode && "text-white"}`}
                        size={styles.fileIconSize}
                      />
                    ) : (
                      <AiOutlineMenuUnfold
                        className={`${darkMode && "text-white"}`}
                        size={styles.fileIconSize}
                      />
                    )}
                  </button>
                </div>
              </>
            )}
            <div className="border-none w-full flex flex-col items-center p-4 gap-4">
              <div
                className="md:w-2/5 top-0 sticky border bg-[#F8F8F8] border-[#DEDEDE] dark:bg-background-sidebar-alt dark:border-background-sidebar-alt dark:text-white rounded-lg flex flex-col p-4 gap-4"
                style={{
                  maxWidth: isMobileScreen ? "80vw" : "400px",
                  width: isMobileScreen ? "80vw" : "",
                }}
              >
                <Select
                  label={"Model"}
                  onChange={(e) => {
                    setModel(e.target.value);
                  }}
                  placeholder={"select model"}
                  initialValue={model}
                ></Select>
                <div className=" h-1/2">
                  <label className="text-sm text-black-50 dark:text-white mb-2">
                    System Prompt
                  </label>
                  <div className="bg-transparent w-full rounded-lg p-2 mt-2 border border-[#fff] relative">
                    <PromptInput
                      initialValue={initialPrompt}
                      position={"bottom"}
                      onChange={setIntialPrompt}
                      value={initialPrompt}
                      placeholder={"Enter your system prompt"}
                      onEnter={() => {}}
                      isPromptModalVisible={isInitialPromptModalVisible}
                      setIsPromptModalVisible={setIsInitialPromptModalVisible}
                    />
                  </div>
                </div>
                <SelectTemperature
                  label={"Conversation Style"}
                  onChange={(e) => {
                    setTemperature(parseFloat(e.target.value));
                  }}
                  value={temperature}
                />
              </div>
            </div>
          </>
        ) : (
          <div
            className={`sticky ${
              isMobileScreen ? "px-4" : "px-8"
            } py-4 top-0 w-full mb-1 z-40 bg-white dark:bg-background-sidebar-alt border-b border-b-[#DCE4E7] dark:border-[#3b3b3b]`}
          >
            {/* chat header */}
            {/* <BiChevronLeft size={28} /> */}
            {/* <span className="text-lg font-bold">
              {chatTitle.length < 60
                ? chatTitle
                : `${chatTitle?.slice(0, 60) + "..."}
                        `}
            </span> */}
            <div
              className={`border-none bg-white dark:bg-background-sidebar-alt dark:text-white w-full ${
                isMobileScreen ? "pt-8 pb-2" : "py-2"
              } px-4  gap-4 flex justify-between`}
            >
              {isMobileScreen ? (
                <>
                  <button className="flex">
                    <BiChevronLeft size={20} />
                    <span className="text-sm">Back</span>
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
                  {/* <Dropdown
                    setChatSiderCollapse={setChatSiderCollapse}
                    handleNewChatClick={handleNewChatClick}
                    setPromptSiderCollapse={setPromptSiderCollapse}
                  /> */}
                </>
              ) : (
                <>
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
                  <button
                    onClick={() => setPromptSiderCollapse(!promptSiderCollapse)}
                    style={{ width: "fit-content", height: "fit-content" }}
                  >
                    <AiOutlineMenuUnfold size={styles.fileIconSize} />
                  </button>
                </>
              )}
            </div>

            <div
              className={`bg-white dark:bg-background-sidebar-alt dark:text-white ease-in-out duration-300 ${
                isSettingVisible
                  ? "h-fit p-4 w-full translate-y-100 flex flex-col items-center gap-4"
                  : "h-0 translate-y-0"
              }`}
            >
              {isSettingVisible && (
                <>
                  <div
                    className="md:w-2/5 top-0 sticky border bg-[#F8F8F8] dark:bg-background-secondary-alt border-[#DEDEDE] rounded-lg flex flex-col p-4 gap-4"
                    style={{
                      maxWidth: isMobileScreen ? "80vw" : "400px",
                      width: isMobileScreen ? "80vw" : "",
                    }}
                  >
                    <Select
                      label={"Model"}
                      onChange={(e) => {
                        setModel(e.target.value);
                      }}
                      initialValue={model}
                      disabled={true}
                    ></Select>
                    <Input
                      initialValue={initialPrompt}
                      label={"System Prompt"}
                      onChange={(e) => {
                        setIntialPrompt(e.target.value);
                      }}
                      placeholder={"Enter your system prompt"}
                      disabled={true}
                    ></Input>
                    <SelectTemperature
                      label={"Conversation Style"}
                      onChange={(e) => {
                        setTemperature(parseFloat(e.target.value));
                      }}
                      value={temperature}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {chat
          .filter((item) => item.role !== "system")
          .map((item, index) => {
            return (
              <div
                key={index}
                className={`rounded-lg my-1 border-[#CED0D4] w-11/12 flex items-center justify-between ${
                  isMobileScreen ? "px-4" : "px-7"
                } py-6 ${
                  item.role === "user"
                    ? "dark:text-white bg-[#ECEDF1] dark:bg-transparent"
                    : "dark:bg-[#4A4A4A] dark:text-white bg-[#E4E7ED]"
                }
                  dark:text-white
                  `}
              >
                <div className={`w-full flex gap-4`}>
                  {item.role === "user" ? (
                    <div
                      className={`flex justify-center items-center h-8 w-8 rounded-full ring-2
                        ${
                          item.role === "user"
                            ? "bg-green-600 ring-green-600"
                            : ""
                        } text-white mr-2`}
                    >
                      <span className="text-lg"> U </span>
                    </div>
                  ) : (
                    <FactlyLogo />
                  )}
                  {isEditing.status && isEditing.id === index ? (
                    <div className="w-[85%] flex flex-col justigy-center">
                      <textarea
                        ref={editref}
                        className="bg-transparent p-2 outline-none text-base border-b boder-black dark:border-white resize-none focus:ring-0 h-auto scrollbar-hide pt-1"
                        autoFocus={true}
                        defaultValue={item.content}
                        onChange={(e) => {
                          setIsEditing({
                            ...isEditing,
                            value: e.target.value,
                          });
                        }}
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
                            handleChatEdit(chatID, chat, index);
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
                      className={`prose dark:prose-invert ${
                        isMobileScreen
                          ? "max-w-[17rem]"
                          : chatSiderCollapse || promptSiderCollapse
                          ? "w-[80%]"
                          : "max-w-2xl"
                      } ${darkMode ? "text-white" : ""}`}
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
                        setIsEditing({
                          status: !isEditing.status,
                          id: isEditing.status ? null : index,
                        });
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
        {loading && (
          <div className="flex justify-center mt-4">
            <AlwaysScrollToBottom />
            <BeatLoader size={styles.iconSize} color={"#CED0D4"} />
          </div>
        )}
      </div>
      {/* chat input container */}
      <div
        className="py-4 w-full flex flex-col justify-center items-center z-20 gap-4"
        style={{ zIndex: isInitialPromptModalVisible ? -1 : 0 }}
      >
        {/* input division */}
        {loading && (
          <button
            className="bg-white dark:bg-background-sidebar-alt dark:text-white dark:shadow-black shadow-primary px-3 py-2 rounded-md text-sm flex items-center gap-2"
            onClick={handleStop}
          >
            <GrStop color="#000" size={"16px"} />
            Stop Generating
          </button>
        )}
        {!loading && chat?.length >= 2 && (
          <button
            className="bg-white dark:bg-background-sidebar-alt dark:text-white dark:shadow-black shadow-primary px-3 py-2 rounded-md text-sm flex items-center gap-2"
            onClick={handleRegenerate}
          >
            <IoReloadOutline size={"16px"} />
            Regenerate Response
          </button>
        )}
        <div
          className={`w-11/12 relative shadow-primary border px-4 py-2 bg-white border-primary dark:bg-background-sidebar-alt dark:border-background-sidebar-alt dark:text-white rounded-lg grid grid-cols-[9fr_1fr] max-h-96 dark:shadow-[#3b3b3b] `}
        >
          <PromptInput
            value={currentPrompt}
            className="outline-none text-base border-none focus:ring-0"
            placeholder="Type a message"
            onChange={handlePromptChange}
            isPromptModalVisible={isPromptModalVisible}
            setIsPromptModalVisible={(value) => setIsPromptModalVisible(value)}
            position={"top"}
            onEnter={handleKeypress}
          ></PromptInput>
          <div className="flex flex-row-reverse">
            <button
              className={`flex items-center justify-center`}
              onClick={() => handleSubmit()}
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
  );
}
