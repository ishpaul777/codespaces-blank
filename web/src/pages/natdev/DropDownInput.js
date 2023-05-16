import React, { useState } from "react";

import down from "../../assets/icons/down.svg";
const DropdownInput = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = ["EleutherAI/GPT-NeoX", "Option 2", "Option 3"];

  const handleOptionSelect = (value) => {
    setSelectedValue(value);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div
        className={`relative inline-block w-full ${
          isDropdownOpen ? "open" : ""
        }`}
      >
        <div
          className="bg-[#ffffff] box-border flex flex-row items-center justify-between gap-2 w-full h-[46px] border shadow-[0px_1px_2px_rgba(16,24,40,0.05)] px-3.5 py-2.5 rounded-lg border-solid border-[#D0D5DD] cursor-pointer focus:border-[#1e1e1e] not-italic font-normal text-sm leading-6 text-[#101828]"
          onClick={toggleDropdown}
        >
          {selectedValue || "Select an option"}
          <img src={down} alt="down" />
        </div>
        {isDropdownOpen && (
          <ul className="absolute w-full border bg-white z-[1] m-0 p-0 rounded-br-[5px] rounded-bl-[5px] border-t-[none] border-solid border-[#ccc] left-0 top-full list-none ">
            {options.map((option, index) => (
              <li
                className="p-[10px] cursor-pointer hover:bg-[#f2f2f2] "
                key={index}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DropdownInput;
