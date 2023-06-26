import useDarkMode from '../../hooks/useDarkMode';

export default function DarkMode() {
  const { toggleDarkMode } = useDarkMode();

  return (
    <button
      className="fixed top-10 right-10 bg-white z-50 p-4"
      onClick={toggleDarkMode}
    >
      Switch Theme
    </button>
  );
}
