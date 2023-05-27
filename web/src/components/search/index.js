import { CiSearch } from "react-icons/ci";
import SearchButton from "../buttons/SearchButton";
export default function Search({ placeholder, onChange, handleSearch }) {
  return (
    <div className="w-8/12 rounded-lg border border-border-primary flex flex-row items-center py-1 px-2">
      <div className="flex items-center gap-2 w-5/6">
        <CiSearch size={"20px"} color="#667085" />
        <input
          placeholder={placeholder}
          className="border-none outline-none w-4/5"
          onChange={onChange}
        ></input>
      </div>
      <SearchButton onClick={() => handleSearch()} />
    </div>
  );
}
