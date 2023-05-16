export function Input({
  label,
  onChange,
  initialValue,
  placeholder,
  type,
  disabled,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      {type === "input" ? (
        <input
          className={`p-2 border border-[#CED0D4] rounded-md bg-transparent ${
            disabled && "disabled:cursor-not-allowed"
          }`}
          placeholder={placeholder}
          value={initialValue}
          onChange={onChange}
          disabled={disabled || false}
        ></input>
      ) : (
        <textarea
          className={`p-2 border border-[#CED0D4] rounded-md bg-transparent resize-none ${
            disabled && "disabled:cursor-not-allowed"
          }`}
          placeholder={placeholder}
          value={initialValue}
          onChange={onChange}
          rows={4}
          disabled={disabled || false}
        ></textarea>
      )}
    </div>
  );
}
