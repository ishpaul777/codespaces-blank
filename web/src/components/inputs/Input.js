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
        ></textarea>
      )}
    </div>
  );
}
