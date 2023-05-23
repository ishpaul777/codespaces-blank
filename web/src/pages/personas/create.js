import { RiShareBoxLine } from "react-icons/ri";

export default function CreatePersona() {
  return (
    <div className="my-5 mx-10">
      <div className="flex flex-row justify-between my-3">
        <h1 className="text-[24px] font-semibold">Create Persona</h1>
        <button className="text-[14px] font-semibold bg-black-50 py-[9px] px-[20px] text-white rounded-lg">
          Create and chat
        </button>
      </div>
      <div className="flex flex-col my-10">
        <div className="flex flex-row flex-wrap justify-between items-center py-10 border-b border-[#EAECF0]">
          <div className="flex flex-col gap-4">
            <h1 className="text-[18px] font-semibold">Name</h1>
            <p className="text-[12px] font-normal text-[#6C6C6C]">
              The name can include first and last names
            </p>
          </div>
          <input
            className="w-[40%] px-[14px] py-[10px] border border-[#D0D5DD] rounded-lg"
            placeholder="Enter name here"
          />
        </div>
        <div className="flex flex-row flex-wrap justify-between py-10 border-b border-[#EAECF0]">
          <h1 className="text-[18px] font-semibold">Description</h1>
          <textarea
            className="w-[40%] px-[14px] py-[10px] h-[84px] border border-[#D0D5DD] rounded-lg resize-none"
            placeholder="Enter description here"
          />
        </div>
        <div className="flex flex-row flex-wrap justify-between items-center py-10 border-b border-[#EAECF0]">
          <div className="flex flex-col gap-4 w-[50%]">
            <h1 className="text-[18px] font-semibold">Prompt</h1>
            <p className="text-[12px] font-normal text-[#6C6C6C]">
              All conversations with this bot will start with your prompt but it
              will not be visible to the user in the chat. If you would like the
              prompt message to be visible to the user, consider using an intro
              message instead.
            </p>
            <a
              href="#"
              className="flex flex-row items-center gap-2 text-[12px] text-[#0022D4] font-medium"
            >
              View prompt examples <RiShareBoxLine color="#0022D4" />
            </a>
          </div>
          <textarea
            className="w-[40%] px-[14px] py-[10px] h-[84px] border border-[#D0D5DD] rounded-lg resize-none"
            placeholder="Enter prompt here"
          />
        </div>
        <div className="flex flex-row flex-wrap justify-between items-center py-10 border-b border-[#EAECF0]">
          <div className="flex flex-col gap-4">
            <h1 className="text-[18px] font-semibold">Visibility</h1>
            <p className="text-[12px] font-normal text-[#6C6C6C]">
              Who is allowed to talk to them?
            </p>
          </div>
          <select className="w-[40%] px-[14px] py-[10px] border border-[#D0D5DD] rounded-lg text-[#667085]">
            <option disabled selected value="">
              Public: Anyone can chat
            </option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </div>
        <div className="flex flex-row flex-wrap justify-between items-center py-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-[18px] font-semibold">Avatar</h1>
            <p className="text-[12px] font-normal text-[#6C6C6C]">
              You can either create an image from text or upload an image.
            </p>
          </div>
          <div className="flex flex-row gap-5 items-center">
            <button className="text-[14px] font-semibold bg-black-50 py-[9px] px-[20px] text-white rounded-lg">
              Create Image
            </button>
            <h1 className="text-[16px] font-normal text-[#667085]">or</h1>
            <input
              type="file"
              className="text-sm text-[#667085] border border-[#D0D5DD] rounded-lg file:border-0 file:p-[10px] file:font-normal file:text-[#667085] file:bg-[#F4F4F4]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
