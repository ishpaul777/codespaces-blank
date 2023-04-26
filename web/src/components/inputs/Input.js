export function Input({ label, onChange, initialValue, placeholder, type }) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      {type === "input" ? (
        <input
          className="p-2 border border-[#CED0D4] rounded-md bg-transparent"
          placeholder={placeholder}
          value={initialValue}
          onChange={onChange}
        ></input>
      ) : (
        <textarea
          className="p-2 border border-[#CED0D4] rounded-md bg-transparent resize-none"
          placeholder={placeholder}
          value={initialValue}
          onChange={onChange}
        ></textarea>
      )}
    </div>
  );
}
