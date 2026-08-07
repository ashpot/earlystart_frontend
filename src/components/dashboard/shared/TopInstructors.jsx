import React from "react";
import photo from "../../../assets/images/photo.png";
import icon from "../../../assets/images/dashboardicon.png";

const TopInstructors = ({ instructors = [] }) => {
  return (
    <section className="bg-white p-3 rounded-lg shadow-md font-inter">

      <div className="flex items-center gap-2 mb-4 border-b border-tertiaryDark pb-3 -mx-3 px-3">
        <img src={icon} alt="Top Instructors" />
        <h2 className="text-base font-bold">
          Top Instructors
        </h2>
      </div>

      {instructors.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-500">
          No instructors available.
        </div>
      ) : (
        <div className="space-y-4">

          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="flex items-center gap-3 px-1"
            >

              <img
                src={instructor.avatar || photo}
                alt={instructor.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex justify-between items-center w-full">

                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {instructor.full_name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {instructor.qualification}
                  </p>
                </div>

                <div className="text-right">

                  <p className="font-semibold text-sm text-primary">
                    {instructor.courses}
                  </p>

                  <p className="text-xs text-gray-500">
                    Courses
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {instructor.students} Students
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}
    </section>
  );
};

export default TopInstructors;