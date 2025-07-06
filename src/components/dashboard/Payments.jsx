
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPayments } from '../../features/payments/paymentsSlice';
import icon from '../../assets/images/dashboardicon.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Payments = () => {
  const dispatch = useDispatch();
  const { data: payments = [], loading, error } = useSelector((state) => state.payments);
  const [timeFilter, setTimeFilter] = useState('1M');

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    return payments.filter((payment) => {
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
      return true;
    });
  }, [timeFilter, payments]);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (loading) {
    return (
      <section className="bg-white p-3 rounded-lg shadow-md font-inter">
        <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-3 -mx-3 px-3">
          <div className="flex gap-2 items-center">
            <Skeleton circle={true} width={20} height={20} />
            <Skeleton width={100} height={20} />
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} width={20} height={20} />
            ))}
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b font-bold text-sm">
              <th className="py-2"><Skeleton width="50%" /></th>
              <th className="py-2"><Skeleton width="50%" /></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, index) => (
              <tr key={index} className="border-b font-medium text-xs">
                <td className="py-4"><Skeleton width="60%" /></td>
                <td className="py-4"><Skeleton width="40%" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
 //if (payments.length === 0) {
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
              <td colSpan="2" className="py-4 text-xs text-center text-gray-500">
                No payments available for the selected period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
 // }


  //return "Hello world";
};

export default Payments;