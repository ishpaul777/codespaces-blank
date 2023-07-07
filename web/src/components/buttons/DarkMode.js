import useDarkMode from '../../hooks/useDarkMode';

export default function DarkMode() {
  const { toggleDarkMode } = useDarkMode();

  return (
    <button
      className={`fixed top-10 right-10 z-50 bg-transparent p-4 dark:text-white rounded-md shadow-lg`}
      onClick={toggleDarkMode}
    >
      Switch Theme
    </button>
  );
}
