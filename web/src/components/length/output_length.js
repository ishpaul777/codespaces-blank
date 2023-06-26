import { useState } from "react";
import { SizeButton } from "../buttons/SizeButton";

export const OutputLength = ({
  setValue,
  label,
  labelSize,
  labelFontWeight,
}) => {
  const [customLength, setCustomLength] = useState(50);

  let outputLengthList = [
    {
      maxLength: 100,
      title: "S",
    },
    {
      maxLength: 200,
      title: "M",
    },
    {
      maxLength: 300,
      title: "L",
    },
    {
      title: "Custom",
      maxLength: customLength,
    },
  ];

  const [selectedOutputLength, setSelectedOutputLength] = useState({
    length: 100,
    name: "S",
  });

  // handleChangeInOutputSize is a handler for output length actions
  const handleChangeInOutputSize = (maxSize, title, isCustom) => {
    if (isCustom) {
      setSelectedOutputLength({ length: maxSize, name: title });
      setValue(maxSize);
    } else {
      setSelectedOutputLength({ length: maxSize, name: title });
      setValue(maxSize);
    }
  };

  // handleCustomLengthChange is a handler for custom length input
  const handleCustomLengthChange = (value) => {
    let valueInInt = parseInt(value);
    if (isNaN(valueInInt)) {
      valueInInt = 0;
    }
    setCustomLength(valueInInt);
    setSelectedOutputLength({ length: valueInInt, name: "Custom" });
    setValue(valueInInt);
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`
          ${labelSize || "text-sm"}
          ${labelFontWeight || "font-normal"}
          `}
      >
        {label}
      </label>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          {outputLengthList.map((item, index) => {
            let isCustom = item.title === "Custom";
            return (
              <SizeButton
                clickAction={handleChangeInOutputSize}
                key={index}
                title={item.title}
                isSelected={
                  isCustom
                    ? customLength === selectedOutputLength.length
                    : item.maxLength === selectedOutputLength.length
                }
                maxSize={isCustom ? customLength : item.maxLength}
                isCustom={isCustom}
              />
            );
          })}
        </div>
        {selectedOutputLength.name === "Custom" && (
          <input
            min={100}
            className="p-2 rounded border"
            type="number"
            placeholder="enter custom output length"
            onChange={(e) => handleCustomLengthChange(e.target.value)}
            defaultValue={customLength}
            oninput="validity.valid||(value='');"
          />
        )}
      </div>
    </div>
  );
};
