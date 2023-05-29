import { useEffect, useState } from "react";
import { CreateButton } from "../../components/buttons/CreateButton";
import PersonaCard from "../../components/cards/personaCard";
import Search from "../../components/search";
import { Link } from "react-router-dom";
import avtarImg from "../../assets/avatar.png";
import Pagination from "./pagination";
import { getPersona } from "../../actions/persona";
import { errorToast } from "../../util/toasts";

export default function Personas() {
  const [tab, setTab] = useState("All");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    search_query: "",
    count: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  // personData is the data of the persona on the current page
  const [personaData, setPersonaData] = useState([]);

  useEffect(() => {
    getPersona({
      page: pagination.page,
      limit: pagination.limit,
    })
      .then((data) => {
        setPersonaData(data.personas);
      })
      .catch((err) => {
        errorToast("Something went wrong! Please try again later.");
      });
  }, [pagination]);

  useEffect(() => {
    getPersona({
      page: pagination.page,
      limit: pagination.limit,
      search_query: pagination.search_query,
    }).then((data) => {
      setPersonaData(data.personas);
    });
  }, [pagination.search_query]);

  return (
    <div className="m-10">
      {/* This is Page header */}
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-3xl font-medium">Personas</h2>

        <div className="flex flex-row w-1/2 items-center gap-2">
          <Search
            placeholder={"search Personas"}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            handleSearch={() => {
              setPagination({
                ...pagination,
                search_query: searchQuery,
              });
            }}
          />
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
        {/* <select
          name="category"
          id="person"
          className="text-grey-50 p-2 border-solid border-grey-30 rounded-lg border-[1px] w-56 h-10"
        >
          <option value="none" selected disabled hidden>
            Category name
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select> */}
      </div>
      {/* This is Page Items */}
      <div className="grid grid-cols-5 grid-rows-2 gap-6 my-10">
        {personaData.map((persona, index) => (
          <PersonaCard
            key={index}
            image={persona?.avatar}
            name={persona?.name}
            desc={persona?.description}
            id={persona?.id}
          />
        ))}
      </div>
      <Pagination
        totalPages={pagination.count}
        currentPage={pagination.page}
        setCurrentPage={setPagination}
      />
    </div>
  );
}
