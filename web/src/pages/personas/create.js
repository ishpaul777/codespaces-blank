import { RiShareBoxLine } from "react-icons/ri";
import UppyUploader from "../../components/Uppy";
import { useState } from "react";
import Modal from "../../components/Modal";
import { AiOutlineDelete } from 'react-icons/ai';

function Link({ to, children, className , onDelete }) {
  return (
    <div className="flex items-center">
      <a href={to} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
      <AiOutlineDelete onClick={onDelete} className="ml-2 text-red-500" />
    </div>
  );
}


export default function CreatePersona() {
  const [avatar, setAvatar] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [visibility, setVisibility] = useState("private");
  const onDelete = () => {
    setAvatar("");
  };
  const handleUpload = (url) => {
    setAvatar(url);
    setOpen(false);
  };
  const handleModalClose = () => {
    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log('Form submitted:', { name, description, prompt, visibility , avatar});
  };
  return (
    <form onSubmit={handleSubmit}>
    <div className="my-5 mx-10">
      <div className="flex flex-row justify-between my-3">
        <h1 className="text-[24px] font-semibold">Create Persona</h1>
        <button type="submit" className="text-[14px] font-semibold bg-black-50 py-[9px] px-[20px] text-white rounded-lg">
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-row flex-wrap justify-between py-10 border-b border-[#EAECF0]">
          <h1 className="text-[18px] font-semibold">Description</h1>
          <textarea
            className="w-[40%] px-[14px] py-[10px] h-[84px] border border-[#D0D5DD] rounded-lg resize-none"
            placeholder="Enter description here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="flex flex-row flex-wrap justify-between items-center py-10 border-b border-[#EAECF0]">
          <div className="flex flex-col gap-4">
            <h1 className="text-[18px] font-semibold">Visibility</h1>
            <p className="text-[12px] font-normal text-[#6C6C6C]">
              Who is allowed to talk to them?
            </p>
          </div>
          <select 
           value={visibility}
           onChange={(e) => setVisibility(e.target.value)}
           className="w-[40%] px-[14px] py-[10px] border border-[#D0D5DD] rounded-lg text-[#667085]">
            {/* <option disabled
            //  selected 
             value="">
              Public: Anyone can chat
            </option> */}
            <option value="private">Private: Only you can chat </option>
            <option value="public"> Public: Anyone can chat</option>
          </select>
        </div>
        <div className="flex flex-row flex-wrap justify-between items-center py-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-[18px] font-semibold">Avatar</h1>
            <p className="text-[12px] font-normal text-[#6C6C6C]">
              You can either create an image from text or upload an image.
            </p>
          </div>
          {!avatar?<div className="flex flex-row gap-5 items-center">
            <button onClick={()=>setOpen(true)} className="text-[14px] font-semibold bg-black-50 py-[9px] px-[20px] text-white rounded-lg">
              Create Image
            </button>
            <h1 className="text-[16px] font-normal text-[#667085]">or</h1>
            <input
              onClick={(e) => {e.preventDefault();setOpen(true)}}
              type="file"
              className="text-sm text-[#667085] border border-[#D0D5DD] rounded-lg file:border-0 file:p-[10px] file:font-normal file:text-[#667085] file:bg-[#F4F4F4]"
            />
          </div>:<Link to={avatar} onDelete={onDelete} className="text-blue-500">View Avatar</Link>}
        </div>
      </div>
      <Modal open={open} onClose={handleModalClose}><UppyUploader onUpload={handleUpload}></UppyUploader></Modal> 
    </div>
    </form>
  );
}
