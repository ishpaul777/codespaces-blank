import { AiOutlinePlus } from "react-icons/ai";

export function CreateButton({ text = "Create", onClick = () => {} }) {
  return (
    <button
      type="button"
      className="pt-2.5 pb-2.5 pr-5 pl-5 bg-black rounded-lg cursor-pointer flex flex-row items-center gap-2"
      onClick={onClick}
    >
      <AiOutlinePlus className="text-base" color="white" />
      <p className="text-base text-white">{text}</p>
    </button>
  );
}
