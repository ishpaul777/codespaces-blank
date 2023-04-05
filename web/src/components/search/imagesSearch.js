import SearchButton from "../buttons/SearchButton";

export function ImageSearch({
  placeholder,
  onChange,
  handleSearch,
  isLoading,
  disabled,
}) {
  return (
    <div className="flex flex-row justify-between shadow-primary py-3 px-4 border border-primary rounded-lg">
      <input
        className="w-[90%] outline-none text-base"
        placeholder={placeholder}
        onChange={onChange}
      ></input>
      <div>
        <SearchButton
          isLoading={isLoading}
          text={isLoading ? "Generating": "Generate" }
          onClick={() => handleSearch()}
          disabled={disabled}
        ></SearchButton>
      </div>
    </div>
  );
}
