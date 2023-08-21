import { useState } from "react";
import { DocActionButton } from "../../buttons/DocActionButton";

export const SocialMediaSelection = ({ handleSubmit, loading }) => {
  const [socialMediaPlatform, setSocialMediaPlatform] = useState([
    {
      name: "Facebook",
      checked: false,
    },
    {
      name: "Instagram",
      checked: false,
    },
    {
      name: "Twitter",
      checked: false,
    },
    {
      name: "LinkedIn",
      checked: false,
    },
    {
      name: "Youtube",
      checked: false,
    }
  ]);

  const outputLength = [1, 2, 3, 4, 5];

  const [nOfOutput, setNOfOutput] = useState(1);

  const [error, setError] = useState("");
  const validateForm = () => {
    // if none of the social media platform is selected
    if (socialMediaPlatform.every((item) => !item.checked)) {
      setError("Please select at least one social media platform");
      return true;
    }
  };
  const handleClick = () => {
    if (validateForm()) {
      return;
    }
    const selectedSocialMedia = socialMediaPlatform
      .filter((item) => item.checked)
      .map((item) => item.name.toLowerCase());
    handleSubmit(selectedSocialMedia, nOfOutput);
  };
  return (
    <div className="p-7 bg-white dark:bg-background-secondary-alt dark:text-white text-black-50 rounded-lg flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className={` text-black-50 dark:text-white text-sm font-normal`}>
          Select Social Media Platforms
        </label>
        <div className="flex flex-col gap-1">
          {socialMediaPlatform.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox rounded-md"
                checked={item.checked}
                onChange={() => {
                  const temp = [...socialMediaPlatform];
                  if (!temp[index].checked) {
                    setError("");
                  }
                  temp[index].checked = !temp[index].checked;
                  setSocialMediaPlatform(temp);
                }}
              />
              <label
                className={` text-black-50 dark:text-white text-sm font-normal`}
              >
                {item.name}
              </label>
            </div>
          ))}
          <span className="text-red-500 text-xs">{error}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className={` text-black-50 dark:text-white text-sm font-normal`}>
          Number of Outputs
        </label>
        <div className="flex gap-1">
          {/* small buttons with no. of outputs on them  */}
          {outputLength.map((item, index) => (
            <button
              key={index}
              className={`p-2 ${
                item === nOfOutput
                  ? "border-black border rounded-md"
                  : "border-none"
              }`}
              onClick={() => {
                setNOfOutput(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <DocActionButton
        text="Generate Content"
        isLoading={loading}
        isPrimary={true}
        clickAction={(e) => {
          e.preventDefault();
          handleClick();
        }}
      />
    </div>
  );
};
