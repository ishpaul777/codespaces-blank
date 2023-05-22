import { useState } from "react";
import { CreateButton } from "../../components/buttons/CreateButton";
import PersonaCard from "../../components/cards/personaCard";
import Search from "../../components/search";
import { Link } from "react-router-dom";
import avtarImg from "../../assets/avatar.png";
import Pagination from "./pagination";

export default function Personas() {
  const items = Array(34).fill(0);
  const [tab, setTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const pageData = items.slice(startIndex, endIndex);

  return (
    <div className="m-10">
      {/* This is Page header */}
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-3xl font-medium">Personas</h2>

        <div className="flex flex-row w-1/2 items-center gap-2">
          <Search placeholder={"search Personas"} />
          <Link to="/personas/create">
            <CreateButton text={"Create Personas"} />
          </Link>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-8 mx-1">
        <div className="flex flex-row font-semibold text-[18px] gap-4 border-b border-solid border-[#D9E7DA]">
          <button
            className={`text-grey-50 py-[10px] ${
              tab === "All"
                ? "text-black-50 border-b-[2px] border-black-50"
                : ""
            }`}
            onClick={() => setTab("All")}
          >
            All
          </button>
          <button
            className={`text-grey-50 py-[10px] ${
              tab === "Created"
                ? "text-black-50 border-b-[2px] border-black-50"
                : ""
            }`}
            onClick={() => setTab("Created")}
          >
            Created
          </button>
        </div>
        <select
          name="category"
          id="person"
          className="text-grey-50 p-2 border-solid border-grey-30 rounded-lg border-[1px] w-56 h-10"
        >
          <option value="none" selected disabled hidden>
            Category name
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>
      {/* This is Page Items */}
      <div className="grid grid-cols-5 gap-5 my-10 h-[63vh]">
        {pageData.map((num) => (
          <PersonaCard
            image={avtarImg}
            name={"Factly"}
            desc={"This is Factly media and research"}
          />
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
