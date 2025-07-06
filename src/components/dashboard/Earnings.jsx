
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEarnings } from '../../features/earnings/earningsSlice';
import { Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import icon from '../../assets/images/dashboardicon.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const Earnings = () => {
  const dispatch = useDispatch();
  const { data: earningsData = [], loading, error } = useSelector((state) => state.earnings);
  const [timeFilter, setTimeFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchEarnings());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    return earningsData.filter((data) => {
      if (timeFilter === '1M') return earningsData.indexOf(data) === earningsData.length - 1;
      if (timeFilter === '6M') return earningsData.indexOf(data) >= earningsData.length - 6;
      if (timeFilter === '1Y') return earningsData.indexOf(data) >= earningsData.length - 12;
      return true;
    });
  }, [timeFilter, earningsData]);

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

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return (
      <section className="bg-white p-4 rounded-lg shadow-md font-inter">
        <div className="flex justify-between items-center mb-4 border-b border-tertiaryDark pb-3 -mx-6 px-6">
          <div className="flex gap-2 items-center">
            <Skeleton circle={true} width={20} height={20} />
            <Skeleton width={100} height={20} />
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} width={30} height={24} />
            ))}
          </div>
        </div>
        <div className="relative h-[400px]">
          <Skeleton height={400} />
        </div>
      </section>
    );
  }

  if (earningsData.length === 0) {
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
        <p className="text-center text-sm text-gray-500 py-4">No earnings data available</p>
      </section>
    );
  }

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
      <div className="relative h-[400px]">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true, grid: { display: false } },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: { font: { size: 12 }, color: 'black' },
              },
            },
          }}
        />
      </div>
    </section>
  );
};

export default Earnings;