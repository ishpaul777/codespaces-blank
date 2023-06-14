import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdOutlineHistory } from 'react-icons/md';
import { VscSettings } from 'react-icons/vsc'
import { AiOutlinePlus } from 'react-icons/ai'
const Dropdown = ({ setChatSiderCollapse, handleNewChatClick, setPromptSiderCollapse }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <BsThreeDotsVertical
        size={16}
        onClick={toggleDropdown}
      />
      {isOpen && (
        <div
          id="dropdown"
          className="absolute right-5 mt-9 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
            <li className="flex justify-between items-center px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                toggleDropdown()
                setChatSiderCollapse(false)
              }}
            >
              <span>
                History
              </span>
              <MdOutlineHistory
                color={"#667085"}
                size={20}
              />
            </li>
            <hr className="h-px w-[80%] mx-auto bg-gray-300  border-0"></hr>
            <li className="flex justify-between items-center  px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                toggleDropdown()
                setPromptSiderCollapse(false)
              }}
            >
              <span>
                Prompts
              </span>
              <VscSettings
                className='rotate-90'
                color={"#667085"}
                size={18}
              />
            </li>
            <hr className="h-px w-[80%] mx-auto bg-gray-300  border-0"></hr>
            <li className="flex justify-between items-center  px-4 py-2 hover:bg-gray-100 "
              onClick={() => { handleNewChatClick() }}
            >
              <span>
                New Chat
              </span>
              <AiOutlinePlus
                className='rotate-90'
                color={"#667085"}
                size={18}
              />
            </li>
          </ul>
        </div>
      )}
      {
        isOpen && <div className="fixed top-24 h-full inset-0 z-40 backdrop-filter backdrop-blur-md"></div>
      }
    </div>
  );
};

export default Dropdown;
