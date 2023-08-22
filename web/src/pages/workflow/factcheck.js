import { ScooterCore } from "@factly/scooter-core";
import { BiArrowBack } from "react-icons/bi";
import { WorkFlowComponent } from "../../components/workflow/each-workflow-component";
import { IntroductionForm } from "../../components/workflow/factcheck/introduction";
import {
  createDocument,
  generateTextFromPrompt,
  updateDocument,
} from "../../actions/text";
import { createRef, useEffect, useState } from "react";
import { SSE } from "sse.js";
import { ExistingFactcheck } from "../../components/workflow/factcheck/existing-factcheck";
import { Methodology } from "../../components/workflow/factcheck/methodology";
import { FactcheckConclusion } from "../../components/workflow/factcheck/conclusion";
import { Link } from "react-router-dom";
import { generateUUID } from "../../util/uuid";
import { errorToast, successToast } from "../../util/toasts";
import { ClipLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import { Input } from "../../components/inputs/Input";
import { withOrg } from "../../components/organisation/withOrg";

function FactcheckWorkflow({ selectedOrg }) {
  // editor instance for the workflow
  const [editor, setEditor] = useState(null);

  const [activeState, setActiveState] = useState(0);

  // editorData for the workflow
  const [editorData, setEditorData] = useState(``);

  const [factcheckTitle, setFactcheckTitle] = useState("");

  const [loading, setLoading] = useState(true);

  const [formLoading, setFormLoading] = useState(false);

  let stream = true;

  const workflowProcess = [
    {
      component: (
        <IntroductionForm
          loadingForm={formLoading}
          handleSubmit={async (request) => {
            setFactcheckTitle(request?.title);
            if (stream) {
              setFormLoading(true);
              request.requestBody.stream = true;
              request.requestBody.model = "gpt-4";

              let streamData = "";
              var source = new SSE(
                window.REACT_APP_TAGORE_API_URL + `/prompts/generate`,
                {
                  payload: JSON.stringify(request.requestBody),
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Org": selectedOrg,
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

              source.addEventListener("error", (event) => {
                setFormLoading(false);
                setActiveState((prevState) => {
                  workflowProcess[prevState + 1]?.ref?.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                  return prevState + 1;
                });
              });

              source.stream();
            } else {
              setFormLoading(true);
              request.requestBody.stream = false;
              request.requestBody.model = "gpt-3.5-turbo";

              const response = await generateTextFromPrompt(
                request.requestBody,
                selectedOrg
              );
              editor?.commands?.insertContent(response?.output);
              if (activeState !== workflowProcess.length - 1) {
                workflowProcess[activeState + 1]?.ref.current?.scrollIntoView({
                  behavior: "smooth",
                });
                setActiveState((prev) => prev + 1);
              }

              setFormLoading(false);
            }
          }}
        ></IntroductionForm>
      ),
      title: "Fact check Introduction Paragraph",
      index: "1",
      ref: createRef(null),
    },
    {
      index: "2",
      title: "Search Existing Fact check",
      component: (
        <ExistingFactcheck
          handleCompose={(output) => {
            let pTag = `<p>${output}</p>`;
            setEditorData((prevData) => {
              editor?.commands?.setContent(prevData + pTag);
              return prevData + pTag;
            });
            workflowProcess[activeState + 1]?.ref.current?.scrollIntoView({
              behavior: "smooth",
            });
            setActiveState((prev) => prev + 1);
          }}
          handleSkip={() => {
            workflowProcess[activeState + 1]?.ref.current?.scrollIntoView({
              behavior: "smooth",
            });
            setActiveState((prev) => prev + 1);
          }}
          title={factcheckTitle}
          editor={editor}
        />
      ),
      ref: createRef(null),
    },
    {
      index: "3",
      title: "Review Methodology",
      ref: createRef(),
      component: (
        <Methodology
          loading={formLoading}
          handleCompose={async (requestData) => {
            if (stream) {
              setFormLoading(true);
              requestData.stream = true;
              requestData.model = "gpt-4";
              let streamData = "";
              var source = new SSE(
                window.REACT_APP_TAGORE_API_URL + `/prompts/generate`,
                {
                  payload: JSON.stringify(requestData),
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Org": selectedOrg,
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
                  workflowProcess[prevState + 1]?.ref?.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                  return prevState + 1;
                });
              });

              source.stream();
            } else {
              setFormLoading(true);
              requestData.stream = false;
              requestData.model = "gpt-3.5-turbo";
              generateTextFromPrompt(requestData, selectedOrg)
                .then((response) => {
                  editor?.commands?.insertContent(response?.output);
                  if (activeState !== workflowProcess.length - 1) {
                    workflowProcess[
                      activeState + 1
                    ]?.ref.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                    setActiveState((prev) => prev + 1);
                  }
                })
                .catch((error) => {
                  errorToast(error?.message);
                })
                .finally(() => {
                  setFormLoading(false);
                });
            }
          }}
          // editor={editor}
        />
      ),
    },
    {
      index: "4",
      title: "Fact check conclusion paragraph",
      component: (
        <FactcheckConclusion
          loading={formLoading}
          handleSubmit={(request) => {
            if (stream) {
              setFormLoading(true);
              request.stream = true;
              request.model = "gpt-4";
              let streamData = "";
              var source = new SSE(
                window.REACT_APP_TAGORE_API_URL + `/prompts/generate`,
                {
                  payload: JSON.stringify(request),
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Org": selectedOrg,
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
                  workflowProcess[prevState + 1]?.ref?.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                  return prevState + 1;
                });
              });

              source.stream();
            } else {
              setFormLoading(true);
              request.stream = false;
              request.model = "gpt-3.5-turbo";
              generateTextFromPrompt(request, selectedOrg)
                .then((response) => {
                  editor?.commands?.insertContent(response?.output);
                  if (activeState !== workflowProcess.length - 1) {
                    workflowProcess[
                      activeState + 1
                    ]?.ref.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                    setActiveState((prev) => prev + 1);
                  }
                })
                .catch((error) => {
                  errorToast(error?.message);
                })
                .finally(() => {
                  setFormLoading(false);
                });
            }
          }}
          editor={editor}
        />
      ),
      ref: createRef(null),
    },
  ];

  const [docDetails, setDocDetails] = useState({
    title: "",
    id: -1,
    isFileCreated: false,
  });

  useEffect(() => {
    if (!docDetails.isFileCreated) {
      setLoading(true);
      let title = "Untitled-" + generateUUID(8);

      let requestBody = {
        title: title,
        description: "",
      };
      createDocument(requestBody, selectedOrg)
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

  return (
    <div className="w-full h-screen flex dark:bg-background-secondary-alt">
      <ToastContainer
        toastClassName={({ type }) =>
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
      {loading ? (
        <div className="w-full h-full justify-center items-center flex">
          <ClipLoader size={"20px"} />
        </div>
      ) : (
        <>
          <div className="w-1/2 h-full overflow-y-auto bg-background-sidebar dark:bg-background-sidebar-alt py-10">
            <Link className="w-full" to={"/workflows"}>
              <BiArrowBack className="text-2xl text-black-50 ml-10" />
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
                          ]?.ref?.current?.scrollIntoView({
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
              className="bg-white dark:bg-background-secondary-alt dark:text-white text-black-50"
              heightStrategy="flexible"
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
                        "X-Org": selectedOrg,
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

                  const response = await generateTextFromPrompt(
                    requestBody,
                    selectedOrg
                  );
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

export default withOrg(FactcheckWorkflow);
