// DocActionButton is a component that is used to render the action buttons on the document page
// It takes 2 props - text and clickAction
// text - the text that is to be displayed on the button
// clickAction - the function that is to be called when the button is clicked
import ClipLoader from "react-spinners/ClipLoader";

export const DocActionButton = ({
  text,
  clickAction,
  isPrimary,
  isLoading,
  width,
}) => {
  return (
    <button
      className={`${
        isPrimary ? "bg-black" : "bg-[#D6D6D6]"
      }  px-3 py-2 rounded-md ${
        isPrimary ? "text-white" : "text-black"
      } font-medium
      ${width ? width : ""}
      `}
      onClick={(e) => clickAction(e)}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <span>{text}</span>
          <ClipLoader
            color={isPrimary ? "white" : "black"}
            loading={true}
            size={15}
          />
        </div>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};
