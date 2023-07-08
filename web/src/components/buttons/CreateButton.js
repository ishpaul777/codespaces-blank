import { AiOutlinePlus } from "react-icons/ai";
export function CreateButton({ text = "Create", onClick = () => {} }) {
  return (
    <button
      type="button"
      className={` w-fit pt-2.5 pb-2.5 pr-5 pl-5 bg-black dark:bg-white rounded-lg cursor-pointer flex flex-row items-center justify-center ${
        text ? "gap-2" : ""
      }`}
      onClick={onClick}
    >
      <AiOutlinePlus className="w-fit text-base dark:text-black text-white"  />
      <p className=" whitespace-nowrap text-base text-white hidden sm:inline">{text}</p>
    </button>
  );
}
