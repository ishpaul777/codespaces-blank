import { useState } from "react";
import { Input } from "../../inputs/Input";
import { OutputLength } from "../../length/output_length";
import { DocActionButton } from "../../buttons/DocActionButton";
import { generateTextFromPrompt } from "../../../actions/text";

export const ParagraphGenerator = ({
  topic,
  handleCompose,
  editor,
  tone,
  audience,
}) => {
  const [maxTokens, setMaxTokens] = useState(100);

  const [loading, setLoading] = useState(false);

  const [outlineForm, setOutlineForm] = useState({
    about: {
      value: "" || topic,
      error: "",
    },
    keywords: {
      value: "",
      error: "",
    },
  });

  console.log();
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormObject = { ...outlineForm };
    if (name === "about") {
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
      if (key === "about") {
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
    let prompt = `You are writing a blog post with the following subheading: [${
      outlineForm.about.value
    }]. The keywords for the blog post are [${
      outlineForm.keywords.value
    }]. The tone of voice is [${tone}] and the targeted audience is [${audience}]. The previous content of the blog is ${editor?.getHTML()}. Generate a paragraph that elaborates on the subheading using the provided keywords and tone of voice. Your response should have exactly ${maxTokens} words and should include the subheading as h2 tag and generated paragraph as p tag. The paragraph should not mention what tone of voice is used and the audience targeted(!IMPORTANT).
    `;

    const requestBody = {
      input: prompt,
      provider: "openai",
      max_tokens: maxTokens,
      model: "gpt-3.5-turbo",
      stream: false,
    };

    const response = await generateTextFromPrompt(requestBody);

    const responseHTML = response.output?.replace(/\n|\t|(?<=>)\s*/g, "");
    handleCompose(responseHTML);
    setLoading(false);
    // Remove leading and trailing whitespace from each element
  };

  return (
    <div className="p-7 bg-white dark:bg-background-secondary-alt rounded-lg flex flex-col gap-8">
      <Input
        type={"input"}
        label={"What is your paragraph about?"}
        placeholder={"describe this point"}
        labelFontWeight={"font-medium"}
        labelFontSize={"text-base"}
        name={"about"}
        initialValue={outlineForm.about.value}
        onChange={handleChange}
        error={outlineForm.about.error}
        required={true}
      ></Input>
      <Input
        type={"input"}
        label={"Keywords to include"}
        placeholder={"kind, helpful, etc."}
        labelFontWeight={"font-medium"}
        labelFontSize={"text-base"}
        name={"keywords"}
        initialValue={outlineForm.keywords.value}
        onChange={handleChange}
        error={outlineForm.keywords.error}
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
