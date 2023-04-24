import React from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
const Content = () => {
  return (
    <div className="box-border flex flex-col justify-center items-start gap-4 isolate w-full border flex-none order-none grow-0 px-[26px] py-[22px] rounded-lg border-solid border-[#F3F3F3]">
      <div className="flex flex-col items-start gap-3 w-full flex-none order-none grow-0 z-0 p-0">
        <div className="flex flex-row items-center gap-1.5 justify-between w-full flex-none order-none grow-0 p-0">
          <div className="flex justify-between items-center flex-row">
            <div className="w-[136.77px] not-italic font-medium text-[13px] leading-[19px] text-[#6C6C6C] flex-none order-none grow-0">
              By Ayushi Verma
            </div>
            <div className=" w-[73.25px] not-italic font-medium text-[11px] leading-[17px] text-[#B3B3B3] flex-none order-1 grow-0">
              16m ago
            </div>
          </div>
          <div classname="w-full flex items-center flex-row justify-end">
            <BiDotsVerticalRounded />
          </div>
        </div>
        <div className="w-full not-italic font-medium text-xs leading-5 text-[#1E1E1E] flex-none order-1 grow-0">
          Once upon a time there was a blogger who wanted to make their voice
          heard. After months of hard work and dedication, they had finally
          managed to create a blog that people could read and appreciate.Soon
          enough they got word back that they had been accepted! The blogger was
          overjoyed and couldn't wait to start writing for this amazing
          publication...
        </div>
      </div>
    </div>
  );
};

export default Content;
