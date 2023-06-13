import { CiSearch } from "react-icons/ci";
import SearchButton from "../buttons/SearchButton";
import useWindowSize from '../../hooks/useWindowSize'
export default function Search({ placeholder, onChange, handleSearch }) {
  const {isMobileScreen}=useWindowSize();
  return (
    <div className={`${(window.innerWidth<1000) ? " w-full" : "w-8/12 min-w-[250px]" } rounded-lg border border-border-primary flex flex-row items-center justify-between py-1 px-2`}>
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
