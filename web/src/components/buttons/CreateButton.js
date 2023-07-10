import { AiOutlinePlus } from "react-icons/ai";
export function CreateButton({ text = "Create", onClick = () => { } }) {
  return (
    <button
      type="button"
      className={` w-fit pt-2.5 pb-2.5 pr-5 pl-5 bg-black dark:bg-white  text-base dark:text-black text-white rounded-lg cursor-pointer flex flex-row items-center justify-center ${text ? "gap-2" : ""
        }`}
      onClick={onClick}
    >
      <AiOutlinePlus className="w-fit" />
      <p className=" whitespace-nowrap hidden sm:block">{text}</p>
    </button>
  );
}
