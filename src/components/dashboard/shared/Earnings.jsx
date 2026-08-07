import React, { useMemo, useState } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import icon from "../../../assets/images/dashboardicon.png";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const Earnings = ({ earnings = {} }) => {
  const [timeFilter, setTimeFilter] = useState("All");

  const filters = ["1M", "6M", "1Y", "All"];

  const filteredData = useMemo(() => {
    return earnings?.[timeFilter] || [];
  }, [earnings, timeFilter]);

  const chartData = useMemo(
    () => ({
      labels: filteredData.map((item) => item.month),
      datasets: [
        {
          label: "Monthly Earnings",
          data: filteredData.map((item) => item.monthly),
          backgroundColor: "#FAD02C",
          borderColor: "#FAD02C",
          borderWidth: 1,
        },
        {
          label: "Cumulative Earnings",
          data: filteredData.map((item) => item.cumulative),
          backgroundColor: "#E9EAEC",
          borderColor: "#E9EAEC",
          borderWidth: 1,
        },
      ],
    }),
    [filteredData]
  );

  return (
    <section className="bg-white p-4 rounded-lg shadow-md font-inter">

      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-tertiaryDark pb-3 -mx-6 px-6">
        <h2 className="flex gap-2 text-base font-bold items-center">
          <img src={icon} alt="Earnings" />
          Earnings
        </h2>

        <div className="flex font-bold rounded-lg p-1 text-xs text-[#E68C0F] bg-primaryLight">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-2 py-1 rounded transition-colors ${
                timeFilter === filter
                  ? "bg-primary text-white"
                  : "hover:bg-primary/20"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {filteredData.length === 0 ? (
        <div className="h-[400px] flex justify-center items-center text-gray-500">
          No earnings data available.
        </div>
      ) : (
        <div className="relative h-[400px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: "index",
                intersect: false,
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    callback: (value) =>
                      "₦" + Number(value).toLocaleString(),
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                  labels: {
                    color: "#000",
                    font: {
                      size: 12,
                    },
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.dataset.label}: ₦${Number(
                        context.parsed.y
                      ).toLocaleString()}`,
                  },
                },
              },
            }}
          />
        </div>
      )}
    </section>
  );
};

export default Earnings;