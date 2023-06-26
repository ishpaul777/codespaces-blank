import { useState } from "react";
import { Input } from "../../inputs/Input";
import { OutputLength } from "../../length/output_length";
import { AiOutlinePlus } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { isURL } from "../../../util/validateRegex";
import { DocActionButton } from "../../buttons/DocActionButton";
import { factcheckIntroPrompt } from "../../../constants/factcheck";
import { generateTextFromPrompt } from "../../../actions/text";

export const IntroductionForm = ({ handleSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormObject = { ...formObject };
    if (value.length > 0) {
      newFormObject[name].error = "";
    } else {
      newFormObject[name].error = "This field is required";
    }

    newFormObject[name].value = value;
    setFormObject(newFormObject);
  };

  const [claimSources, setClaimSources] = useState([]);

  const [maxTokens, setMaxTokens] = useState(100);

  const [loadingForm, setLoadingForm] = useState(false);

  const validateForm = () => {
    const newFormObject = { ...formObject };
    let isValid = true;
    Object.keys(newFormObject).forEach((key) => {
      if (newFormObject[key].value.length === 0) {
        newFormObject[key].error = "This field is required";
        isValid = false;
      }
    });
    setFormObject(newFormObject);

    if (claimSources.length !== 0) {
      claimSources.forEach((claimSource, index) => {
        if (claimSource.claim_source.length === 0) {
          const newClaimSources = [...claimSources];
          newClaimSources[index].error = "This field is required";
          setClaimSources(newClaimSources);
          isValid = false;
        } else if (!isURL(claimSource.claim_source)) {
          const newClaimSources = [...claimSources];
          newClaimSources[index].error = "Please enter a valid URL";
          setClaimSources(newClaimSources);
          isValid = false;
        }
      });
    }

    return isValid;
  };
  const handleCompose = async () => {
    if (!validateForm()) {
      return;
    }

    setLoadingForm(true);
    let factCheckIntro = factcheckIntroPrompt;
    factCheckIntro = factCheckIntro.replace(
      "{factcheck_title}",
      formObject.fact_check_title.value
    );

    factCheckIntro = factCheckIntro.replace(
      "{claim}",
      formObject.fact_check_claim.value
    );

    factCheckIntro = factCheckIntro.replace(
      "{claimant}",
      formObject.fact_check_claimant.value
    );

    factCheckIntro = factCheckIntro.replace(
      "{claimsources}",
      claimSources.map((claimSource) => claimSource.claim_source).join(", ")
    );

    factCheckIntro = factCheckIntro.replace(
      "{fact}",
      formObject.fact_check_fact.value
    );

    factCheckIntro = factCheckIntro.replace(
      "{rating}",
      formObject.fact_check_rating.value
    );

    const requestBody = {
      input: factCheckIntro,
      provider: "openai",
      model: "gpt-3.5-turbo",
      stream: false,
      additional_instructions: `The generated text should have exactly ${maxTokens} words and be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text.`,
    };

    const response = await generateTextFromPrompt(requestBody);
    setLoadingForm(false);
    handleSubmit({
      output: response?.output?.replace(/\n|\t|(?<=>)\s*/g, ""),
      title: formObject.fact_check_title.value,
    });
  };

  const [formObject, setFormObject] = useState({
    fact_check_title: {
      value: "",
      error: "",
    },
    fact_check_claim: {
      value: "",
      error: "",
    },
    fact_check_claimant: {
      value: "",
      error: "",
    },
    fact_check_fact: {
      value: "",
      error: "",
    },
    fact_check_rating: {
      value: "",
      error: "",
    },
  });

  return (
    <div className="p-7 bg-white rounded-lg flex flex-col gap-8">
      <Input
        label={"Fact check title"}
        onChange={handleChange}
        placeholder={"Factcheck title goes here..."}
        type={"input"}
        error={formObject.fact_check_title.error}
        name={"fact_check_title"}
        labelFontWeight={"font-medium"}
        labelSize={"text-base"}
        initialValue={formObject.fact_check_title.value}
        required={true}
      ></Input>
      <Input
        label={"Claim"}
        onChange={handleChange}
        placeholder={"Claim goes here..."}
        type={"textarea"}
        error={formObject.fact_check_claim.error}
        initialValue={formObject.fact_check_claim.value}
        name={"fact_check_claim"}
        labelFontWeight={"font-medium"}
        labelSize={"text-base"}
        required={true}
      ></Input>
      <Input
        label={"Claimant"}
        onChange={handleChange}
        placeholder={"Claimant goes here..."}
        type={"input"}
        error={formObject.fact_check_claimant.error}
        name={"fact_check_claimant"}
        labelFontWeight={"font-medium"}
        labelSize={"text-base"}
        initialValue={formObject.fact_check_claimant.value}
        required={true}
      ></Input>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-base">Claim sources</label>
        {claimSources.map((claimSource, index) => {
          // return an input with a cross icon at right
          return (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-[95fr_5fr] items-center gap-2 justify-center">
                <input
                  className="p-2 border border-[#D0D5DD] rounded-md bg-transparent outline-none"
                  placeholder="Claim source goes here..."
                  value={claimSource.claim_source}
                  onChange={(e) => {
                    const newClaimSources = [...claimSources];
                    newClaimSources[index].claim_source = e.target.value;
                    if (!isURL(e.target.value)) {
                      newClaimSources[index].error = "Please enter a valid URL";
                    } else {
                      newClaimSources[index].error = "";
                    }

                    setClaimSources(newClaimSources);
                  }}
                ></input>
                <RxCross2
                  className="text-black-50 text-lg cursor-pointer"
                  onClick={() => {
                    const newClaimSources = [...claimSources];
                    newClaimSources.splice(index, 1);
                    setClaimSources(newClaimSources);
                  }}
                />
              </div>
              {claimSource.error && (
                <span className="text-red-500 text-xs">
                  {claimSource.error}
                </span>
              )}
            </div>
          );
        })}
        <button
          className="flex justify-center items-center gap-2 border border-dashed border-[#d2d7df] p-2 rounded-md"
          onClick={() => {
            setClaimSources([
              ...claimSources,
              {
                claim_source: "",
                error: "",
              },
            ]);
          }}
        >
          <AiOutlinePlus className="text-black-50 text-base" />
          <span className="text-black-50 text-base">Add claim source</span>
        </button>
      </div>
      <Input
        label={"Fact"}
        onChange={handleChange}
        placeholder={"Describe the fact here..."}
        type={"textarea"}
        error={formObject.fact_check_fact.error}
        name={"fact_check_fact"}
        labelFontWeight={"font-medium"}
        labelSize={"text-base"}
        initialValue={formObject.fact_check_fact.value}
        required={true}
      ></Input>
      <Input
        label={"Rating"}
        onChange={handleChange}
        placeholder={"Rating of the factcheck"}
        type={"input"}
        error={formObject.fact_check_rating.error}
        initialValue={formObject.fact_check_rating.value}
        name={"fact_check_rating"}
        labelFontWeight={"font-medium"}
        labelSize={"text-base"}
        required={true}
      ></Input>
      <OutputLength
        label={"Output length"}
        setValue={(output) => {
          setMaxTokens(output);
        }}
        labelFontWeight={"font-medium"}
        labelSize={"text-base"}
      ></OutputLength>
      <DocActionButton
        text={"Compose"}
        isPrimary={true}
        isLoading={loadingForm}
        clickAction={() => {
          handleCompose();
        }}
      ></DocActionButton>
    </div>
  );
};
