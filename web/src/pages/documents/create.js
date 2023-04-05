import { useEffect, useState } from "react";
import ArrowIcon from "../../assets/icons/arrow.svg";
import InfoIcon from "../../assets/icons/info-icon.svg";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import Button from "../../components/buttons/SearchButton";
import { ScooterCore } from "@factly/scooter-core";

import { IoShareSocialOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { DocActionButton } from "../../components/buttons/DocActionButton";
import { SizeButton } from "../../components/buttons/SizeButton";
import { BiSave } from "react-icons/bi";

export default function Document() {
  const [prompt, setPrompt] = useState("");

  // documentName maintains the state of name of the document
  const [documentName, setDocumentName] = useState("");

  // isSubmitVisible is a boolean variable that determines whether the submit button is visible or not
  const [isSubmitVisible, setIsSubmitVisible] = useState(true);

  // keywords maintains the state of keywords for the prompt
  const [keywords, setKeywords] = useState("");

  // editor is a reference to the editor instance
  const [editor, setEditor] = useState(null);

  // loading is a boolean variable which determines whether the backend is composing something or not
  const [loading, setLoading] = useState(false);

  // continueButtonState is a boolean variable which determines different attributes of the continue button
  const [continueButtonState, setContinueButtonState] = useState({
    visibility: false,
  });

  // documentData holds the state of prompts, document data, finish reason, etc.
  const styles = {
    input: {
      borderColor: "#D0D5DD",
      placeholderColor: "#667085",
    },
    countColor: "#929DAF",
  };

  const [editorData, setEditorData] = useState(``);

  const [promptData, setPromptData] = useState(``);

  const handleGoBack = () => {
    window.location.href = "/documents";
  };

  const handlePromptChange = (value) => {
    setPrompt(value);
  };

  //onNameEdit is a callback function that is called when the user clicks on the edit button
  const onNameEdit = () => {
    setIsSubmitVisible(true);
  };

  // onNameSubmit is a callback function that is called when the user clicks on the submit button
  const onNameSubmit = () => {
    setIsSubmitVisible(false);
  };

  // onNameChange is a callback function that is called when the user changes the name of the document
  const onNameChange = (value) => {
    setDocumentName(value);
  };

  const actionList = [
    {
      icon: BiSave,
      onClick: () => {},
      name: "save",
    },
    {
      onClick: () => {},
      icon: IoShareSocialOutline,
      name: "share",
    },
    {
      icon: MdDeleteOutline,
      onClick: () => {},
      name: "delete",
    },
  ];

  const generatePrompt = () => {
    let mainPrompt = prompt;

    let nOfKeywords = 0;
    if (keywords !== "") {
      nOfKeywords = keywords.split(",").length;
    }

    if (nOfKeywords) {
      let keyWordPrompt = ". It should have keywords like ";
      keywords.split(",").forEach((keyword, index) => {
        if (index === nOfKeywords - 1) {
          keyWordPrompt += `${keyword}`;
        } else {
          keyWordPrompt += `${keyword},`;
        }
      });
      mainPrompt += keyWordPrompt;
    }

    let htmlPrompt = `. You are used for text editor and the text editor renders only HTML, so please return using HTML tags without newline tags. For example -     <h1>Heading</h1>
        <h2>Subheading</h2>
        <p>This is some text.</p>
    `;

    mainPrompt += htmlPrompt;
    return mainPrompt;
  };

  const handleCompose = () => {
    const prompt = generatePrompt();
    setLoading(true);
    fetch(`${process.env.REACT_APP_TAGORE_API_URL}/prompts/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User": 1,
      },
      body: JSON.stringify({
        input: prompt,
        max_tokens: selectedOutputLength.length,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let clean_html_string = data?.output.replace(/\s+/g, " ");
        setPromptData(clean_html_string);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // inserting the prompt data in the editor when the promptData state variable would change
    editor?.commands.insertContent(promptData);
  }, [promptData]);

  const [selectedOutputLength, setSelectedOutputLength] = useState({
    length: 200,
    name: "S",
  });

  const [customLength, setCustomLength] = useState(0);

  // outputLengthList is a list of output length options
  let outputLengthList = [
    {
      maxLength: 200,
      title: "S",
    },
    {
      maxLength: 400,
      title: "M",
    },
    {
      maxLength: 600,
      title: "L",
    },
    {
      title: "Custom",
      maxLength: customLength,
    },
  ];

  // handleChangeInOutputSize is a handler for output length actions
  const handleChangeInOutputSize = (maxSize, title, isCustom) => {
    if (isCustom) {
      setSelectedOutputLength({ length: maxSize, name: title });
    } else {
      setSelectedOutputLength({ length: maxSize, name: title });
    }
  };

  // handleCustomLengthChange is a handler for custom length input
  const handleCustomLengthChange = (value) => {
    let valueInInt = parseInt(value);
    if (isNaN(valueInInt)) {
      valueInInt = 0;
    }
    setCustomLength(valueInInt);
    setSelectedOutputLength({ length: valueInInt, name: "Custom" });
  };

  return (
    // container for new/edit document page
    <div className="h-screen w-full flex">
      {/* this is control section, it will have a prompt input, keyword input, language input and output length */}
      <div className={`w-1/4 bg-background-sidebar`}>
        {/* actions container */}
        <div className="p-10 cursor-pointer flex flex-col gap-11">
          {/* image container */}
          <div>
            {/* backbutton icon */}
            <img src={ArrowLeft} onClick={handleGoBack} alt="arrow-left"></img>
          </div>
          {/* input division - each input division will have label, a form input type and input-length counter */}
          {/* prompt section */}
          <div className={`flex flex-col gap-2`}>
            {/* label division*/}
            <div className="flex gap-2">
              <label
                htmlFor="contentDescription"
                className={`font-medium text-form-label text-sm`}
              >
                Content description / brief
              </label>
              <img src={InfoIcon} alt="info-icon" />
            </div>
            <textarea
              className={`pt-2 pb-2 pl-3 pr-3 border-[${styles.input.borderColor}] border rounded-lg resize-none h-32 placeholder:[${styles.input.placeholderColor}]`}
              placeholder="Write an article about..."
              maxLength={600}
              onChange={(e) => handlePromptChange(e.target.value)}
            ></textarea>
            <div className="flex flex-row-reverse">
              <p
                className={`text-[${styles.countColor}]`}
              >{`${prompt?.length}/600`}</p>
            </div>
          </div>
          {/* keywords section */}
          <div className={`flex flex-col gap-2`}>
            <div className="flex gap-2">
              <label
                htmlFor="keywords"
                className={`font-medium text-form-label text-sm`}
              >
                {" "}
                Keywords{" "}
              </label>
              <img src={InfoIcon} alt="info-icon" />
            </div>
            <input
              className={`pt-2 pb-2 pl-3 pr-3 border-[${styles.input.borderColor}] border rounded-lg placeholder:[${styles.input.placeholderColor}]`}
              placeholder={"enter keywords"}
              onChange={(e) => setKeywords(e.target.value)}
            ></input>
          </div>
          {/* languages section */}
          <div className={`flex flex-col gap-2`}>
            <div className="flex gap-2">
              <label
                htmlFor="languages"
                className={`font-medium text-form-label text-sm`}
              >
                Select language
              </label>
              <img src={InfoIcon} alt="info-icon" />
            </div>
            <div className="flex w-full pt-2 pb-2 pl-3 pr-3 border-[${styles.input.borderColor}] border rounded-lg bg-white">
              <select
                className={`appearance-none w-[98%] cursor-pointer focus:outline-none`}
              >
                <option value="english">English</option>
                <option value="spanish">Hindi</option>
                <option value="french">Telugu</option>
              </select>
              <img src={ArrowIcon} />
            </div>
          </div>
          {/* languages section */}
          <div className={`flex flex-col gap-2`}>
            <div className="flex gap-2">
              <label
                htmlFor="languages"
                className={`font-medium text-form-label text-sm`}
              >
                Output length
              </label>
              <img src={InfoIcon} alt="info-icon" />
            </div>
            <div className="flex gap-1">
              {outputLengthList.map((item, index) => {
                let isCustom = item.title === "Custom";
                return (
                  <SizeButton
                    clickAction={handleChangeInOutputSize}
                    key={index}
                    title={item.title}
                    isSelected={
                      isCustom
                        ? customLength === selectedOutputLength.length
                        : item.maxLength === selectedOutputLength.length
                    }
                    maxSize={isCustom ? customLength : item.maxLength}
                    isCustom={isCustom}
                  />
                );
              })}
            </div>
            {selectedOutputLength.name === "Custom" && (
              <input
                className="p-2 rounded border"
                type="number"
                placeholder="enter custom output length"
                onChange={(e) => handleCustomLengthChange(e.target.value)}
                defaultValue={customLength}
              />
            )}
          </div>
          {/* document actions buttons - 
            1.compose - it will create a request to tagore-server to get the details 
            2.reset - it will reset the document to the initial state    
        */}
          <div className="w-full flex flex-col gap-2">
            <DocActionButton
              isLoading={loading}
              text={"Compose"}
              clickAction={() => handleCompose()}
              isPrimary={true}
            ></DocActionButton>
            {continueButtonState.visibility && (
              <DocActionButton
                isLoading={false}
                text={"Continue Generating"}
                clickAction={() => handleCompose()}
                isPrimary={true}
              ></DocActionButton>
            )}
            <DocActionButton
              text={"Reset"}
              clickAction={() => editor?.commands.setContent("")}
              isPrimary={false}
            ></DocActionButton>
          </div>
        </div>
      </div>
      <div className={`w-3/4 grid  grid-rows-[1fr_14fr]`}>
        {/* this is the header section in create document page. It has mainly 2 elements - 1. File Name input box and 2. actions - [share, delete, save]*/}
        <div className="w-full py-3 px-6 flex justify-between border-b border-border-secondary">
          <div
            className={`w-3/5 flex flex-row items-center ${
              !isSubmitVisible && "gap-4"
            }`}
          >
            {isSubmitVisible ? (
              <>
                <input
                  defaultValue={documentName}
                  placeholder="enter the file name"
                  className="outline-none w-2/5"
                  onChange={(e) => onNameChange(e.target.value)}
                ></input>
                <Button text="Submit" onClick={onNameSubmit}></Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{documentName}</h3>
                <Button text="Edit" onClick={onNameEdit} />
              </>
            )}
          </div>
          {/* action div */}
          <div className="flex flex-row items-center gap-4">
            {actionList.map((actionIcon) => {
              return (
                // action icon container
                <div
                  className={`bg-background-secondary p-1 rounded-md cursor-pointer hover:bg-white`}
                >
                  <actionIcon.icon
                    className={`text-2xl text-black ${
                      actionIcon.name === "delete"
                        ? "hover:text-[#FF4136]"
                        : "hover:text-[#0074D9]"
                    }`}
                    onClick={actionIcon.onClick}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full py-1">
          <ScooterCore
            placeholder="Write your content here. Press / for commands and /generate for AI commands"
            editorInstance={(editor) => setEditor(editor)}
            initialValue={editorData}
            heightStrategy="flexible"
            menuType="bubble"
            onChange={(change) => {
              setEditorData(change?.html);
            }}
          />
        </div>
      </div>
    </div>
  );
}
