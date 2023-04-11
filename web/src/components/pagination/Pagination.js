import React, { useState, useEffect } from "react";
import {AiOutlineArrowLeft, AiOutlineArrowRight} from "react-icons/ai"


const Pagination = ({ data, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / itemsPerPage));
  }, [data, itemsPerPage]);

  const handleClick = (event, page) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
          <button className={currentPage===i ? "border not-italic font-semibold leading-5 px-[15px] py-2.5 border-solid border-[#D0D5DD] border-collapse bg-[#F9FAFB] " : "border not-italic font-semibold leading-5 px-[15px] py-2.5 border-solid border-[#D0D5DD] border-collapse" }>{i}</button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center flex-row px-[2%] py-[1%] justify-end">
      <div className="flex justify-evenly items-center flex-row border rounded-[10px] border-solid border-[#D0D5DD] border-collapse">
        <button className="not-italic font-semibold leading-5 px-5 py-2.5">
          <AiOutlineArrowLeft />
        </button>
        <ul>{renderPageNumbers()}</ul>
        <button className="not-italic font-semibold leading-5 px-5 py-2.5">
          <AiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
};
export default Pagination;
