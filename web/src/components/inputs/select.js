import "../../index.css";
import { BiChevronDown } from "react-icons/bi";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

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
    <div className="flex flex-col gap-2 !dark:text-white">
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
          <div
            className="absolute top-full left-0 w-full bg-white border border-[#CED0D4]  dark:bg-background-sidebar-alt dark:border-[#3b3b3b]
           rounded-md z-10 outline-none p-1"
          >
            <button
              className={`w-full py-2 px-3 text-left hover:bg-gray-200 dark:bg-background-secondary-alt rounded
              dark:hover:bg-background-sidebar-alt mb-2
               ${
                 selectedValue.toUpperCase() === "GPT-3.5-TURBO"
                   ? "bg-gray-200 dark:bg-background-sidebar-alt"
                   : ""
               }`}
              onClick={() => handleOptionClick("gpt-3.5-turbo")}
            >
              GPT-3.5-TURBO
            </button>
            <button
              className={`w-full py-2 px-3 text-left hover:bg-gray-200 dark:bg-background-secondary-alt rounded
              dark:hover:bg-background-sidebar-alt  ${
                selectedValue.toUpperCase() === "GPT-4"
                  ? "bg-gray-200 dark:bg-background-sidebar-alt "
                  : ""
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
            <button
              className={`w-full py-2 px-3 text-left hover:bg-gray-200 ${
                selectedValue.toUpperCase() === "Claude 2" ? "bg-gray-200" : ""
              }`}
              onClick={() => handleOptionClick("claude-2")}
            >
              Claude 2
            </button>
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
      active === buttonValue
        ? "bg-black text-white dark:bg-white dark:text-black-50"
        : "bg-gray-200 dark:bg-background-secondary-alt dark:text-white"
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
        className="w-full py-2 slider border border-[#CED0D4] rounded-md bg-transparent accent-black dark:accent-white cursor-pointer"
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

export function SelectInput({
  label,
  onChange,
  value,
  placeholder,
  labelSize,
  labelFontWeight,
  listOptions = [],
  error,
  index,
}) {
  const [showList, setShowList] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          className={`
          ${labelSize || "text-sm"}
          ${labelFontWeight || "font-normal"}
          `}
        >
          {label}
        </label>
      )}
      <div className="w-full flex flex-col">
        <div
          className={`p-2 bg-transparent outline-none dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b] border border-[#D0D5DD] rounded-md flex items-center justify-between cursor-pointer z-0`}
          onClick={() => setShowList((prev) => !prev)}
        >
          <span className={`${!value && "text-gray-400"}`}>
            {value ? value : placeholder}
          </span>
          <div className="flex gap-2">
            {value && (
              <RxCross2
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
              ></RxCross2>
            )}
            <BiChevronDown />
          </div>
        </div>
        {showList && listOptions.length && (
          <div className={`relative w-full z-${50 - index}`}>
            <ul
              className={`absolute w-full bg-white border border-[#D0D5DD] p-2 rounded-lg flex flex-col text-[#1D1D1D] text-opacity-60 cursor-pointer`}
            >
              {listOptions.map((option) => {
                return (
                  <li
                    className="hover:bg-[#F4F4F6] p-2 rounded-md"
                    onClick={() => {
                      onChange(option?.value);
                      setShowList(false);
                    }}
                  >
                    {option?.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
