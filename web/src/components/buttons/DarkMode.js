import useDarkMode from "../../hooks/useDarkMode";

export default function DarkMode() {
  const { toggleDarkMode, darkMode } = useDarkMode();

  return (
    <button
      className={`mb-2 flex flex-row items-center w-full gap-x-2.5 bg-button-primary dark:bg-button-primary-alt rounded pr-4 pl-4 py-4 dark:text-white`}
    // onClick={toggleDarkMode}
    >
      <div className="flex items-center">
        <label
          htmlFor="darkModeToggle"
          className="flex items-center cursor-pointer"
        >
          <div className="relative">
            <input
              type="checkbox"
              id="darkModeToggle"
              className="sr-only"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <div className="w-12 h-6 bg-gray-400 dark:bg-blue-500 rounded-full shadow-inner"></div>
            <div
              className={`${darkMode ? 'translate-x-6' : 'translate-x-0'
                } transition-transform duration-200 ease-in-out absolute inset-0 h-6 w-6 bg-white rounded-full shadow`}
            >
            </div>
          </div>
        </label>
      </div>
        Dark Mode
    </button>
  );
}
