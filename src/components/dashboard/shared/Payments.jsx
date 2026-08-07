import React, { useMemo, useState } from "react";
import icon from "../../../assets/images/dashboardicon.png";

const Payments = ({ payments = {} }) => {
  const [timeFilter, setTimeFilter] = useState("1M");

  const filters = ["1M", "6M", "1Y"];

  const filteredPayments = useMemo(() => {
    return payments?.[timeFilter] || [];
  }, [payments, timeFilter]);

  return (
    <section className="bg-white p-3 rounded-lg shadow-md font-inter">

      <div className="flex justify-between items-center mb-3 border-b border-tertiaryDark pb-3 -mx-3 px-3">

        <h2 className="flex gap-2 items-center text-base font-bold">
          <img src={icon} alt="Payments" />
          Payments
        </h2>

        <div className="flex rounded-lg bg-primaryLight p-1 text-xs font-semibold">

          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-2 py-1 rounded transition-colors ${
                timeFilter === filter
                  ? "bg-primary text-white"
                  : "text-[#E68C0F] hover:bg-primary/20"
              }`}
            >
              {filter}
            </button>
          ))}

        </div>

      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b text-sm">

            <th className="text-left py-2">Student</th>

            <th className="text-right py-2">Amount</th>

          </tr>

        </thead>

        <tbody>

          {filteredPayments.length === 0 ? (
            <tr>
              <td
                colSpan="2"
                className="py-8 text-center text-sm text-gray-500"
              >
                No payments found.
              </td>
            </tr>
          ) : (
            filteredPayments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b text-sm hover:bg-gray-50"
              >
                <td className="py-3">
                  <div>

                    <p className="font-medium">
                      {payment.student}
                    </p>

                    <p className="text-xs text-gray-500">
                      {payment.date}
                    </p>

                  </div>
                </td>

                <td className="py-3 text-right font-semibold text-primary">
                  ₦{Number(payment.amount).toLocaleString()}
                </td>
              </tr>
            ))
          )}

        </tbody>

      </table>

    </section>
  );
};

export default Payments;