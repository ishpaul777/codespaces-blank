import React, { useState } from "react";
import Search from "../../components/search";
import chevronLeft from "../../assets/icons/chevron-left.svg";
import chevronRight from "../../assets/icons/chevron-right.svg";
import { fakeData } from './data';
import UsageChart from './UsageChart';
import useWindowSize from '../../hooks/useWindowSize';


function MonthSelector({ selectedMonth, onPrevious, onNext }) {
  return (
    <div className="flex flex-row items-center gap-4 dark:text-white">
      <button className="text-xl" onClick={onPrevious}>
        {/* <ChevronLeft /> */}
        <img src={chevronLeft} alt="chevron-left" />
      </button>
      <span className="text-xl">{selectedMonth}</span>
      <button className="text-xl" onClick={onNext}>
        {/* <ChevronRight /> */}
        <img src={chevronRight} alt="chevron-right" />
      </button>
    </div>
  );
}

function Usage() {
	// isMobileScreen is true if the screen width is less than 640px
	const { isMobileScreen} = useWindowSize();

	const currentMonth = new Date().toLocaleString('default', { month: 'long' });
	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const selectedMonthData = fakeData.find(
    ({ month }) => month === selectedMonth
  );

  const handlePreviousMonth = () => {
    // Implement logic to move to the previous month
    // For simplicity, let's just display the previous month in the array
    const index = months.indexOf(selectedMonth);
    if (index > 0) {
      setSelectedMonth(months[index - 1]);
    }
  };

  const handleNextMonth = () => {
    // Implement logic to move to the next month
    // For simplicity, let's just display the next month in the array
    const index = months.indexOf(selectedMonth);
    if (index < months.length - 1) {
      setSelectedMonth(months[index + 1]);
    }
  };

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
  const tableStyles = {
    valuesPadding: "px-4 py-6",
    headerPadding: "p-4",
  };


	const pageData = {
		heading: "Usage",
		description: "This insightful graph presents a comprehensive breakdown of the number of words you have generated across various interactions on our application. The data includes words used in personal activities, chatbot conversations, and interactions with personas.",
	}

	return (
		<div className={`my-16 ${isMobileScreen ? "mx-6 my-24" : "mx-10"} flex flex-col gap-6`}>
			<h2 className={`text-3xl font-medium dark:text-white mb-4`}>
				{pageData.heading}
      </h2>
			<span className='text-base'>
				{pageData.description}
			</span>
			<div className='graph-container'>
				{/* filter division - it consists of all the filters involved in showing usage
					- month selector
					- model selector
					- provider selector
					- graph type - ('Daily', 'Cumulative')
				*/}
				<div className='flex items-center'>

				</div>
			</div>
		</div>
		// <div className="m-10">
		// 	{/* This is Page header */}
		// 	<div className="flex flex-row justify-between items-center mt-24 mb-10 md:mt-0 gap-2">
		// 		<h2 className="text-2xl font-medium dark:text-white text-black">Usage</h2>
		// 		<div className="flex flex-row items-center gap-2">
		// 			{/* current date text color should be #6c6c6c in light and text-gray-100 in dark */}
		// 			<span className="text-gray-600 dark:text-gray-100">
		// 				{new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
		// 			</span>
		// 			{/* button bg-black text-white in light and opposite in dark */}
		// 			<button className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black">
		// 				Button
		// 			</button>
		// 		</div>
		// 	</div>

		// 	<div className="flex justify-center mt-4">
		// 		<MonthSelector
		// 			selectedMonth={selectedMonth}
		// 			onPrevious={handlePreviousMonth}
		// 			onNext={handleNextMonth}
		// 		/>
		// 	</div>
		// 	<UsageChart selectedMonthData={selectedMonthData} />

      {/* Display your bar chart with data for the selected month here */}
      <div className="flex flex-col md:flex-row mt-4  items-center justify-between gap-4">
        {/* Add your search input component here */}
        <Search type="text" placeholder="Search..." />
        {/* Hard-coded progress bar (replace values with your dynamic data) */}
        <div
          className={`${
            window.innerWidth < 1000 ? " w-full" : "w-8/12 min-w-[250px]"
          } rounded-lg border border-border-primary flex flex-row items-center justify-between p-2 dark:border-border-primary-alt dark:bg-[#1E1E1E]`}
        >
          <span className="text-gray-600 dark:text-gray-100 ml-2">
            Credits Used:
          </span>
          <div className="flx flex-row items-center bg-gray-200 dark:bg-gray-600 w-48 h-3 rounded-full">
            <div
              className="bg-[#7F56D9]  h-full rounded-full"
              style={{ width: "50%" }}
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
                className={`${header.width} ${tableStyles.headerPadding} text-sm dark:bg-background-sidebar-alt font-medium text-text-primary text-left  text-table-text dark:text-white`}
              >
                {header.name}
              </th>
            );
          })}
          <tbody className={`w-full`}></tbody>
        </table>
      </div>
    </div>
  );
}

export default Usage;
