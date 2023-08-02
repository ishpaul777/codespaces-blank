import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function MonthAndYearSelector({ onNext, onPrevious }) {
  const styles = {
    icon: {
      selected: "text-[#878787] dark:text-white",
      unselected: "text-gray-200",
      size: "text-base",
    },
  };

  const currentDate = new Date();

  const listOfMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septemeber",
    "October",
    "November",
    "December",
  ];

  const latestMonth = currentDate.getMonth();
  const latestYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(latestMonth);
  const [selectedYear, setSelectedYear] = useState(latestYear);

  const handleNext = () => {
    if (selectedMonth === latestMonth && selectedYear === latestYear) {
      return;
    }

    if (selectedMonth === 11) {
      onNext(`${selectedYear + 1}-01`);
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      onNext(`${selectedYear}-${selectedMonth + 2}`);
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedMonth === 0) {
      onPrevious(`${selectedYear - 1}-12`);
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      onPrevious(`${selectedYear}-${selectedMonth}`);
      setSelectedMonth(selectedMonth - 1);
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <FaChevronLeft
        className={`${styles.icon.size} ${styles.icon.selected}`}
        onClick={handlePrevious}
      />
      <span className="text-xl w-44 text-center">
        {`${listOfMonths[selectedMonth]}, ${selectedYear}`}
      </span>
      <FaChevronRight
        className={`${styles.icon.size} ${
          selectedMonth === latestMonth && selectedYear === latestYear
            ? styles.icon.unselected
            : styles.icon.selected
        }`}
        onClick={handleNext}
      />
    </div>
  );
}

export default MonthAndYearSelector;
