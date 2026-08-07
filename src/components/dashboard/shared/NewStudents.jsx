import React from "react";
import { Link } from "react-router-dom";
import icon from "../../../assets/images/dashboardicon.png";
import photo from "../../../assets/images/photo.png";

const NewStudents = ({ students = [] }) => {
  return (
    <section className="bg-white p-3 rounded-lg shadow-md font-inter">

      <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-2 -mx-3 px-3">
        <h2 className="flex gap-2 text-base font-bold items-center">
          <img src={icon} alt="New Students" />
          New Students
        </h2>

        <Link
          to="/dashboard/students"
          className="bg-tertiary text-black text-sm font-medium px-4 py-2 rounded hover:bg-yellow-400"
        >
          View all
        </Link>
      </div>

      <table className="w-full text-left">

        <thead>
          <tr className="border-b font-bold text-sm">
            <th className="py-2">Student</th>
            <th className="py-2">Plan</th>
            <th className="py-2 text-center">Completed</th>
          </tr>
        </thead>

        <tbody>

          {students.length === 0 ? (
            <tr>
              <td
                colSpan="3"
                className="text-center py-6 text-sm text-gray-500"
              >
                No new students available.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr
                key={student.id}
                className="border-b text-xs hover:bg-gray-50"
              >
                <td className="py-3">
                  <div className="flex items-center gap-3">

                    <img
                      src={student.avatar || photo}
                      alt={student.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />

                    <div>

                      <p className="font-medium text-gray-800">
                        {student.full_name}
                      </p>

                      <p className="text-gray-500">
                        {student.email}
                      </p>

                    </div>

                  </div>
                </td>

                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                      student.plan === "Pro"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {student.plan}
                  </span>
                </td>

                <td className="py-3 text-center font-medium">
                  {student.completed_courses}
                </td>
              </tr>
            ))
          )}

        </tbody>

      </table>
    </section>
  );
};

export default NewStudents;