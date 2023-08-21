import { ToastContainer } from "react-toastify";
import {
  errorToast,
  getToastClassNameFromType,
  successToast,
} from "../../util/toasts";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { Input } from "../../components/inputs/Input";
import {
  createDocument,
  generateTextFromPrompt,
  updateDocument,
} from "../../actions/text";
import { SSE } from "sse.js";
import { ScooterCore } from "@factly/scooter-core";
import { useEffect, useState, createRef } from "react";
import { generateUUID } from "../../util/uuid";
import { BiArrowBack } from "react-icons/bi";
import RetrieveContent from "../../components/workflow/social-media/retrieve-content";
import { WorkFlowComponent } from "../../components/workflow/each-workflow-component";
import { SocialMediaSelection } from "../../components/workflow/social-media/social-media";
import { ContentPrompt } from "../../constants/socialMedia";

export default function SocialMedia() {
  // editor instance for the workflow
  const [editor, setEditor] = useState(null);

  const [activeState, setActiveState] = useState(0);
  const [docDetails, setDocDetails] = useState({
    title: "",
    id: -1,
    isFileCreated: false,
  });

  const [content, setContent] = useState("");
  const [editorData, setEditorData] = useState(``);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!docDetails.isFileCreated) {
      setLoading(true);
      let title = "Untitled-" + generateUUID(8);

      let requestBody = {
        title: title,
        description: "",
      };
      createDocument(requestBody)
        .then((response) => {
          setDocDetails({
            id: response.id,
            title: response.title,
            isFileCreated: true,
          });
          successToast("document created successfully");
        })
        .catch((err) => {
          errorToast("error in creating document");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const stream = true;
  const [formLoading, setFormLoading] = useState(false);

  const workflowProcess = [
    {
      index: "1",
      title: "Retrieve Content",
      component: (
        <RetrieveContent
          handleSubmit={(data) => {
            setContent(data);
            setActiveState((prevState) => {
              if (prevState !== workflowProcess.length - 1) {
                workflowProcess[prevState + 1].ref.current.scrollIntoView({
                  behavior: "smooth",
                });
                return prevState + 1;
              }
            });
          }}
        />
      ),
      ref: createRef(),
    },
    {
      index: "2",
      title: "Social Media's To Generate For",
      component: (
        <SocialMediaSelection
          handleSubmit={async (selectedSocialMedia, nOfOutput) => {
            let requestBody = {};
            // requestBody.generate_for = 'social-media-post'
            requestBody.additional_instructions =
              "The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text. The content should be generated in ENGLISH(UK)";
            let prompt = ContentPrompt;
            prompt = prompt.replace(
              "Specify the number of samples you want",
              nOfOutput
            );
            prompt = prompt.replace(
              "Specify the platforms you want the posts to be tailored for",
              selectedSocialMedia
            );
            prompt = prompt.replace(
              "Insert your content here",
              `title - ${content}`
            );
            if (stream) {
              setFormLoading(true);
              requestBody.stream = true;
              requestBody.model = "gpt-4";
              requestBody.input = prompt;
              let streamData = "";
              var source = new SSE(
                window.REACT_APP_TAGORE_API_URL + `/prompts/generate`,
                {
                  payload: JSON.stringify(requestBody),
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                }
              );

              source.addEventListener("message", (event) => {
                let newData = JSON.parse(event.data)?.output;
                // get difference between newData and streamData string
                let difference = newData.replace(streamData, "");
                // set streamData to newData
                streamData = newData;
                // set editorData to difference
                setEditorData((prevState) => {
                  editor?.commands.setContent(prevState + difference);
                  return prevState + difference;
                });
              });

              source.addEventListener("error", () => {
                setFormLoading(false);
                setActiveState((prevState) => {
                  return prevState + 1;
                });
              });

              source.stream();
            } else {
              setFormLoading(true);
              requestBody.stream = false;
              requestBody.input = prompt;
              requestBody.model = "gpt-3.5-turbo";
              const response = await generateTextFromPrompt(requestBody);
              let output = response?.output?.replace(/\n|\t|(?<=>)\s*/g, "");
              setEditorData((prevState) => {
                editor?.commands.setContent(prevState + output);
                return prevState + output;
              });
              setActiveState((prevState) => {
                return prevState + 1;
              });
              setFormLoading(false);
            }
          }}
          loading={formLoading}
        />
      ),
      ref: createRef(),
    },
  ];

  return (
    <div className="w-full h-screen flex dark:bg-background-secondary-alt">
      <ToastContainer
        toastClassName={({ type }) => getToastClassNameFromType(type)}
        className="space-y-4  "
      />
      {loading ? (
        <div className="w-full h-full justify-center items-center flex dark:text-white text-blck-50">
          <ClipLoader size={"20px"} color="currentColor" />
        </div>
      ) : (
        <>
          <div className="w-1/2 h-full overflow-y-auto bg-background-sidebar dark:bg-background-sidebar-alt py-10">
            <Link className="w-full" to={"/workflows"}>
              <BiArrowBack className="text-2xl text-black-50 dark:text-white ml-10" />
            </Link>
            <div className="mt-10">
              {workflowProcess.map((eachElement, index) => {
                return (
                  <div ref={eachElement.ref}>
                    <WorkFlowComponent
                      ref={eachElement.ref}
                      key={index}
                      id={eachElement.index}
                      title={eachElement.title}
                      hasBottom={index !== workflowProcess.length - 1}
                      hasTop={index !== 0}
                      isActive={activeState === index}
                      onPrevious={() => {
                        setActiveState((prevState) => {
                          workflowProcess[
                            prevState - 1
                          ].ref.current.scrollIntoView({
                            behavior: "smooth",
                          });
                          return prevState - 1;
                        });
                      }}
                    >
                      {eachElement.component}
                    </WorkFlowComponent>
                  </div>
                );
              })}
              <WorkFlowComponent
                ref={createRef()}
                id={"-"}
                title={"End of workflow"}
                hasBottom={false}
                hasTop={true}
                hasMiddle={false}
                isActive={activeState === workflowProcess.length}
                onPrevious={() => {
                  setActiveState((prevState) => {
                    workflowProcess[
                      prevState - 1
                    ]?.ref?.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                    return prevState - 1;
                  });
                }}
              ></WorkFlowComponent>
            </div>
          </div>
          <div className="w-1/2 h-full">
            <div className="py-3 px-10 flex justify-between items-center">
              <div className="w-1/2">
                <Input
                  placeholder="enter title for your document"
                  initialValue={docDetails?.title}
                  onChange={(e) => {
                    setDocDetails((prev) => {
                      return {
                        ...prev,
                        title: e.target.value,
                      };
                    });
                  }}
                  type="input"
                />
              </div>
              <button
                className="bg-black-50 py-2 px-10 text-white border-none rounded-lg"
                onClick={() => {
                  updateDocument(docDetails.id, {
                    title: docDetails.title,
                    description: editor?.getHTML(),
                  })
                    .then(() => {
                      successToast("document updated successfully");
                    })
                    .catch((err) => {
                      errorToast("Unable to update document. " + err?.message);
                    });
                }}
              >
                Save
              </button>
            </div>
            <ScooterCore
              placeholder="Write your content here. Press / for commands and /generate for AI commands"
              heightStrategy="flexible"
              className="bg-white dark:bg-background-secondary-alt dark:text-white text-black-50"
              menuType="bubble"
              editorInstance={(editor) => setEditor(editor)}
              initialValue={editorData}
              onChange={(data) => {
                setEditorData(data?.html);
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
                          "The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text. The content should be generated in ENGLISH(UK)",
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
                      "The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text. The content should be generated in ENGLISH(UK)",
                  };

                  const response = await generateTextFromPrompt(requestBody);
                  return response;
                },
              }}
            ></ScooterCore>
          </div>
        </>
      )}
    </div>
  );
}
