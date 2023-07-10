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
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className={` text-black-50 dark:text-white
          ${labelSize || "text-sm"}
          ${labelFontWeight || "font-normal"}
          `}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {type === "input" ? (
        <input
          name={name}
          className={`p-2 bg-transparent outline-none border border-[#D0D5DD] rounded-lg dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b]
          ${
            disabled && "disabled:cursor-not-allowed"
          }`}
          placeholder={placeholder}
          value={initialValue}
          onChange={onChange}
          disabled={disabled || false}
        ></input>
      ) : (
        <textarea
          className={`p-2 bg-transparent resize-none outline-none border border-[#D0D5DD] rounded-lg dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b] ${
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
