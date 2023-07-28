import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import useWindowSize from "../../hooks/useWindowSize";
import useDarkMode from "../../hooks/useDarkMode";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function UsageChart({ selectedMonthData }) {
  const labels = selectedMonthData.days.map(({ day }) => day);
  const { darkMode } = useDarkMode();

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          fontColor: darkMode ? "#fff" : "#000",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 200,
          fontColor: darkMode ? "#fff" : "#000",
        },
      },
    },
  };
  const data = {
    labels,
    datasets: [
      {
        label: "Credits Used",
        data: selectedMonthData.days.map(({ creditsUsed }) => creditsUsed),
        backgroundColor: "#7F56D9",
      },
    ],
  };
  const { isMobileScreen } = useWindowSize();

  return (
    <Bar
      height={isMobileScreen ? 300 : 150}
      width={600}
      className="dark:text-white text-black"
      options={options}
      data={data}
    />
  );
}
