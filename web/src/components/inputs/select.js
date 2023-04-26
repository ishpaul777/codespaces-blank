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
