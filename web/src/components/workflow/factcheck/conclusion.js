import { useState } from "react";
import { Input } from "../../inputs/Input";
import { OutputLength } from "../../length/output_length";
import { DocActionButton } from "../../buttons/DocActionButton";
import { factcheckConclusionPrompt } from "../../../constants/factcheck";
import { generateTextFromPrompt } from "../../../actions/text";

export const FactcheckConclusion = ({
  handleSubmit,
  editor
}) => {
  const [maxTokens, setMaxTokens] = useState(200);
  const [highlights, setHighlights] = useState('');

  const handleChange = (e) => {
    setHighlights(e.target.value)
  };

  const [loading, setLoading] = useState();

  const handleClick = async () => {
    setLoading(true)
    let conclusionPrompt = factcheckConclusionPrompt;
    conclusionPrompt = conclusionPrompt.replace(
      "{article_written_till_now}",
      editor?.getHTML()
    )

    conclusionPrompt = conclusionPrompt.replace(
      "{highlights}",
      highlights
    )

    const request = {
      input: conclusionPrompt,
      provider: "openai",
      max_tokens: maxTokens,
      model: "gpt-3.5-turbo",
      stream: false,
      additional_instructions:
        "The generated text should be valid html body tags(IMPORTANT). Avoid other tags like <html>, <body>. avoid using newlines in the generated text.",
    };

    const response = await generateTextFromPrompt(request);

    handleSubmit(response?.output?.replace(/\n|\t|(?<=>)\s*/g, ""));
    setLoading(false);

  };

  return (
    <div className="p-7 bg-white rounded-lg flex flex-col gap-8">
      <Input
        label={
          "What are the points that you want to highlight in the conclusion?"
        }
        onChange={handleChange}
        name={'highlights'}
        placeholder={"enter the highlights here..."}
      ></Input>
      <OutputLength
        setValue={(maxLength) => setMaxTokens(maxLength)}
        label={"Output length"}
        labelSize={"text-base"}
        labelFontWeight={"font-medium"}
      ></OutputLength>
      <DocActionButton
        isPrimary={true}
        text={"Compose"}
        clickAction={() => {
          handleClick()
        }}
        isLoading={loading}
      ></DocActionButton>
    </div>
  );
};
