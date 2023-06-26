import { CiSearch } from 'react-icons/ci';
import SearchButton from '../buttons/SearchButton';
import useDarkMode from '../../hooks/useDarkMode';
export default function Search({ placeholder, onChange, handleSearch }) {
  const { darkMode } = useDarkMode();
  return (
    <div
      className={`w-8/12 rounded-lg border border-border-primary ${
        darkMode && 'border-border-primary-alt bg-[#1E1E1E]'
      } flex flex-row items-center py-1 px-2`}
    >
      <div className="flex items-center gap-2 w-5/6">
        <CiSearch size={'20px'} color={`#667085`} />
        <input
          placeholder={placeholder}
          className={`border-none outline-none w-4/5 ${
            darkMode && 'bg-[#1E1E1E]'
          }`}
          onChange={onChange}
        ></input>
      </div>
      <SearchButton
        background={darkMode ? 'white' : 'black'}
        textColor={darkMode ? 'black' : 'white'}
        onClick={() => handleSearch()}
      />
    </div>
  );
}
