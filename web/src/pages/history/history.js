import React from "react";
import Search from "../../components/search";

import Content from "./content";
import Pagination from "../../components/pagination/Pagination";
import { icons } from "react-icons";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
const History = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const itemsPerPage = 4;
  return (
    <>
      <div className="w-[83.33%] h-screen fixed px-[2%] py-[1%] right-0 top-0">
        <div className="flex justify-between flex-row m-2.5">
          <div className="w-6/12">
            <div className="not-italic font-semibold text-[25px] leading-9 text-[#1E1E1E]">
              History
            </div>
          </div>
          <div className=" w-6/12 flex flex-row justify-end">
            <Search />
          </div>
        </div>

        <div className="w-full flex items-center flex-row mt-2.5 rounded-lg border-b-[#F3F3F3] border-b border-solid justify-start">
          <div className="not-italic font-semibold text-xs leading-5 px-5 py-2.5 text-[#1E1E1E] border-b-2 border-b-[#1E1E1E] border-solid;">
            <div className="cursor-pointer">Text</div>
          </div>

          <div className="not-italic font-semibold text-xs leading-5 text-[#667085] px-5 py-2.5">
            <div className="cursor-pointer">Image</div>
          </div>

          <div className="not-italic font-semibold text-xs leading-5 text-[#667085] px-5 py-2.5">
            <div className="cursor-pointer">Document</div>
          </div>
        </div>

        <div className="mt-2.5 p-[0.5%];">
          <div className="mt-2.5">
            <Content />
          </div>
          <div className="mt-2.5">
            <Content />
          </div>
          <div className="mt-2.5">
            <Content />
          </div>
          <div className="mt-2.5">
            <Content />
          </div>
        </div>

        <Pagination data={data} itemsPerPage={itemsPerPage} />
      </div>
    </>
  );
};

export default History;
