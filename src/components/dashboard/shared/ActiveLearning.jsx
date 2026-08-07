import React from "react";
import { Link } from "react-router-dom";
import icon from "../../../assets/images/dashboardicon.png";

const truncateText = (text = "", maxLength = 20) => {
  return text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text;
};

const ActiveLearning = ({ activeLearning = [] }) => {
  return (
    <section className="bg-white p-4 rounded-lg shadow-md font-inter">

      <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-2 -mx-6 px-6">
        <h2 className="flex gap-2 text-base font-bold items-center">
          <img src={icon} alt="Active Learning" />
          Active Learning
        </h2>

        <Link
          to="/dashboard/active-learnings"
          className="bg-tertiary text-black font-medium text-sm px-4 py-2 rounded hover:bg-yellow-400"
        >
          View all
        </Link>
      </div>

      {activeLearning.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No active learning records available.
        </div>
      ) : (
        <table className="w-full text-left">

          <thead>
            <tr className="border-b text-sm">
              <th className="py-3">Student</th>
              <th className="py-3">Course</th>
              <th className="py-3">Progress</th>
            </tr>
          </thead>

          <tbody>
            {activeLearning.map((item) => (
              <tr key={item.id} className="border-b text-xs">

                <td className="py-3">
                  {item.student?.full_name ||
                    `${item.student?.first_name ?? ""} ${item.student?.last_name ?? ""}`}
                </td>

                <td className="py-3">
                  {truncateText(
                    item.lesson?.course?.title ||
                    item.lesson?.title ||
                    ""
                  )}
                </td>

                <td className="py-3">

                  <div className="flex items-center">

                    <div className="w-full bg-primaryLight rounded-full h-2.5">

                      <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${item.progress || 0}%`,
                        }}
                      />

                    </div>

                    <span className="ml-3 text-xs font-medium whitespace-nowrap">
                      {item.progress || 0}%
                    </span>

                  </div>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      )}
    </section>
  );
};

export default ActiveLearning;