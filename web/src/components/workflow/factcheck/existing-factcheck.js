import { useState } from "react";
import { DocActionButton } from "../../buttons/DocActionButton";
import { errorToast } from "../../../util/toasts";
import { getRelatedFactcheck } from "../../../actions/sach";

export const ExistingFactcheck = ({
  handleCompose,
  handleSkip,
  title,
  editor,
}) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    getRelatedFactcheck(title, editor?.getText())
      .then((data) => {
        handleCompose(data?.body);
      })
      .catch((error) => {
        errorToast(error?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="p-7 bg-white rounded-lg flex flex-col gap-8">
      <p>
        Searches for existing Fact Checks in SACH and generate content
        accordingly. SACH (Search Application for Claims & Hoaxes) is a web
        based search application that enables one to search for fact-checks
        published by organizations around the world using text.
      </p>
      {/* <OutputLength
        label={"Output length"}
        setValue={(output) => {
          setMaxTokens(output);
        }}
        labelFontWeight={"font-medium"}
        labelSize={"text-base"}
      ></OutputLength> */}
      <div className="flex gap-2 items-center">
        <DocActionButton
          isPrimary={true}
          text={"Search and Compose"}
          width={"w-1/2"}
          isLoading={loading}
          clickAction={() => {
            handleSubmit();
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
