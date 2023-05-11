export function Select({ label, onChange, initialValue, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <select
        className="p-2 border border-[#CED0D4] rounded-md bg-transparent"
        initialValue={initialValue}
        onChange={onChange}
        placeholder={placeholder}
      >
        <option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
        <option value="gpt-4">GPT 4</option>
      </select>
    </div>
  );
}

export function SelectTemperature({
  label,
  description,
  onChange,
  initialValue,
  value,
}) {
  return (
    <div placeholder="flex flex-col gap-2">
      <label>{label}</label>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
      <input
        className="w-full p-2 border border-[#CED0D4] rounded-md bg-transparent"
        onChange={onChange}
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={value}
      ></input>
    </div>
  );
}
