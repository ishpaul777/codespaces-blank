export const SizeButton = ({
  isSelected,
  title,
  maxSize,
  clickAction,
  isCustom,
}) => {
  return (
    <button
      onClick={() => clickAction(maxSize, title, isCustom)}
      className={`bg-button-primary text-sm py-0.5 px-1.5 rounded-md ${
        isSelected && "border"
      } ${isSelected ? "text-black" : "text-[#7B7B7B]"}`}
    >
      {title}
    </button>
  );
};
