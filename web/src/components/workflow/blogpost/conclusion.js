import { useState } from "react";
import { Input } from "../../inputs/Input";
import { OutputLength } from "../../length/output_length";
import { DocActionButton } from "../../buttons/DocActionButton";
import { generateTextFromPrompt } from "../../../actions/text";

export const Conclusion = ({ outline, handleCompose, editor, tone }) => {
  const [maxTokens, setMaxTokens] = useState(100);

  const [loading, setLoading] = useState(false);

  const [conclusionForm, setConclusionForm] = useState({
    outline: {
      value: outline,
      error: "",
    },
    tone: {
      value: "",
      error: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormObject = { ...conclusionForm };
    if (name === "outline") {
      if (value.length > 0) {
        newFormObject[name].error = "";
      } else {
        newFormObject[name].error = "This field is required";
      }
    }

    newFormObject[name].value = value;
    setConclusionForm(newFormObject);
  };

  const validateForm = () => {
    const newFormObject = { ...conclusionForm };
    let isValid = true;
    Object.keys(newFormObject).forEach((key) => {
      if (key === "outline") {
        if (newFormObject[key].value.length === 0) {
          newFormObject[key].error = "This field is required";
          isValid = false;
        }
      }
    });
    setConclusionForm(newFormObject);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    let prompt = `Generate a conclusion having exactly ${getWordsForConclusion(
      maxTokens
    )} words that wraps up the outline - ${
      conclusionForm.outline.value
    } discussed in the blog post. The tone of voice should be [${tone}]. The previous content is ${editor?.getHTML()}`;

    const requestBody = {
      input: prompt,
      provider: "openai",
      model: "gpt-3.5-turbo",
      stream: false,
      additional_instructions:
        "The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text.",
    };

    const response = await generateTextFromPrompt(requestBody);
    handleCompose(response.output.replace(/\n|\t|(?<=>)\s*/g, ""));
    setLoading(false);
  };

  function getWordsForConclusion(max) {
    switch (max) {
      case 100:
        return 30;
      case 200:
        return 60;
      case 300:
        return 90;
      default:
        return Math.floor(max / 4);
    }
  }

  return (
    <div className="p-7 bg-white dark:bg-background-secondary-alt rounded-lg flex flex-col gap-8">
      <Input
        type={"textarea"}
        label={"Blog Outline"}
        initialValue={conclusionForm.outline.value}
        placeholder={"Enter a blog outline..."}
        labelFontWeight={"font-medium"}
        labelFontSize={"text-base"}
        onChange={handleChange}
        name={"outline"}
        error={conclusionForm.outline.error}
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
        clickAction={() => {
          handleSubmit();
        }}
        isLoading={loading}
        isPrimary={true}
      />
    </div>
  );
};
