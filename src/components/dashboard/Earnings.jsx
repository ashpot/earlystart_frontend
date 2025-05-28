import React, { useState, useMemo } from 'react';
import { earningsData } from '../../data/DashboardContent';
import icon from '../../assets/images/dashboardicon.png';
import { Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

// Configure Chart.js defaults
defaults.maintainAspectRatio = false;
defaults.responsive = true;

const Earnings = () => {
  const [timeFilter, setTimeFilter] = useState('All');

  // Filter earningsData based on selected time period
  const filteredData = useMemo(() => {
    // Example filtering logic; adjust based on your earningsData structure
    return earningsData.filter((data) => {
      // Assuming earningsData has a 'date' field or is ordered chronologically
      // Replace with your actual filtering logic
      if (timeFilter === '1M') {
        // Example: Filter last month's data (assumes recent data is last in array)
        return earningsData.indexOf(data) === earningsData.length - 1;
      }
      if (timeFilter === '6M') {
        // Example: Filter last 6 months
        return earningsData.indexOf(data) >= earningsData.length - 6;
      }
      if (timeFilter === '1Y') {
        // Example: Filter last 12 months
        return earningsData.indexOf(data) >= earningsData.length - 12;
      }
      return true; // 'All' shows all data
    });
  }, [timeFilter]);

  // Memoize chart data to optimize performance
  const chartData = useMemo(
    () => ({
      labels: filteredData.map((data) => data.month),
      datasets: [
        {
          label: 'Monthly Earnings',
          backgroundColor: '#FAD02C',
          borderColor: '#FAD02C',
          borderWidth: 1,
          data: filteredData.map((data) => data.earnings),
        },
        {
          label: 'Yearly Earnings',
          backgroundColor: '#E9EAEC',
          borderColor: '#E9EAEC',
          borderWidth: 1,
          data: filteredData.map((data) => data.earnings2),
        },
      ],
    }),
    [filteredData]
  );

  return (
    <section className="bg-white p-4 rounded-lg shadow-md font-inter">
      <div className="flex justify-between items-center mb-4 border-b border-tertiaryDark pb-3 -mx-6 px-6">
        <h2 className="flex gap-2 text-base font-bold items-center">
          <img src={icon} alt="Earnings Icon" /> Earnings
        </h2>
        <div className="flex font-bold rounded-lg p-1 text-xs text-[#E68C0F] bg-primaryLight">
          {['1M', '6M', '1Y', 'All'].map((filter) => (
            <button
              key={filter}
              className={`p-1 rounded ${
                timeFilter === filter ? 'bg-primary text-white' : 'hover:bg-primary/20'
              } transition-colors duration-200`}
              onClick={() => setTimeFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[400px] ">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false, // Remove vertical grid lines
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  display: false, // Remove horizontal grid lines
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  font: {
                    size: 12,
                  },
                  color: 'black',
                },
              },
            //   tooltip: {
            //     enabled: true,
            //     callbacks: {
            //       label: function (context) {
            //         const datasetLabel = context.dataset.label || '';
            //         const value = context.parsed.y;
            //         const month = context.label;
            //         return `${datasetLabel}: $${value} (${month})`;
            //       },
            //     },
            //   },
            },
          }}
        />
      </div>
    </section>
  );
};

export default Earnings;