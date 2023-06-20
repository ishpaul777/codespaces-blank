import SearchButton from "../buttons/SearchButton";

export function ImageSearch({
  placeholder,
  onChange,
  handleSearch,
  isLoading,
  isMobileScreen,
  disabled,
  value,
}) {
  return (
    <div
      className={`flex ${
        isMobileScreen && value.split("").length > 15 ? "flex-col" : "flex-row"
      }  justify-between shadow-primary py-3 px-4 border border-[#EAECF0] rounded-lg`}
    >
      <input
        className="w-[90%] outline-none text-base resize-none h-auto"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      ></input>
      <div>
        <SearchButton
          isLoading={isLoading}
          text={isLoading ? "Generating" : "Generate"}
          onClick={() => handleSearch()}
          disabled={disabled}
        ></SearchButton>
      </div>
    </div>
  );
}
