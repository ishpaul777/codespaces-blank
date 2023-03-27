export default function SearchButton({ text = "Search", onClick }) {
  return (
    <button
      type="button"
      className="py-2 px-4 rounded-lg bg-black text-white"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
