import { useState } from "react";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
export function Input({
  label,
  onChange,
  initialValue,
  placeholder,
  type,
  disabled,
  error,
  name,
  labelSize,
  labelFontWeight,
  required = false,
  showLabel = true,
  backgroundColor = "transparent",
  padding = "p-2",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {showLabel && (
        <label
          className={` text-black-50 dark:text-white
          ${labelSize || "text-sm"}
          ${labelFontWeight || "font-normal"}
          `}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {type === "input" ? (
        <input
          name={name}
          className={`${padding} ${
            "bg-" + backgroundColor
          } outline-none border border-[#D0D5DD] rounded-lg dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b]
          ${disabled && "disabled:cursor-not-allowed"}`}
          placeholder={placeholder}
          value={initialValue}
          onChange={onChange}
          disabled={disabled || false}
        ></input>
      ) : type === "password" ? (
        <div className="flex items-center border border-[#D0D5DD] rounded-md bg-white w-full">
          <input
            value={initialValue}
            onChange={onChange}
            className={`${padding} outline-none border-none bg-transparent w-full`}
            type={showPassword ? "text" : "password"}
            name={name}
            placeholder={placeholder}
          />
          <button
            type="button"
            className={`px-2 focus:outline-none`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5" />
            ) : (
              <AiOutlineEye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      ) : (
        <textarea
          className={`${padding} bg-transparent resize-none outline-none border border-[#D0D5DD] rounded-lg dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b] ${
            disabled && "disabled:cursor-not-allowed"
          }`}
          placeholder={placeholder}
          value={initialValue}
          onChange={onChange}
          rows={4}
          disabled={disabled || false}
          name={name}
        ></textarea>
      )}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
