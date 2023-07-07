import { useEffect, useState } from 'react';
import ArrowIcon from '../../assets/icons/arrow.svg';
import InfoIcon from '../../assets/icons/info-icon.svg';
import ArrowLeft from '../../assets/icons/arrow-left.svg';
import Clear from '../../assets/icons/clear.svg';
import Share from '../../assets/icons/share.svg';
import Tick from '../../assets/icons/tick.svg';
import { ScooterCore } from '@factly/scooter-core';
// import { IoShareSocialOutline } from "react-icons/io5";
// import { MdDeleteOutline } from "react-icons/md";
import { DocActionButton } from '../../components/buttons/DocActionButton';
import { SizeButton } from '../../components/buttons/SizeButton';
import {
  createDocument,
  generateTextFromPrompt,
  getDocumentByID,
  updateDocument,
} from '../../actions/text';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SSE } from 'sse.js';
import { ToastContainer } from 'react-toastify';
import { errorToast, successToast } from '../../util/toasts';
import useWindowSize from '../../hooks/useWindowSize';
import MenuIcon from '../../components/MenuIcon';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import useDarkMode from '../../hooks/useDarkMode';

export default function Document() {
  const [searchParams] = useSearchParams();

  const [prompt, setPrompt] = useState('');

  // documentName maintains the state of name of the document
  const [documentName, setDocumentName] = useState('');

  // keywords maintains the state of keywords for the prompt
  const [keywords, setKeywords] = useState('');

  // editor is a reference to the editor instance
  const [editor, setEditor] = useState(null);

  // loading is a boolean variable which determines whether the backend is composing something or not
  const [loading, setLoading] = useState(false);

  // id stores the id of the document
  const [id, setID] = useState('' || searchParams.get('id'));

  // isEdit is a boolean variable which determines whether the document is being edited or not
  const [isEdit, setIsEdit] = useState(false || searchParams.get('isEdit'));

  // const [stream, setStream] = useState(true);
  // continueButtonState is a boolean variable which determines different attributes of the continue button
  const [continueButtonState, setContinueButtonState] = useState({
    visibility: false,
  });
  const { darkMode } = useDarkMode();
  // documentData holds the state of prompts, document data, finish reason, etc.
  const styles = {
    input: {
      borderColor: '#D0D5DD',
      placeholderColor: '#667085',
    },
    countColor: '#929DAF',
  };

  const navigate = useNavigate();
  const [editorData, setEditorData] = useState(``);

  const [promptData, setPromptData] = useState(``);

  // language stores the language of the document
  const [language, setLanguage] = useState('english (uk)');

  const handleGoBack = () => {
    navigate('/documents');
  };

  const handlePromptChange = (value) => {
    setPrompt(value);
  };

  // onNameChange is a callback function that is called when the user changes the name of the document
  const onNameChange = (value) => {
    setDocumentName(value);
  };

  const [sseClient, setSseClient] = useState(null);

  const actionList = [
    {
      onClick: () => {
        if (documentName === '') {
          errorToast('document name cannot be empty');
          return;
        }

        if (editor?.getHTML() === '') {
          errorToast('document content cannot be empty');
          return;
        }

        let requestBody = {
          title: documentName,
          description: editor?.getHTML(),
        };

        if (id && isEdit) {
          updateDocument(id, requestBody)
            .then(() => {
              successToast('document updated successfully');
            })
            .catch(() => {
              errorToast('error in updating document');
            });
        } else {
          createDocument(requestBody)
            .then((response) => {
              navigate(`/documents/create?id=${response?.id}&isEdit=true`);
              successToast('document created successfully');
            })
            .catch(() => {
              errorToast('error in creating document');
            });
        }
      },
      name: "Save",
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
      window.REACT_APP_TAGORE_API_URL + '/prompts/generate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        payload: JSON.stringify({
          input: inputPrompt,
          generate_for: '',
          provider: 'openai',
          stream: true,
          model: 'gpt-3.5-turbo', //"gpt-3.5-turbo",
          additional_instructions:
            'The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text.',
          max_tokens: 2000,
        }),
      }
    );

    setSseClient(source);
    source.addEventListener('message', (event) => {
      let docObject = JSON.parse(event.data);
      setPromptData(docObject?.output);
    });

    source.addEventListener('error', (event) => {
      source.close();
      setLoading(false);
      if (!String(event.data).includes('[DONE]')) {
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
    name: 'S',
  });

  const [customLength, setCustomLength] = useState(0);

  // outputLengthList is a list of output length options
  let outputLengthList = [
    {
      maxLength: 200,
      title: 'S',
    },
    {
      maxLength: 400,
      title: 'M',
    },
    {
      maxLength: 600,
      title: 'L',
    },
    {
      title: 'Custom',
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
    setSelectedOutputLength({ length: valueInInt, name: 'Custom' });
  };

  useEffect(() => {
    if (id && isEdit) {
      getDocumentByID(id)
        .then((response) => {
          setDocumentName(response?.title);
          setPromptData(response?.description);
        })
        .catch((error) => {
          errorToast('error in fetching document');
        });
    }
  }, []);

  useEffect(() => {
    setID(searchParams?.get('id'));
    setIsEdit(searchParams?.get('isEdit'));
  }, [searchParams]);

  const handleStop = () => {
    sseClient.close();
    setLoading(false);
    setSseClient(null);
  };
  const { isMobileScreen } = useWindowSize();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // container for new/edit document page
    <div className="h-screen w-full flex">
      {/* this is control section, it will have a prompt input, keyword input, language input and output length */}
      {!isMobileScreen ? (
        <div
          className={`w-1/4 bg-background-sidebar h-fit ${
            darkMode && 'bg-background-sidebar-alt'
          }`}
        >
          {/* actions container */}
          <div className="p-10 cursor-pointer flex flex-col gap-11">
            {/* image container */}
            <div>
              {/* backbutton icon */}
              <img
                src={ArrowLeft}
                onClick={handleGoBack}
                alt="arrow-left"
              ></img>
            </div>
            {/* input division - each input division will have label, a form input type and input-length counter */}
            {/* prompt section */}
            <div className={`flex flex-col gap-2`}>
              {/* label division*/}
              <div className="flex gap-2">
                <label
                  htmlFor="contentDescription"
                  className={`font-medium ${
                    darkMode ? 'text-dark-text' : 'text-form-label'
                  } text-sm`}
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
                  className={`font-medium ${
                    darkMode ? 'text-dark-text' : 'text-form-label'
                  } text-sm`}
                >
                  {' '}
                  Keywords{' '}
                </label>
                <img src={InfoIcon} alt="info-icon" />
              </div>
              <input
                className={`pt-2 pb-2 pl-3 pr-3 border-[${styles.input.borderColor}] border rounded-lg placeholder:[${styles.input.placeholderColor}]`}
                placeholder={'enter keywords'}
                onChange={(e) => setKeywords(e.target.value)}
              ></input>
            </div>
            {/* languages section */}
            <div className={`flex flex-col gap-2`}>
              <div className="flex gap-2">
                <label
                  htmlFor="languages"
                  className={`font-medium ${
                    darkMode ? 'text-dark-text' : 'text-form-label'
                  } text-sm`}
                >
                  Select language
                </label>
                <img src={InfoIcon} alt="info-icon" />
              </div>
              <div className={`flex w-full pt-2 pb-2 pl-3 pr-3 border-[${styles.input.borderColor}] border rounded-lg bg-white`}>
                <select
                  className={`appearance-none w-[98%] cursor-pointer focus:outline-none`}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="english (uk)">English</option>
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
                  className={`font-medium ${
                    darkMode ? 'text-dark-text' : 'text-form-label'
                  } text-sm`}
                >
                  Output length
                </label>
                <img src={InfoIcon} alt="info-icon" />
              </div>
              <div className="flex gap-1">
                {outputLengthList.map((item, index) => {
                  let isCustom = item.title === 'Custom';
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
              {selectedOutputLength.name === 'Custom' && (
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
                text={'Compose'}
                clickAction={() => handleCompose()}
                isPrimary={true}
              ></DocActionButton>
              {loading && (
                <DocActionButton
                  text={'Stop'}
                  clickAction={() => handleStop()}
                ></DocActionButton>
              )}
              {continueButtonState.visibility && (
                <DocActionButton
                  isLoading={false}
                  text={'Continue Generating'}
                  clickAction={() => handleCompose()}
                  isPrimary={true}
                ></DocActionButton>
              )}
              <DocActionButton
                text={'Reset'}
                clickAction={() => editor?.commands?.setContent('')}
                isPrimary={false}
              ></DocActionButton>
            </div>
          </div>
        </div>
      ) : (
        <nav className="w-full bg-background-sidebar fixed top-0 z-50 ">
          <div className="p-4 flex justify-between items-center">
            <div className="flex gap-3">
              {/* backbutton icon */}
              <img
                src={ArrowLeft}
                onClick={handleGoBack}
                alt="arrow-left"
              ></img>
              <h2 className="text-2xl font-medium">
                {documentName === '' ? 'Untitled Document' : documentName}
              </h2>
            </div>
            <button
              className="text-white text-2xl focus:outline-none "
              onClick={toggleMobileMenu}
            >
              <MenuIcon className="w-8 h-8" />
            </button>
          </div>
          <div className="flex justify-end pb-4 w-full ">
            <div className="flex w-fit gap-2 mr-6">
              <button className="w-[40px]  h-[40px] bg-[#E7EAF0] rounded-lg  flex justify-center items-center">
                <img
                  src={Tick}
                  alt="tick"
                  onClick={() => actionList[0].onClick()}
                />
              </button>
              <button className="w-[40px]  h-[40px] bg-[#E7EAF0] rounded-lg  flex justify-center items-center">
                <img src={Share} alt="clear" />
              </button>
              <button className="w-[40px]  h-[40px] bg-[#E7EAF0] rounded-lg  flex justify-center items-center">
                <img
                  src={Clear}
                  alt="clear"
                  onClick={() => actionList[1].onClick()}
                />
              </button>
            </div>
          </div>
        </nav>
      )}

      <div
        className={` ${
          !isMobileScreen ? 'w-3/4 grid  grid-rows-[1fr_14fr]' : 'w-full'
        }`}
      >
        {/* this is the header section in create document page. It has mainly 2 elements - 1. File Name input box and 2. actions - [share, delete, save]*/}
        <div
          className={`w-full py-3 px-6 flex justify-between border-b ${
            darkMode ? 'bg-background-sidebar-alt' : 'border-border-secondary'
          }`}
        >
          <div className={`w-3/5 flex flex-row items-center`}>
           <div className="w-2/5 border-2 p-2 border-border-secondary flex items-center">
              <input
                defaultValue={documentName}
                placeholder="enter title for the document"
                className={`outline-none w-full ${
                  darkMode && 'bg-background-sidebar-alt text-white'
                }`}
                onChange={(e) => onNameChange(e.target.value)}
              ></input>
              {/* <button className="text-xl" onClick={onNameSubmit}><AiOutlineCheck /></button> */}
            </div>
          </div>
          {/* action div */}
          <div className="flex flex-row items-center gap-4">
            {actionList.map((actionIcon) => {
              return (
                // action icon container
                <>
                  {actionIcon.name === 'Delete' ? (
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
        <div className={`w-full flex justify-center ${darkMode && 'bg-background-secondary-alt'}`}>
          <div className={`w-[60%] py-1 ${darkMode && 'bg-background-sidebar-alt'}`}>
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
                    window.REACT_APP_TAGORE_API_URL + '/prompts/generate',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      withCredentials: true,
                      payload: JSON.stringify({
                        input: input,
                        generate_for: selectedOption,
                        provider: 'openai',
                        stream: true,
                        model: 'gpt-3.5-turbo', //"gpt-3.5-turbo",
                        additional_instructions:
                          'The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text. The content should be generated in ENGLISH(UK)',
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
                    provider: 'openai',
                    stream: false,
                    model: 'gpt-3.5-turbo',
                    additional_instructions:
                      'The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text. The content should be generated in ENGLISH(UK)',
                  };

                  const response = await generateTextFromPrompt(requestBody);
                  return response;
                },
              }}
            />
          </div>
        </div>
      </div>
      {isMobileScreen && isMobileMenuOpen && (
        // Mobile Menu Overlay
        <div
          className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {isMobileScreen && (
        // Mobile Menu Content
        <div
          className={` w-3/4 fixed top-0 right-0 h-screen bg-background-sidebar z-50 transition-transform transform ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } duration-300`}
        >
          <button
            className="text-white text-2xl focus:outline-none absolute top-3 right-3 "
            onClick={toggleMobileMenu}
          >
            <AiOutlineMenuUnfold className="w-8 h-8 text-black" />
          </button>
          <div className="w-full flex justify-center items-center h-full ">
            {/* Mobile menu content goes here */}
            {/* ... */}
            <div className="w-[80%] ">
              <div className="flex justify-between p-3">
                <input
                  defaultValue={documentName}
                  placeholder="enter title for the document"
                  className={`${
                    isMobileScreen
                      ? "w-[80%] outline-none p-2"
                      : "outline-none w-2/5 p-2"
                  }`}
                  onChange={(e) => onNameChange(e.target.value)}
                ></input>
              </div>
              {/* actions container */}
              <div className="p-3 cursor-pointer flex flex-col gap-11">
                {/* image container */}
                {/* input division - each input division will have label, a form input type and input-length counter */}
                {/* prompt section */}
                <div className={`flex flex-col gap-2 p-2`}>
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
                <div className={`flex flex-col gap-2 p-2`}>
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
                <div className={`flex flex-col gap-2 p-2`}>
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
                {/* <div className="w-full flex flex-col gap-2">
                  <DocActionButton
                    isLoading={loading}
                    text={"Compose"}
                    clickAction={() => handleCompose()}
                    isPrimary={true}
                  ></DocActionButton>
                  {
                    loading && (
                      <DocActionButton
                        text={"Stop"}
                        clickAction={() => handleStop()}
                      ></DocActionButton>
                    )
                  }
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
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
         toastClassName={ ({ type }) =>
          type === "error"
            ? "w-[340px] border-l-[12px] border-[#DA3125] rounded-md shadow-lg bg-[#FFF]"
            : type === "success"
            ? "w-[340px] border-l-[12px] border-[#03C04A] rounded-md shadow-lg bg-[#FFF]"
            : type === "warning"
            ? "w-[340px] border-l-[12px] border-[#EA8700] rounded-md shadow-lg bg-[#FFF]"
            : ""
        }
        className="space-y-4  "
      />
    </div>
  );
}
