import useDarkMode from "../../hooks/useDarkMode";
import SearchButton from "../buttons/SearchButton";

export function ImageSearch({
  placeholder,
  onChange,
  handleSearch,
  isLoading,
  disabled,
  value,
}) {
  const { darkMode } = useDarkMode();
  return (
    <div className={`flex flex-row justify-between shadow-primary py-3 px-4 border border-primary rounded-lg ${darkMode && 'bg-white'}`}>
      <input
        className="w-[90%] outline-none text-base"
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
