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
}) {
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
      {type === "input" ? (
        <input
          name={name}
          className={`p-2 border border-[#D0D5DD] rounded-md bg-transparent outline-none ${
            disabled && "disabled:cursor-not-allowed"
          }`}
          placeholder={placeholder}
          value={initialValue}
          onChange={onChange}
          disabled={disabled || false}
        ></input>
      ) : (
        <textarea
          className={`p-2 border border-[#D0D5DD] rounded-md bg-transparent resize-none outline-none ${
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
