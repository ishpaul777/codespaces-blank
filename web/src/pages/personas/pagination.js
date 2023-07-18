import React from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          onClick={() => setCurrentPage(i)}
          className={`border-l border-r not-italic font-semibold leading-5 px-[15px] py-2.5 border-solid border-[#D0D5DD] ${
            currentPage === i ? "bg-grey-30" : ""
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center flex-row px-[2%] py-[1%] justify-end">
      <div className="flex justify-evenly items-center flex-row border rounded-[10px] border-solid border-[#D0D5DD] dark:text-white">
        <button
          className="not-italic font-semibold leading-5 px-5 py-2.5"
          onClick={() => setCurrentPage((prev) => (prev === 1 ? 1 : prev - 1))}
        >
          <AiOutlineArrowLeft />
        </button>
        <ul>{renderPageNumbers()}</ul>
        <button
          className="not-italic font-semibold leading-5 px-5 py-2.5"
          onClick={() =>
            setCurrentPage((prev) => (prev === totalPages ? prev : prev + 1))
          }
        >
          <AiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
};
export default Pagination;
