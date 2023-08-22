import React, { useEffect, useState } from "react";
import UsageChart from "./UsageChart";
import useWindowSize from "../../hooks/useWindowSize";
import MonthAndYearSelector from "../../components/date/month-and-year-selector";
import { getUsage } from "../../actions/usage";
import moment from "moment";
import { SearchableInput } from "../../components/inputs/searchableInput";
import { useSelector } from "react-redux";

function Usage() {
  // isMobileScreen is true if the screen width is less than 640px
  const { isMobileScreen } = useWindowSize();

  const { selectedOrgID } = useSelector(({ organisations }) => {
    return {
      selectedOrgID: organisations?.selectedOrg,
    };
  });

  const tableHeader = [
    {
      name: "Users",
      width: "w-1/5",
    },
    {
      name: "Credits Used",
      width: "w-1/5",
    },
    {
      name: "Generations",
      width: "w-1/5",
    },
    {
      name: "Templates",
      width: "w-1/5",
    },
    {
      name: "Projects",
      width: "w-1/5",
    },
  ];

  const currentDate = new Date();
  const latestMonth = currentDate.getMonth();
  const latestYear = currentDate.getFullYear();

  const [usageData, setUsageData] = useState([]);

  const [query, setQuery] = useState({
    date: `${latestYear}-${latestMonth + 1}`,
    model: "",
    provider: "",
    type: "",
    usage_type: "daily",
  });

  const fetchUsageData = async () => {
    const response = await getUsage({
      target_month: query.date,
      model: query.model,
      provider: query.provider,
      type: query.type,
      usage_type: query.usage_type,
      org_id: selectedOrgID,
    });

    setUsageData(response);
  };
  useEffect(() => {
    fetchUsageData();
  }, [query]);

  const styles = {
    statsButton: `px-4 py-2`,
  };
  return (
    <div className="mx-10 my-16 flex flex-col gap-6">
      {/* page header */}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-semibold dark:text-white text-black">
          Usage
        </span>
      </div>
      {/* page body which will consist of the usage grapha and some other things */}
      <div className="py-6 px-4 flex flex-col gap-8">
        <div className="w-full justify-between flex items-center">
          <MonthAndYearSelector
            onNext={(date) => {
              setQuery({
                ...query,
                date,
              });
            }}
            onPrevious={(date) => {
              setQuery({
                ...query,
                date,
              });
            }}
          />
          {/* buttons for chosing type of analytics 
              - daily
              - cumulative
          */}

          <div className="flex flex-row border border-gray-300 rounded-md">
            <button
              className={`${styles.statsButton} border-r border-gray-300 ${
                query.usage_type === "daily" && "bg-[#F9FAFB]"
              }`}
              onClick={() => {
                setQuery({
                  ...query,
                  usage_type: "daily",
                });
              }}
            >
              Daily
            </button>
            <button
              className={`${styles.statsButton} ${
                query.usage_type === "cumulative" && "bg-[#F9FAFB]"
              }`}
              onClick={() => {
                setQuery({
                  ...query,
                  usage_type: "cumulative",
                });
              }}
            >
              Cumulative
            </button>
          </div>
        </div>
        <div className="flex w-full items-center gap-4">
          <SearchableInput
            label={"Used for"}
            placeholder={"Search"}
            listOptions={["generate", "chat", "persona"]}
            onChange={(value) => {
              setQuery({
                ...query,
                type: value,
              });
            }}
            initialValue={query.type}
          />
          <SearchableInput
            label={"Provider"}
            placeholder={"Search Provider"}
            listOptions={["openai", "anthropic"]}
            onChange={(value) => {
              setQuery({
                ...query,
                provider: value,
              });
            }}
            initialValue={query.provider}
          />
          <SearchableInput
            label={"Model"}
            placeholder={"Search Model"}
            listOptions={["gpt-3.5-turbo", "gpt-4", "claude-2"]}
            onChange={(value) => {
              setQuery({
                ...query,
                model: value,
              });
            }}
            initialValue={query.model}
          />
        </div>
        <UsageChart
          usageData={usageData.map((data) => ({
            ...data,
            date: moment(data.date).format("DD MMM"),
          }))}
          type={query.usage_type}
        />
      </div>
    </div>
  );
}

export default Usage;

/* <div className="flex flex-row justify-between items-center mt-24 mb-10 md:mt-0 gap-2">
				<h2 className="text-2xl font-medium dark:text-white text-black">Usage</h2>
				<div className="flex flex-row items-center gap-2">
					<span className="text-gray-600 dark:text-gray-100">
						{new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
					</span>
					<button className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black">
						Button
					</button>
				</div>
			</div>

			<div className="flex justify-center mt-4">
				<MonthSelector
					selectedMonth={selectedMonth}
					onPrevious={handlePreviousMonth}
					onNext={handleNextMonth}
				/>
			</div>
			<UsageChart selectedMonthData={selectedMonthData} />

			<div className="flex flex-col md:flex-row mt-4  items-center justify-between gap-4">
				<Search
					type="text"
					placeholder="Search..."
				/>
				<div className={`${window.innerWidth < 1000 ? " w-full" : "w-8/12 min-w-[250px]"
					} rounded-lg border border-border-primary flex flex-row items-center justify-between p-2 dark:border-border-primary-alt dark:bg-[#1E1E1E]`}>
					<span className="text-gray-600 dark:text-gray-100 ml-2">
						Credits Used:
					</span>
					<div className="flx flex-row items-center bg-gray-200 dark:bg-gray-600 w-48 h-3 rounded-full">
						<div
							className="bg-[#7F56D9]  h-full rounded-full"
							style={{ width: '50%' }}
						/>
					</div>
					<span className="text-gray-600 dark:text-gray-100 ml-2">50/100</span>
				</div>
			</div>
			<div className="mt-6 overflow-x-auto max-w-screen">
				<table className="w-full min-w-[700px]">
					{tableHeader.map((header, index) => {
						return (
							<th
								key={index}
								className={`${header.width} ${tableStyles.headerPadding} text-sm dark:bg-background-sidebar font-medium text-text-primary text-left  text-table-text dark:text-white`}
							>
								{header.name}
							</th>
						);
					})}
					<tbody className={`w-full`}>
						
					</tbody>
				</table>
			</div> */
