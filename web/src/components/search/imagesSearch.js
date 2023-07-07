import useDarkMode from '../../hooks/useDarkMode';
import SearchButton from '../buttons/SearchButton';

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
        isMobileScreen && value.split('').length > 15 ? 'flex-col mb-2' : 'flex-row'
      }  justify-between shadow-primary py-3 px-4 border border-[#EAECF0] rounded-lg bg-white dark:bg-background-sidebar-alt dark:border-[#2D2D2D] dark:text-white outline-none ring-0 shadow-md dark:shadow-none`}
    >
      <input
        className="w-[90%] outline-none text-base resize-none h-auto bg-transparent"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      ></input>
      <div className='ml-auto'>
        <SearchButton
          isLoading={isLoading}
          text={isLoading ? 'Generating' : 'Generate'}
          onClick={() => handleSearch()}
          disabled={disabled}
        ></SearchButton>
      </div>
    </div>
  );
}
