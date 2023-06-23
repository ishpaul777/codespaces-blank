import { useState } from "react";
import { Input } from "../../inputs/Input";
import { OutputLength } from "../../length/output_length";
import { DocActionButton } from "../../buttons/DocActionButton";

export const FactcheckConclusion = () => {
  const [maxTokens, setMaxTokens] = useState(200);
  const handleChange = () => {};
  return (
    <div className="p-7 bg-white rounded-lg flex flex-col gap-8">
      <Input
        label={
          "What are the points that you want to highlight in the conclusion?"
        }
        onChange={handleChange}
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
        clickAction={() => {}}
      ></DocActionButton>
    </div>
  );
};
