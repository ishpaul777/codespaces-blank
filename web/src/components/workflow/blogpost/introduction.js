import { useState } from "react";
import { Input } from "../../inputs/Input";
import { OutputLength } from "../../length/output_length";
import { DocActionButton } from "../../buttons/DocActionButton";
import { generateTextFromPrompt } from "../../../actions/text";

export const Introduction = ({ contentBrief, handleCompose, loading }) => {
  const [maxTokens, setMaxTokens] = useState(100);
  const [introductionForm, setIntroductionForm] = useState({
    title: {
      value: "",
      error: "",
    },
    audience: {
      value: "",
      error: "",
    },
    tone: {
      value: "",
      error: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormObject = { ...introductionForm };
    if (name === "title") {
      if (value.length > 0) {
        newFormObject[name].error = "";
      } else {
        newFormObject[name].error = "This field is required";
      }
    }

    newFormObject[name].value = value;
    setIntroductionForm(newFormObject);
  };

  const validateForm = () => {
    const newFormObject = { ...introductionForm };
    let isValid = true;
    Object.keys(newFormObject).forEach((key) => {
      if (key === "title") {
        if (newFormObject[key].value.length === 0) {
          newFormObject[key].error = "This field is required";
          isValid = false;
        }
      }
    });
    setIntroductionForm(newFormObject);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    let prompt = `
    Title: [${introductionForm.title.value}]
    Audience: [${introductionForm.audience.value}]
    Tone of Voice: [${introductionForm.tone.value}}]
    Tone of Voice: [${contentBrief}]
    Generate a title and an introduction for your blog that captures the attention of your target audience and sets the tone for the rest of the content. Ensure it aligns with the given title, reflects the interests of the audience, conveys the desired tone of voice and incorporates the key points from the provided content brief. It should have around ${maxTokens}-${
      maxTokens + 20
    } words. Use h1 tag for the title and p tag for the introduction paragraph.
    `;

    const requestBody = {
      input: prompt,
      provider: "openai",
      max_tokens: maxTokens,
      additional_instructions:
        "The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text.",
    };

    // const response = await generateTextFromPrompt(requestBody);
    handleCompose(
      requestBody,
      introductionForm.title.value,
      introductionForm.tone.value,
      introductionForm.audience.value
    );
  };
  return (
    <div className="p-7 bg-white dark:bg-background-secondary-alt rounded-lg flex flex-col gap-8">
      <Input
        type={"input"}
        label={"Blog Title"}
        placeholder={"Enter a title for your blog..."}
        labelFontWeight={"font-medium"}
        labelFontSize={"text-base"}
        name={"title"}
        onChange={handleChange}
        initialValue={introductionForm.title.value}
        error={introductionForm.title.error}
        required={true}
      ></Input>
      <Input
        type={"input"}
        label={"Audience"}
        labelFontWeight={"font-medium"}
        labelFontSize={"text-base"}
        placeholder={"writer, traveller, etc..."}
        name={"audience"}
        onChange={handleChange}
        initialValue={introductionForm.audience.value}
        error={introductionForm.audience.error}
      ></Input>
      <Input
        type={"input"}
        label={"Tone of voice"}
        labelFontWeight={"font-medium"}
        labelFontSize={"text-base"}
        placeholder={"formal, informal, etc..."}
        name={"tone"}
        onChange={handleChange}
        initialValue={introductionForm.tone.value}
        error={introductionForm.tone.error}
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
        clickAction={() => {
          handleSubmit();
        }}
        isLoading={loading}
        isPrimary={true}
      />
    </div>
  );
};
