import { useState } from "react";
import { OutputLength } from "../../length/output_length";
import { RxCross2 } from "react-icons/rx";
import { isURL } from "../../../util/validateRegex";
import { AiOutlinePlus } from "react-icons/ai";
import { DocActionButton } from "../../buttons/DocActionButton";
import { SearchableInput } from "../../inputs/searchableInput";
import { factcheckMethodologyPrompt } from "../../../constants/factcheck";
import { generateTextFromPrompt } from "../../../actions/text";

export const Methodology = ({
  handleCompose,
  // handleNext,
  // editor,
}) => {
  const [maxTokens, setMaxTokens] = useState(100);

  const availableOptions = [
    "Reverse image search",
    "Extracted key frames from the viral video and did a reverse image search on the keyframes",
    "Google search with relevant keywords",
    "Youtube search with relevant keywords",
    "Lok sabha website search",
    "Rajya sabha website search",
    " Official website search ",
  ];

  const initialFormData = {
    methodology: {
      value: "",
      error: "",
    },
    review_sources: [],
    options: availableOptions,
  };

  const [formData, setFormData] = useState([initialFormData]);

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let error = false;
    formData.forEach((eachForm, index) => {
      if (eachForm.methodology.value === "") {
        error = true;
        setFormData((prevData) => {
          const newFormData = [...prevData];
          newFormData[index].methodology.error = "This field is required";
        });
      } else {
        const newFormData = [...formData];
        newFormData[index].methodology.error = "";
        setFormData(newFormData);
      }

      if (eachForm.review_sources.length === 0) {
        return;
      } else {
        // check if is there any error in the review sources
        eachForm.review_sources.forEach((review_source, index) => {
          if (review_source.error !== "") {
            error = true;
          }
        });
      }
    });
    return error;
  };

  const handleClick = async () => {
    setLoading(true);
    if (validateForm()) {
      return;
    }

    // creating a prompt using the methodology form data that we have
    // methodologies should be in points having methodology and review sources
    let formString = "";
    formData.forEach((eachForm, index) => {
      formString += `${index + 1}. ${eachForm.methodology.value}\n`;
      if (eachForm.review_sources.length > 0) {
        formString += `Review Sources:\n`;
        eachForm.review_sources.forEach((review_source, index) => {
          formString += `${index + 1}. ${review_source.review_source}\n`;
        });
      }
    });

    let methodologyPrompt = factcheckMethodologyPrompt;

    // methodologyPrompt = methodologyPrompt.replace(
    //   "{article_written_till_now}",
    //   editor?.getHTML()
    // );

    methodologyPrompt = methodologyPrompt.replace(
      "{list_of_methodologies_with_there_review_sources}",
      formString
    );

    const request = {
      input: methodologyPrompt,
      provider: "openai",
      model: "gpt-3.5-turbo",
      stream: false,
      additional_instructions: `The generated text should have exactly ${maxTokens} be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text.`,
    };

    const response = await generateTextFromPrompt(request);

    handleCompose(response?.output?.replace(/\n|\t|(?<=>)\s*/g, ""));
    setLoading(false);
  };

  return (
    <div className="p-7 bg-white rounded-lg flex flex-col gap-8">
      {formData.map((data, index) => {
        return (
          <>
            <SearchableInput
              label={"Methodology"}
              onChange={(formValue) => {
                const newFormData = [...formData];
                newFormData[index].methodology.value = formValue;
                // filter out options based on the value
                // show only those variables which contain the value
                const options = availableOptions.filter((option) =>
                  option.toLowerCase().includes(formValue.toLowerCase())
                );
                newFormData[index].options = options;

                setFormData(newFormData);
              }}
              placeholder={"Methodology goes here..."}
              listOptions={data.options}
              labelSize={"text-base"}
              labelFontWeight={"font-medium"}
              initialValue={data.methodology.value}
              error={data.methodology.error}
            ></SearchableInput>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-base">Review sources</label>
              {data.review_sources.map((reviewSource, rIndex) => {
                // return an input with a cross icon at right
                return (
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-[95fr_5fr] items-center gap-2 justify-center">
                      <input
                        className="p-2 border border-[#D0D5DD] rounded-md bg-transparent outline-none"
                        placeholder="Review source goes here..."
                        value={reviewSource.review_source}
                        onChange={(e) => {
                          const newReviewSource = [...data.review_sources];
                          newReviewSource[rIndex].review_source =
                            e.target.value;
                          if (!isURL(e.target.value)) {
                            newReviewSource[rIndex].error =
                              "Please enter a valid URL";
                          } else {
                            newReviewSource[rIndex].error = "";
                          }
                          const newFormData = [...formData];
                          newFormData[index].review_sources = newReviewSource;
                          setFormData(newFormData);
                        }}
                      ></input>
                      <RxCross2
                        className="text-black-50 text-lg cursor-pointer"
                        onClick={() => {
                          const newReviewSource = [...data.review_sources];
                          newReviewSource.splice(rIndex, 1);
                          const newFormData = [...formData];
                          newFormData[index].review_sources = newReviewSource;
                          setFormData(newFormData);
                        }}
                      />
                    </div>
                    {reviewSource.error && (
                      <span className="text-red-500 text-xs">
                        {reviewSource.error}
                      </span>
                    )}
                  </div>
                );
              })}
              <button
                className="flex justify-center items-center gap-2 border border-dashed border-[#d2d7df] p-2 rounded-md"
                onClick={() => {
                  const newFormData = [...formData];
                  newFormData[index].review_sources.push({
                    review_source: "",
                    error: "",
                  });
                  setFormData(newFormData);
                }}
              >
                <AiOutlinePlus className="text-black-50 text-base" />
                <span className="text-black-50 text-base">
                  Add review source
                </span>
              </button>
            </div>
          </>
        );
      })}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-base">More Methodologies</label>
        <button
          className="flex justify-center items-center gap-2 border border-dashed border-[#d2d7df] p-2 rounded-md"
          // onClick={() => handleAddNewMethodology()}
          onClick={() => {
            const newFormData = [...formData];
            newFormData.push(initialFormData);
            setFormData(newFormData);
          }}
        >
          <AiOutlinePlus className="text-black-50 text-base" />
          <span className="text-black-50 text-base">Add Methodology</span>
        </button>
      </div>
      <OutputLength
        label={"Output length"}
        labelSize={"text-base"}
        labelFontWeight={"font-medium"}
        setValue={(maxLength) => setMaxTokens(maxLength)}
      ></OutputLength>
      <DocActionButton
        isPrimary={true}
        text={"Compose"}
        isLoading={loading}
        clickAction={() => {
          handleClick();
        }}
      ></DocActionButton>
      {/* <DocActionButton
          isPrimary={false}
          text={"Next"}
          width={"w-1/2"}
          clickAction={() => {
            handleNext();
          }}
        ></DocActionButton> */}
    </div>
  );
};
