// SearchableInput contains of an input field and a list of search results
// which is displayed when the input field is focused

import { useState } from "react";

// it will overlay the other components

export function SearchableInput({
  label,
  onChange,
  initialValue,
  placeholder,
  name,
  labelSize,
  labelFontWeight,
  listOptions,
  error,
}) {
  const [showList, setShowList] = useState(false);

  return (
    <div className="flex flex-col gap-2 dark:text-white">
      <label
        className={`
          ${labelSize || "text-sm"}
          ${labelFontWeight || "font-normal"}
          `}
      >
        {label}
      </label>
      <div className="w-full flex flex-col">
        <input
          name={name}
          className={`p-2 bg-transparent outline-none rounded-lg dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b] ${
            showList ? "border-x border-t" : "border"
          } border-[#D0D5DD] ${showList ? "rounded-t-md" : "rounded-md"}`}
          placeholder={placeholder}
          value={initialValue}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowList(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowList(false);
            }, 200);
          }}
        ></input>
        {/*  list of options in the list */}
        {showList && listOptions.length !== 0 && (
          <div className="relative w-full">
            <ul
              className={`absolute w-full bg-white border border-[#D0D5DD] p-2 rounded-b-lg flex flex-col gap-2 text-[#1D1D1D] text-opacity-60 cursor-pointer`}
            >
              {listOptions.map((option) => {
                return (
                  <li
                    className="hover:bg-[#F4F4F6] p-2 rounded-md"
                    onClick={() => {
                      onChange(option);
                      setShowList(false);
                    }}
                  >
                    {option}
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
