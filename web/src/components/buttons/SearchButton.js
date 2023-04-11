import { ClipLoader } from "react-spinners";

export default function SearchButton({
  text = "Search",
  onClick,
  background = "black",
  textColor = "white",
  isLoading = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      className={`py-2 px-4 rounded-lg bg-${background} text-${textColor} flex items-center gap-2 ${
        disabled && "cursor-not-allowed opacity-50"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
      {isLoading && <ClipLoader color={textColor} loading={true} size={15} />}
    </button>
  );
}
