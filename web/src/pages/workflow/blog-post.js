import { ScooterCore } from "@factly/scooter-core";
import { BiArrowBack } from "react-icons/bi";
import { WorkFlowComponent } from "../../components/workflow/each-workflow-component";

import {
  createDocument,
  generateTextFromPrompt,
  updateDocument,
} from "../../actions/text";
import { createRef, useEffect, useState } from "react";
import { SSE } from "sse.js";

import { Link } from "react-router-dom";
import { generateUUID } from "../../util/uuid";
import {
  errorToast,
  getToastClassNameFromType,
  successToast,
} from "../../util/toasts";
import { ClipLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import { Input } from "../../components/inputs/Input";
import VerticalLine from "../../components/workflow/vertical-line";
import { Introduction } from "../../components/workflow/blogpost/introduction";
import { Outline } from "../../components/workflow/blogpost/outline";
import { Conclusion } from "../../components/workflow/blogpost/conclusion";
import { ParagraphGenerator } from "../../components/workflow/blogpost/paragraph_generator";

export default function BlogPostWorkflow() {
  // editor instance for the workflow
  const [editor, setEditor] = useState(null);

  const [activeState, setActiveState] = useState(0);

  // stream for the workflow
  const stream = true;
  // editorData for the workflow
  const [editorData, setEditorData] = useState(``);

  const [outlineForms, setOutlineForms] = useState([]);

  const [loading, setLoading] = useState(false);

  // setFormLoading is used to set the loading state of the form
  const [formLoading, setFormLoading] = useState(false);

  const [content, setContent] = useState({
    value: "",
    error: "",
  });

  const [outline, setOutline] = useState("");

  const [commonBlogDetails, setCommonBlogDetails] = useState({
    title: "",
    audience: "",
    tone: "",
  });

  const handleContentChange = (value) => {
    if (value.length > 0) {
      if (content.value.length >= 600) {
        return;
      }
      setContent({
        value: value,
        error: "",
      });
    } else {
      setContent({
        value: value,
        error: "Content is required",
      });
    }
  };

  const workflowProcess = [
    {
      component: (
        <Introduction
          loading={formLoading}
          handleCompose={async (requestBody, title, tone, audience) => {
            if (stream) {
              setFormLoading(true);
              requestBody.stream = true;
              requestBody.model = "gpt-4";
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

              setCommonBlogDetails({
                title: title,
                tone: tone,
                audience: audience,
              });

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
              requestBody.stream = false;
              requestBody.model = "gpt-3.5-turbo";
              const response = await generateTextFromPrompt(requestBody);
              let output = response?.output?.replace(/\n|\t|(?<=>)\s*/g, "");

              setEditorData((prevState) => {
                editor?.commands.setContent(prevState + output);
                return prevState + output;
              });

              setCommonBlogDetails({
                title: title,
                tone: tone,
                audience: audience,
              });

              setFormLoading(false);

              setActiveState((prevState) => {
                workflowProcess[prevState + 1]?.ref?.current?.scrollIntoView({
                  behavior: "smooth",
                });
                return prevState + 1;
              });
            }
          }}
        />
      ),
      title: "Blog Introduction Paragraph",
      index: "1",
      ref: createRef(),
    },
    {
      component: (
        <Outline
          tone={commonBlogDetails.tone}
          audience={commonBlogDetails.audience}
          title={commonBlogDetails.title}
          handleCompose={(outline) => {
            setOutline(outline);
            // outline_points is the list of points generated from the outline component
            const elements = outline.split(/\n/);
            const cleanedElements = elements.map((element) => {
              element = element.replace(/\d+\./g, "");
              return element.trim();
            });

            let outlineArray = cleanedElements.map((element, index) => {
              return {
                component: (
                  <ParagraphGenerator
                    loading={formLoading}
                    editor={editor}
                    topic={element}
                    tone={commonBlogDetails.tone}
                    audience={commonBlogDetails.audience}
                    handleCompose={async (requestBody) => {
                      if (stream) {
                        setFormLoading(true);
                        requestBody.stream = true;
                        requestBody.model = "gpt-4";
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

                        source.addEventListener("error", (event) => {
                          setFormLoading(false);
                          setActiveState((prevState) => {
                            return prevState + 1;
                          });
                        });

                        source.stream();
                      } else {
                        setFormLoading(true);
                        requestBody.stream = false;
                        requestBody.model = "gpt-3.5-turbo";
                        const response = await generateTextFromPrompt(
                          requestBody
                        );
                        const responseHTML = response.output?.replace(
                          /\n|\t|(?<=>)\s*/g,
                          ""
                        );

                        setEditorData((prevState) => {
                          let output = prevState + responseHTML;
                          editor?.commands.setContent(output);
                          return output;
                        });

                        setActiveState((prevState) => {
                          // TODO: scroll to the next component
                          return prevState + 1;
                        });
                        setFormLoading(false);
                      }
                    }}
                  />
                ),
                title: element,
                index: `3.${index + 1}`,
                ref: createRef(),
              };
            });

            setOutlineForms(outlineArray);
            setActiveState((prevState) => {
              workflowProcess[prevState + 1].ref.current.scrollIntoView({
                behavior: "smooth",
              });
              return prevState + 1;
            });
          }}
        />
      ),
      title: "Blog post outline",
      index: "2",
      ref: createRef(),
    },
    ...outlineForms,
    {
      title: "Blog Conclusion Paragraph",
      component: (
        <Conclusion
          editor={editor}
          loading={formLoading}
          outline={outline}
          handleCompose={async (requestBody) => {
            if (stream) {
              setFormLoading(true);
              requestBody.stream = true;
              requestBody.model = "gpt-4";
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
        />
      ),
      index: "4",
      ref: createRef(),
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
              <div className="px-10 flex flex-col gap-2 relative">
                {activeState > 0 && (
                  <div className="absolute bg-white dark:bg-background-secondary-alt bg-opacity-50 dark:bg-opacity-50 top-0 left-0 w-full h-full"></div>
                )}
                <Input
                  placeholder={
                    "Enter a brief description of your blog topic..."
                  }
                  label={"Content Description / Brief"}
                  labelFontWeight={"font-medium"}
                  labelFontSize={"text-base"}
                  onChange={(e) => {
                    handleContentChange(e.target.value);
                  }}
                ></Input>
                <div className="flex flex-row-reverse">
                  <span>{`${content.value.length}/600`}</span>
                </div>
              </div>
              <div className="px-10">
                <VerticalLine />
              </div>
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
