export default function SearchButton({
  text = "Search",
  onClick,
  background = "black",
  textColor = "white",
}) {
  return (
    <button
      type="button"
      className={`py-2 px-4 rounded-lg bg-${background} text-${textColor}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
