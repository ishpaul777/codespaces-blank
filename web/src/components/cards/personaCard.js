import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";

export default function PersonaCard({ name, desc, image, id, isDefault }) {
  const maxDescriptionLength = 60;
  const navigate = useNavigate();
  const [menuOptionsVisible, setMenuOptionsVisible] = useState(false);

  return (
    <div
      onClick={() => {
        const url =
          id !== -1 ? `/personas/${id}/chat` : "/personas/factly/sach/chat";
        navigate(url);
      }}
      className="flex flex-col justify-between w-full rounded-lg bg-white-30 dark:bg-background-sidebar-alt px-[20px] py-[16px] cursor-pointer min-h-[300px] "
    >
      <div className="h-[60%]">
        <img
          src={image}
          className="w-full h-full rounded-lg bg-[#ffffff] dark:bg-background-secondary-alt object-contain"
        />
      </div>
      <div className="flex justify-between relative items-center">
        <h2 className="text-[20px] font-[600] text-black-60 dark:text-white max-w-[95%]">
          {name}
        </h2>
        {/* threedot */}
        {!isDefault && (
          <button
            className="flex items-center justify-center p-2"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOptionsVisible((prev) => !prev);
            }}
          >
            {menuOptionsVisible ? (
              <RxCross1 className="text-base text-black-60 dark:text-white" />
            ) : (
              <BsThreeDotsVertical className="text-base text-black-60 dark:text-white" />
            )}
          </button>
        )}
        {menuOptionsVisible && !isDefault && (
          <div className="absolute top-0 right-0 mr-6 z-10 w-36">
            <div className="bg-white-30 dark:bg-background-sidebar-alt rounded-lg shadow-lg border dark:border-[#3b3b3b] border-[#D0D5DD]">
              <ul className="flex flex-col p-2">
                <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background-secondary-alt">
                  <span className="text-black-60 dark:text-white text-sm">
                    Edit
                  </span>
                </li>
                <hr className="h-px bg-gray-300 dark:bg-[#3b3b3b] border-0 w-full my-1"></hr>
                <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background-secondary-alt">
                  <span className="text-black-60 dark:text-white text-sm">
                    Delete
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <p
        className="text-[14px] font-[400] text-black-25 dark:text-gray-200"
        title={desc}
      >
        {desc?.length > maxDescriptionLength
          ? `${desc?.slice(0, maxDescriptionLength)}...`
          : desc}
      </p>
      {/* menu options */}
    </div>
  );
}
