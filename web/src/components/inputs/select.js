import "../../index.css";
import { BiChevronDown } from "react-icons/bi";
import React, { useState } from "react";

export function Select({
  label,
  onChange,
  initialValue,
  placeholder,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    initialValue.toUpperCase()
  );

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    onChange({ target: { value } });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <div className="relative">
        <button
          className="w-full py-3 px-3 border border-[#CED0D4] rounded-md bg-transparent text-left flex items-center justify-between outline-none"
          onClick={handleToggleDropdown}
        >
          {selectedValue ? selectedValue.toUpperCase() : placeholder}
          <BiChevronDown className="inline-block ml-2" />
        </button>
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 w-full bg-white border border-[#CED0D4] rounded-md z-10 outline-none">
            <button
              className={`w-full py-2 px-3 text-left hover:bg-gray-200 ${
                selectedValue.toUpperCase() === "GPT-3.5-TURBO"
                  ? "bg-gray-200"
                  : ""
              }`}
              onClick={() => handleOptionClick("gpt-3.5-turbo")}
            >
              GPT-3.5-TURBO
            </button>
            <button
              className={`w-full py-2 px-3 text-left hover:bg-gray-200 ${
                selectedValue.toUpperCase() === "GPT-4" ? "bg-gray-200" : ""
              }`}
              onClick={() => handleOptionClick("gpt-4")}
            >
              GPT-4
            </button>
            <button
              className={`w-full py-2 px-3 text-left hover:bg-gray-200 ${
                selectedValue.toUpperCase() === "CHAT-BISON@001"
                  ? "bg-gray-200"
                  : ""
              }`}
              onClick={() => handleOptionClick("chat-bison@001")}
            >
              Chat Bison(Google)
            </button>
            {/* <button
              className={`w-full py-2 px-3 text-left hover:bg-gray-200 ${
                selectedValue.toUpperCase() === "GPT-4" ? "bg-gray-200" : ""
              }`}
              onClick={() => handleOptionClick("claude-v1.3")}
            >
              Claude-v1.3
            </button>
            <button
              className={`w-full py-2 px-3 text-left hover:bg-gray-200 ${
                selectedValue.toUpperCase() === "GPT-4" ? "bg-gray-200" : ""
              }`}
              onClick={() => handleOptionClick("claude-v1.2")}
            >
              Claude-v1.2
            </button>
            <button
              className={`w-full py-2 px-3 text-left hover:bg-gray-200 ${
                selectedValue.toUpperCase() === "GPT-4" ? "bg-gray-200" : ""
              }`}
              onClick={() => handleOptionClick("claude-v1.3-100k")}
            >
              Claude-v1.3-100k
            </button>
            <button
              className={`w-full py-2 px-3 text-left hover:bg-gray-200 ${
                selectedValue.toUpperCase() === "GPT-4" ? "bg-gray-200" : ""
              }`}
              onClick={() => handleOptionClick("claude-instant-v1")}
            >
              Claude-instant-v1
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
}

// #EAEAEA
export function SelectTemperature({
  label,
  description,
  onChange,
  initialValue,
  value,
}) {
  const active =
    value < 0.5 ? "Precise" : value == 0.5 ? "Neutral" : "Creative";

  const getButtonClassName = (buttonValue) => {
    return `py-3 rounded-md w-1/3 ${
      active === buttonValue ? "bg-black text-white" : "bg-gray-200"
    }`;
  };

  return (
    <div placeholder="flex flex-col gap-2 mt-2">
      <label>{label}</label>
      <div className="flex justify-between w-full gap-2 mt-2">
        <button
          className={getButtonClassName("Precise")}
          onClick={() => onChange({ target: { value: 0.1 } })}
        >
          Precise
        </button>
        <button
          className={getButtonClassName("Neutral")}
          onClick={() => onChange({ target: { value: 0.5 } })}
        >
          Neutral
        </button>
        <button
          className={getButtonClassName("Creative")}
          onClick={() => onChange({ target: { value: 1 } })}
        >
          Creative
        </button>
      </div>
      <input
        className="w-full py-2 slider border border-[#CED0D4] rounded-md bg-transparent accent-black cursor-pointer"
        onChange={onChange}
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={value}
      />
      <div className="flex justify-between w-full">
        <span>0</span>
        <span>0.5</span>
        <span>1</span>
      </div>
    </div>
  );
}
