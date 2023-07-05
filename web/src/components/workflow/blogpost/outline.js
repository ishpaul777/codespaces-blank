import { useEffect, useState } from "react";
import { Input } from "../../inputs/Input";
import { OutputLength } from "../../length/output_length";
import { DocActionButton } from "../../buttons/DocActionButton";
import { generateTextFromPrompt } from "../../../actions/text";

export const Outline = ({ handleCompose, title, audience, tone }) => {
  const [maxTokens, setMaxTokens] = useState(3);

  const [output, setOutput] = useState({
    output: "",
    visibility: false,
  });

  const [loading, setLoading] = useState(false);

  const [outlineForm, setOutlineForm] = useState({
    topic: {
      value: "",
      error: "",
    },
  });

  useEffect(() => {
    setOutlineForm({
      topic: {
        value: title,
        error: "",
      },
    });
  }, [title, audience, tone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormObject = { ...outlineForm };
    if (name === "topic") {
      if (value.length > 0) {
        newFormObject[name].error = "";
      } else {
        newFormObject[name].error = "This field is required";
      }
    }

    newFormObject[name].value = value;
    setOutlineForm(newFormObject);
  };

  const validateForm = () => {
    const newFormObject = { ...outlineForm };
    let isValid = true;
    Object.keys(newFormObject).forEach((key) => {
      if (key === "topic") {
        if (newFormObject[key].value.length === 0) {
          newFormObject[key].error = "This field is required";
          isValid = false;
        }
      }
    });
    setOutlineForm(newFormObject);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    let prompt = `You are writing a blog post on [${outlineForm.topic.value}] targeting [${audience}]. The tone of the blog should be [${tone}]. Please generate an outline for the blog post, providing relevant points. The outline should be a numbered list with exactly ${maxTokens} items and each item should have at max 10-15 words. The output format would be  - 1.<outline point>, 2.<outline point>, etc. it should strictly not contain any other text then the numbered list. It should not contain points like introduction, conclusion, etc.`;

    const requestBody = {
      input: prompt,
      provider: "openai",
      model: "gpt-3.5-turbo",
      stream: false,
    };

    const response = await generateTextFromPrompt(requestBody);
    setLoading(false);
    setOutput({
      output: response.output,
      visibility: true,
    });

    // Remove leading and trailing whitespace from each element
  };

  const handleNext = () => {
    handleCompose(output.output);
  };

  function getOutlinePointsFromNumberofTokens(numberOfTokens) {
    switch (numberOfTokens) {
      case 100:
        return 3;
      case 200:
        return 5;
      case 300:
        return 7;
      default:
        return Math.floor(numberOfTokens / 45);
    }
  }

  return (
    <div className="p-7 bg-white rounded-lg flex flex-col gap-8">
      <Input
        type={"input"}
        label={"Blog Post Outline Topic "}
        placeholder={"Describe your outline..."}
        labelFontWeight={"font-medium"}
        labelFontSize={"text-base"}
        onChange={handleChange}
        initialValue={outlineForm.topic.value}
        error={outlineForm.topic.error}
        name={"topic"}
        required={true}
      ></Input>
      {/* <Input
        type={"input"}
        label={"Audience"}
        labelFontWeight={"font-medium"}
        labelFontSize={"text-base"}
        initialValue={outlineForm.audience.value}
        placeholder={"writer, traveller, etc..."}
        onChange={handleChange}
        error={outlineForm.audience.error}
        name={"audience"}
      ></Input> */}
      {/* <Input
        type={"input"}
        label={"Tone of voice"}
        initialValue={outlineForm.tone.value}
        labelFontWeight={"font-medium"}
        labelFontSize={"text-base"}
        placeholder={"formal, informal, etc..."}
        onChange={handleChange}
        error={outlineForm.tone.error}
        name={"tone"}
      ></Input> */}
      <OutputLength
        label={"Output length"}
        setValue={(output) => {
          const nOfPoints = getOutlinePointsFromNumberofTokens(output);
          setMaxTokens(nOfPoints);
        }}
        labelFontWeight={"font-medium"}
        labelSize={"text-base"}
      ></OutputLength>
      {output.visibility && (
        <Input
          label={"Output"}
          placeholder={"Generated output"}
          type={"textarea"}
          labelFontWeight={"font-medium"}
          labelSize={"text-base"}
          initialValue={output.output}
        ></Input>
      )}
      <div className={`grid gap-2 ${output.visibility ? "grid-cols-2" : "grid-cols-1"}
      `}>
        <DocActionButton
          text={output.visibility ? "Regenerate" : "Generate"}
          clickAction={() => {
            handleSubmit();
          }}
          isLoading={loading}
          isPrimary={true}
        />
        {output.visibility && (
          <DocActionButton
            text={"Next"}
            clickAction={() => {
              handleNext();
            }}
            isLoading={false}
          />
        )}
      </div>
    </div>
  );
};
