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
  handleNext,
  handleAddNewMethodology,
  editor,
}) => {
  const [maxTokens, setMaxTokens] = useState(200);

  const [reviewSources, setReviewSources] = useState([]);

  const [methodology, setMethodology] = useState("");

  const handleMethodologyChange = (option) => {
    setMethodology(option);
    // only show matching strings in the dropdown
    const newOptions = availableOptions.filter((availableOption) => {
      return availableOption.toLowerCase().includes(option.toLowerCase());
    });
    setOptions(newOptions);
  };

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    let methodologyPrompt = factcheckMethodologyPrompt;

    methodologyPrompt = methodologyPrompt.replace(
      "{article_written_till_now}",
      editor?.getHTML()
    );

    methodologyPrompt = methodologyPrompt.replace("{methodology}", methodology);

    methodologyPrompt = methodologyPrompt.replace(
      "{review_sources}",
      reviewSources
        ?.map((review_source) => review_source.review_source)
        .join(", ")
    );

    const request = {
      input: methodologyPrompt,
      provider: "openai",
      max_tokens: maxTokens,
      model: "gpt-3.5-turbo",
      stream: false,
      additional_instructions:
        "The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text.",
    };

    const response = await generateTextFromPrompt(request);

    handleCompose(response?.output?.replace(/\n|\t|(?<=>)\s*/g, ""));
    setLoading(false);
  };

  const availableOptions = [
    "Reverse image search",
    "Extracted key frames from the viral video and did a reverse image search on the keyframes",
    "Google search with relevant keywords",
    "Youtube search with relevant keywords",
    "Lok sabha website search",
    "Rajya sabha website search",
    " Official website search ",
  ];
  const [options, setOptions] = useState(availableOptions);
  return (
    <div className="p-7 bg-white rounded-lg flex flex-col gap-8">
      <SearchableInput
        label={"Methodology"}
        onChange={handleMethodologyChange}
        placeholder={"Methodology goes here..."}
        listOptions={options}
        labelSize={"text-base"}
        labelFontWeight={"font-medium"}
        initialValue={methodology}
      ></SearchableInput>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-base">Review sources</label>
        {reviewSources.map((reviewSource, index) => {
          // return an input with a cross icon at right
          return (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-[95fr_5fr] items-center gap-2 justify-center">
                <input
                  className="p-2 border border-[#D0D5DD] rounded-md bg-transparent outline-none"
                  placeholder="Review source goes here..."
                  value={reviewSource.review_source}
                  onChange={(e) => {
                    const newReviewSource = [...reviewSources];
                    newReviewSource[index].review_source = e.target.value;
                    if (!isURL(e.target.value)) {
                      newReviewSource[index].error = "Please enter a valid URL";
                    } else {
                      newReviewSource[index].error = "";
                    }

                    setReviewSources(newReviewSource);
                  }}
                ></input>
                <RxCross2
                  className="text-black-50 text-lg cursor-pointer"
                  onClick={() => {
                    const newClaimSources = [...reviewSources];
                    newClaimSources.splice(index, 1);
                    setReviewSources(newClaimSources);
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
            setReviewSources([
              ...reviewSources,
              {
                review_source: "",
                error: "",
              },
            ]);
          }}
        >
          <AiOutlinePlus className="text-black-50 text-base" />
          <span className="text-black-50 text-base">Add review source</span>
        </button>
      </div>
      <OutputLength
        label={"Output length"}
        labelSize={"text-base"}
        labelFontWeight={"font-medium"}
        setValue={(maxLength) => setMaxTokens(maxLength)}
      ></OutputLength>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-base">More Methodologies</label>
        <button
          className="flex justify-center items-center gap-2 border border-dashed border-[#d2d7df] p-2 rounded-md"
          onClick={() => handleAddNewMethodology()}
        >
          <AiOutlinePlus className="text-black-50 text-base" />
          <span className="text-black-50 text-base">Add Methodology</span>
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <DocActionButton
          isPrimary={true}
          text={"Compose"}
          isLoading={loading}
          width={"w-1/2"}
          clickAction={() => {
            handleClick();
          }}
        ></DocActionButton>
        <DocActionButton
          isPrimary={false}
          text={"Next"}
          width={"w-1/2"}
          clickAction={() => {
            handleNext();
          }}
        ></DocActionButton>
      </div>
    </div>
  );
};
