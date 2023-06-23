import { ScooterCore } from "@factly/scooter-core";
import { BiArrowBack } from "react-icons/bi";
import { WorkFlowComponent } from "../../components/workflow/each-workflow-component";
import { IntroductionForm } from "../../components/workflow/factcheck/introduction";
import { generateTextFromPrompt } from "../../actions/text";
import { createRef, useEffect, useRef, useState } from "react";
import { SSE } from "sse.js";
import { ExistingFactcheck } from "../../components/workflow/factcheck/existing-factcheck";
import { Methodology } from "../../components/workflow/factcheck/methodology";
import { FactcheckConclusion } from "../../components/workflow/factcheck/conclusion";

export default function FactcheckWorkflow() {
  // editor instance for the workflow
  const [editor, setEditor] = useState(null);

  const [activeState, setActiveState] = useState(0);

  // editorData for the workflow
  const [editorData, setEditorData] = useState(``);

  const [methodology, setMethodology] = useState([]);

  const [factcheckTitle, setFactcheckTitle] = useState("");

  function handleNext() {
    if (activeState !== workflowProcess.length - 1) {
      setActiveState((prev) => {
        workflowProcess[prev + 1]?.ref.current?.scrollIntoView({
          behavior: "smooth",
        });
        return prev + 1;
      });
    }
  }

  async function handleCompose(output) {
    setEditorData((prevData) => {
      editor?.commands?.setContent(prevData + output);
      return prevData + output;
    });
  }

  const handleAddNewMethodology = () => {
    const reference = createRef();
    const oldMethodology = methodology;
    const latestMethodology = {
      index: `3.${methodology.length + 1}`,
      title: "Review Methodology",
      ref: reference,
      component: (
        <Methodology
          handleAddNewMethodology={() => handleAddNewMethodology()}
          handleNext={() => handleNext()}
          handleCompose={(data) => handleCompose(data)}
          editor={editor}
        />
      ),
    };
    oldMethodology.push(latestMethodology);

    setMethodology(oldMethodology);
    setActiveState((prev) => prev + 1);
    setTimeout(() => {
      latestMethodology.ref.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const workflowProcess = [
    {
      component: (
        <IntroductionForm
          handleSubmit={(response) => {
            setFactcheckTitle(response?.title);
            editor?.commands?.insertContent(response?.output);
            if (activeState !== workflowProcess.length - 1) {
              workflowProcess[activeState + 1]?.ref.current?.scrollIntoView({
                behavior: "smooth",
              });
              setActiveState((prev) => prev + 1);
            }
          }}
        ></IntroductionForm>
      ),
      title: "Factcheck Introduction Paragraph",
      index: "1",
      ref: useRef(null),
    },
    {
      index: "2",
      title: "Search Existing Factcheck",
      component: (
        <ExistingFactcheck
          handleSubmit={(output) => {}}
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
      ref: useRef(null),
    },
    ...methodology,
    {
      index: "4",
      title: "Fact check conclusion paragraph",
      component: 
      <FactcheckConclusion 
        handleSubmit={(output) => {
          setEditorData((prevData) => {
            editor?.commands?.setContent(prevData + output);
            return prevData + output;
          });
        }}
        editor={editor}
      />,
      ref: useRef(null),
    },
  ];

  useEffect(() => {
    setMethodology([
      {
        index: "3.1",
        title: "Review Methodology",
        ref: createRef(),
        component: (
          <Methodology
            handleNext={() => {
              handleNext();
            }}
            handleAddNewMethodology={() => {
              handleAddNewMethodology();
            }}
            handleCompose={(data) => {
              handleCompose(data);
            }}
            editor={editor}
          />
        ),
      },
    ]);
  }, [editor]);

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full overflow-y-auto bg-background-sidebar py-10">
        <div className="w-full">
          <BiArrowBack className="text-2xl text-black-50 ml-10" />
        </div>

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
                >
                  {eachElement.component}
                </WorkFlowComponent>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-1/2 h-full">
        <div className="py-3 px-10 flex justify-between items-center">
          {/* <span
            className="text-xl text-black-50"
          >
            Untitled
          </span> */}
          <input
            placeholder="enter title for your document"
            className="w-1/2 py-2 px-5 rounded-lg"
          ></input>
          <button className="bg-black-50 py-2 px-10 text-white border-none rounded-lg">
            Save
          </button>
        </div>
        <ScooterCore
          placeholder="Write your content here. Press / for commands and /generate for AI commands"
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
    </div>
  );
}
