import { useEffect, useState } from "react";
import arrowIcon from "../../public/icons/arrow-left.svg";
import infoIcon from "../../public/icons/info-icon.svg";
import arrow from "../../public/icons/arrow.svg";
import Button from "../../components/buttons/SearchButton";

import { IoShareSocialOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
export default function Document() {
  const [prompt, setPrompt] = useState("");

  // documentName maintains the state of name of the document
  const [documentName, setDocumentName] = useState("");

  // isSubmitVisible is a boolean variable that determines whether the submit button is visible or not
  const [isSubmitVisible, setIsSubmitVisible] = useState(true);


  // documentData holds the state of prompts, document data, finish reason, etc.
  const styles = {
    input: {
      borderColor: "#D0D5DD",
      placeholderColor: "#667085",
    },
    countColor: "#929DAF",
  };

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
      icon: IoShareSocialOutline,
      onClick: () => {},
      name: 'share'
    },
    {
      icon: MdDeleteOutline,
      onClick: () => {},
      name: 'delete'
    },
  ];

  useEffect(() => {
    // fetch('')
  }, []);
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
            <img src={arrowIcon.src} onClick={handleGoBack}></img>
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
              <img src={infoIcon.src} />
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
              <img src={infoIcon.src} />
            </div>
            <input
              className={`pt-2 pb-2 pl-3 pr-3 border-[${styles.input.borderColor}] border rounded-lg placeholder:[${styles.input.placeholderColor}]`}
              placeholder={"enter keywords"}
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
              <img src={infoIcon.src} />
            </div>
            <div className="flex w-full pt-2 pb-2 pl-3 pr-3 border-[${styles.input.borderColor}] border rounded-lg bg-white">
              <select
                className={`appearance-none w-[98%] cursor-pointer focus:outline-none`}
              >
                <option value="english">English</option>
                <option value="spanish">Hindi</option>
                <option value="french">Telugu</option>
              </select>
              <img src={arrow.src} />
            </div>
          </div>
          <div className="flex flex-col gap-2`"></div>
        </div>
      </div>
      <div className={`w-3/4 grid  grid-rows-[1fr_14fr_1fr]`}>
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
                <div className={`bg-background-secondary p-1 rounded-md cursor-pointer hover:bg-white`}>
                  <actionIcon.icon className={`text-2xl text-black ${actionIcon.name === 'delete' ? "hover:text-[#FF4136]" : "hover:text-[#0074D9]"}`} onClick={actionIcon.onClick}/>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full p-3">
          <textarea className="w-full h-full border border-[#ececf1] rounded-lg outline-none resize-none px-4 py-2" placeholder="write something here">

          </textarea>
          
        </div>
        {/* document actions buttons - 
            1.compose - it will create a request to tagore-server to get the details 
            2.reset - it will reset the document to the initial state    
        */}
        <div className='flex flex-row items-center justify-center gap-2'>
          <Button text="Compose" onClick={() => {}}/>
          <Button text="Reset" onClick={() => {}} background={'button-secondary'} textColor={'black'}/>
        </div>
      </div>
    </div>
  );
}
