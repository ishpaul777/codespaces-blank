import { useEffect, useState } from "react";
import ArrowIcon from "../../assets/icons/arrow.svg";
import InfoIcon from "../../assets/icons/info-icon.svg";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import Button from "../../components/buttons/SearchButton";
import { ScooterCore } from "@factly/scooter-core";
// import { IoShareSocialOutline } from "react-icons/io5";
// import { MdDeleteOutline } from "react-icons/md";
import { DocActionButton } from "../../components/buttons/DocActionButton";
import { SizeButton } from "../../components/buttons/SizeButton";
import {
  createDocument,
  deleteDocument,
  generateTextFromPrompt,
  getDocumentByID,
  updateDocument,
} from "../../actions/text";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SSE } from "sse.js";
import { ToastContainer } from "react-toastify";
import { errorToast, successToast } from "../../util/toasts";
export default function Document() {
  const [searchParams] = useSearchParams();

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

  // id stores the id of the document
  const [id, setID] = useState("" || searchParams.get("id"));

  // isEdit is a boolean variable which determines whether the document is being edited or not
  const [isEdit, setIsEdit] = useState(false || searchParams.get("isEdit"));

  // const [stream, setStream] = useState(true);
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

  const navigate = useNavigate();
  const [editorData, setEditorData] = useState(``);

  const [promptData, setPromptData] = useState(``);

  // language stores the language of the document
  const [language, setLanguage] = useState("english");

  const handleGoBack = () => {
    navigate("/documents");
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
      onClick: () => {
        if (documentName === "") {
          errorToast("document name cannot be empty");
          return;
        }

        if (editor?.getHTML() === "") {
          errorToast("document content cannot be empty");
          return;
        }

        let requestBody = {
          title: documentName,
          description: editor?.getHTML(),
        };

        if (id && isEdit) {
          updateDocument(id, requestBody)
            .then(() => {
              successToast("document updated successfully");
            })
            .catch(() => {
              errorToast("error in updating document");
            });
        } else {
          createDocument(requestBody)
            .then((response) => {
              navigate(`/documents/create?id=${response?.id}&isEdit=true`);
              successToast("document created successfully");
            })
            .catch(() => {
              errorToast("error in creating document");
            });
        }
      },
      name: "Save",
    },
    {
      onClick: () => {
        if (id && isEdit) {
          deleteDocument(id)
            .then(() => {
              successToast("document deleted successfully");
              setTimeout(() => {
                navigate("/documents");
              }, 1000);
            })
            .catch(() => {
              errorToast("error in deleting document");
            });
        } else {
          errorToast("document not created yet");
        }
      },
      name: "Delete",
    },
  ];

  const handleCompose = () => {
    let inputPrompt = `${prompt}.`;
    if (keywords) {
      inputPrompt += ` It should have keywords like ${keywords}.`;
    }

    if (language) {
      inputPrompt += ` It should be in ${language}.`;
    }

    setLoading(true);
    let source = new SSE(
      window.REACT_APP_TAGORE_API_URL + "/prompts/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        payload: JSON.stringify({
          input: inputPrompt,
          generate_for: "",
          provider: "openai",
          stream: true,
          model: "gpt-3.5-turbo", //"gpt-3.5-turbo",
          additional_instructions:
            "The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text.",
          max_tokens: 2000,
        }),
      }
    );

    source.addEventListener("message", (event) => {
      let docObject = JSON.parse(event.data);
      setPromptData(docObject?.output);
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

  useEffect(() => {
    // inserting the prompt data in the editor when the promptData state variable would change
    editor?.commands?.setContent(promptData);
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

  useEffect(() => {
    if (id && isEdit) {
      getDocumentByID(id)
        .then((response) => {
          setDocumentName(response?.title);
          setIsSubmitVisible(false);
          setPromptData(response?.description);
        })
        .catch((error) => {
          errorToast("error in fetching document");
        });
    }
  }, []);

  useEffect(() => {
    setID(searchParams?.get("id"));
    setIsEdit(searchParams?.get("isEdit"));
  }, [searchParams]);

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
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="telugu">Telugu</option>
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
              clickAction={() => editor?.commands?.setContent("")}
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
                  placeholder="enter title for the document"
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
                <>
                  {actionIcon.name === "Delete" ? (
                    <div
                      className={`bg-background-secondary py-2 px-4 rounded-md cursor-pointer hover:bg-[#FF0000] hover:text-white`}
                      onClick={() => actionIcon.onClick()}
                    >
                      {actionIcon.name}
                    </div>
                  ) : (
                    <div
                      className={`bg-background-secondary py-2 px-4 rounded-md cursor-pointer hover:bg-[#007BFF] hover:text-white`}
                      onClick={() => actionIcon.onClick()}
                    >
                      {actionIcon.name}
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-[60%] py-1">
            <ScooterCore
              placeholder="Write your content here. Press / for commands and /generate for AI commands"
              editorInstance={(editor) => setEditor(editor)}
              initialValue={editorData}
              heightStrategy="flexible"
              menuType="bubble"
              onChange={(change) => {
                setEditorData(change?.html);
              }}
              tagoreConfig={{
                stream: true,
                sse: (input, selectedOption) => {
                  let source = new SSE(
                    window.REACT_APP_TAGORE_API_URL + "/prompts/generate",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      withCredentials: true,
                      payload: JSON.stringify({
                        input: input,
                        generate_for: selectedOption,
                        provider: "openai",
                        stream: true,
                        model: "gpt-3.5-turbo", //"gpt-3.5-turbo",
                        additional_instructions:
                          "The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text.",
                        max_tokens: 2000,
                      }),
                    }
                  );

                  return source;
                },
                fetcher: async (input, options) => {
                  const requestBody = {
                    input: input,
                    generate_for: options,
                    provider: "openai",
                    stream: false,
                    model: "gpt-3.5-turbo",
                    additional_instructions:
                      "The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text.",
                  };

                  const response = await generateTextFromPrompt(requestBody);
                  return response;
                },
              }}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
