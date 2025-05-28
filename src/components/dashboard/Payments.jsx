import React, { useState, useMemo } from 'react';
import { paymentsData } from '../../data/DashboardContent';
import icon from '../../assets/images/dashboardicon.png';

const Payments = () => {
  const [timeFilter, setTimeFilter] = useState('1M');

  // Filter paymentsData based on selected time period
  const filteredData = useMemo(() => {
    // Placeholder filtering logic; adjust based on your paymentsData structure
    return paymentsData.filter((payment) => {
      // Assuming paymentsData has a 'date' field (e.g., '2025-01-01')
      const paymentDate = payment.date ? new Date(payment.date) : null;
      const now = new Date();
      if (timeFilter === '1M' && paymentDate) {
        return paymentDate >= new Date(now.setMonth(now.getMonth() - 1));
      }
      if (timeFilter === '6M' && paymentDate) {
        return paymentDate >= new Date(now.setMonth(now.getMonth() - 6));
      }
      if (timeFilter === '1Y' && paymentDate) {
        return paymentDate >= new Date(now.setFullYear(now.getFullYear() - 1));
      }
      return true; // Fallback if no date field
    });
  }, [timeFilter]);

  return (
    <section className="bg-white p-3 rounded-lg shadow-md font-inter">
      <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-3 -mx-3 px-3">
        <h2 className="flex gap-2 text-base font-bold items-center">
          <img src={icon} alt="Payments Icon" className="" loading="lazy" /> Payments
        </h2>
        <div className="flex font-bold rounded-lg p-1 text-xs text-[#E68C0F] bg-primaryLight">
          {['1M', '6M', '1Y'].map((filter) => (
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
      <table className="w-full text-left">
        <thead>
          <tr className="border-b font-bold text-sm">
            <th className="py-2 text-black">Name</th>
            <th className="py-2 text-black">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length ? (
            filteredData.map((payment, index) => (
              <tr key={index} className="border-b font-medium text-xs">
                <td className="py-4">{payment.name}</td>
                <td className="py-4">{payment.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="py-4 text-center text-gray-500">
                No payments available for the selected period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default Payments;