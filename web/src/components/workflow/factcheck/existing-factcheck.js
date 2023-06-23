import { useState } from "react";
import { OutputLength } from "../../length/output_length";
import { DocActionButton } from "../../buttons/DocActionButton";

export const ExistingFactcheck = ({ handleSubmit, handleSkip }) => {
  const [maxTokens, setMaxTokens] = useState(200);

  return (
    <div className="p-7 bg-white rounded-lg flex flex-col gap-8">
      <p>
        Searches for existing Fact Checks in SACH and generate content
        accordingly. SACH (Search Application for Claims & Hoaxes) is a web
        based search application that enables one to search for fact-checks
        published by organizations around the world using text.
      </p>
      <OutputLength
        label={"Output length"}
        setValue={(output) => {
          setMaxTokens(output);
        }}
        labelFontWeight={"font-medium"}
        labelSize={"text-base"}
      ></OutputLength>
      <div className="flex gap-2 items-center">
        <DocActionButton
          isPrimary={true}
          text={"Search and Compose"}
          width={"w-1/2"}
          clickAction={() => {
            handleSubmit("o");
          }}
        ></DocActionButton>
        <DocActionButton
          isPrimary={false}
          text={"Skip"}
          width={"w-1/2"}
          clickAction={() => handleSkip()}
        ></DocActionButton>
      </div>
    </div>
  );
};
