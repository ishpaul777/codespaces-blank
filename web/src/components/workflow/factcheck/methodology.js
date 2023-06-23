import { useEffect, useState } from "react";
import { Input } from "../../inputs/Input";
import { OutputLength } from "../../length/output_length";
import { RxCross2 } from "react-icons/rx";
import { isURL } from "../../../util/validateRegex";
import { AiOutlinePlus } from "react-icons/ai";
import { DocActionButton } from "../../buttons/DocActionButton";
import { SearchableInput } from "../../inputs/searchableInput";

export const Methodology = ({
  handleCompose,
  handleNext,
  handleAddNewMethodology,
}) => {
  const handleChange = () => {};

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
      {/* <Input
        label={"Methodology"}
        onChange={handleChange}
        placeholder={"Methodology goes here..."}
        type={"input"}
      ></Input> */}
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
                  value={reviewSource.claim_source}
                  onChange={(e) => {
                    const newClaimSources = [...reviewSources];
                    newClaimSources[index].claim_source = e.target.value;
                    if (!isURL(e.target.value)) {
                      newClaimSources[index].error = "Please enter a valid URL";
                    } else {
                      newClaimSources[index].error = "";
                    }

                    setReviewSources(newClaimSources);
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
          width={"w-1/2"}
          clickAction={() => {
            handleCompose();
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
