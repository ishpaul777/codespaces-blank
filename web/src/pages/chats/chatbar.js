import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import FactlyLogo from "../../assets/icons/factlyLogo";
import { AiOutlineEdit } from "react-icons/ai";
import { Select, SelectTemperature } from "../../components/inputs/select";
import { Input } from "../../components/inputs/Input";
import { IoMdSettings } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "../../components/codeblock";
import { BsClipboard, BsClipboard2Check } from "react-icons/bs";
import { BeatLoader, ClipLoader } from "react-spinners";
import PromptInput from "./PromptInput";
import rehypeMathjax from "rehype-mathjax";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { IoReloadOutline } from "react-icons/io5";
import { GrStop } from "react-icons/gr";

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
  chatTitle,
  AlwaysScrollToBottom,
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
}) {
  return (
    <main className="main flex flex-grow flex-col pb-4 transition-all duration-150 ease-in md:ml-0 w-[80%] ">
      <div className="w-full scrollbar-custom overflow-y-auto flex h-[90vh] flex-col items-center">
        {chat.length === 0 ? (
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
                  <AiOutlineMenuUnfold size={styles.fileIconSize} />
                ) : (
                  <AiOutlineMenuFold size={styles.fileIconSize} />
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
                  <AiOutlineMenuFold size={styles.fileIconSize} />
                ) : (
                  <AiOutlineMenuUnfold size={styles.fileIconSize} />
                )}
              </button>
            </div>
            <div className="border-none w-full flex flex-col items-center p-4 gap-4">
              <div
                className="md:w-2/5 top-0 sticky border bg-[#F8F8F8] border-[#DEDEDE] rounded-lg flex flex-col p-4 gap-4"
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
                    setTemperature(parseFloat(e.target.value));
                  }}
                  value={temperature}
                />
              </div>
            </div>
          </>
        ) : (
          <div className={`sticky ${isMobileScreen ? "px-4" :"px-8"} py-4 top-0 w-full mb-1 z-40 bg-body`}>
            {/* chat header */}
            {/* <BiChevronLeft size={28} /> */}
            {/* <span className="text-lg font-bold">
              {chatTitle.length < 60
                ? chatTitle
                : `${chatTitle?.slice(0, 60) + "..."}
                        `}
            </span> */}
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
                  onClick={() => setIsSettingVisible((prevState) => !prevState)}
                  cursor={"pointer"}
                />
              </div>
              <button
                onClick={() => setPromptSiderCollapse(!promptSiderCollapse)}
                style={{ width: "fit-content", height: "fit-content" }}
              >
                <AiOutlineMenuUnfold size={styles.fileIconSize} />
              </button>
            </div>

            <div
              className={`bg-body ease-in-out duration-300 ${isSettingVisible
                ? "h-fit p-4 w-full translate-y-100 flex flex-col items-center gap-4"
                : "h-0 translate-y-0"
                }`}
            >
              {isSettingVisible && (
                <>
                  <div
                    className="md:w-2/5 top-0 sticky border bg-[#F8F8F8] border-[#DEDEDE] rounded-lg flex flex-col p-4 gap-4"
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
                className={`rounded-lg my-1 border-[#CED0D4] w-11/12 flex items-center justify-between ${isMobileScreen ? "px-4" :"px-7"} py-6 ${item.role === "user" ? "bg-[#ECEDF1]" : "bg-[#E4E7ED]"
                  }`}
              >
                <div className={`w-full flex gap-4`}>
                  {
                    item.role === "user" ?
                      <div
                        className={`flex justify-center items-center h-8 w-8 rounded-full ring-2
                        ${item.role === "user" ? "bg-green-600 ring-green-600" : ""} text-white mr-2`}
                      >
                        <span className="text-lg"> U </span>
                      </div>
                      : <FactlyLogo />
                  }
                  {isEditing.status && isEditing.id === index ? (
                    <div className="w-[85%] flex flex-col justigy-center">
                      <textarea
                        ref={editref}
                        className="bg-transparent p-2 outline-none text-base border-none focus:ring-0 h-auto scrollbar-hide pt-1"
                        autoFocus={true}
                        style={{
                          borderBottom: "1px solid #000",
                        }}
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
                      className={`prose ${isMobileScreen
                        ? "max-w-[15rem]"
                        : chatSiderCollapse || promptSiderCollapse
                          ? "w-[80%]"
                          : "max-w-2xl"
                        } `}
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
      <div className="py-4 w-full flex flex-col gap-2 justify-center items-center">
        {/* input division */}
        {loading && (
          <button
            className="bg-white shadow-primary px-3 py-2 rounded-md text-sm flex items-center gap-2"
            onClick={handleStop}
          >
            <GrStop color="#000" size={"16px"} />
            Stop Generating
          </button>
        )}
        {!loading && chat?.length >= 2 && (
          <button
            className="bg-white shadow-primary px-3 py-2 rounded-md text-sm flex items-center gap-2"
            onClick={handleRegenerate}
          >
            <IoReloadOutline color="#000" size={"16px"} />
            Regenerate Response
          </button>
        )}
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
  );
}
