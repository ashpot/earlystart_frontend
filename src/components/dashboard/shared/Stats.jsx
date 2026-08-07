import React from "react";
import { Link } from "react-router-dom";
import {
  FaCopy,
  FaUsers,
  FaPenToSquare,
} from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const Stats = ({ stats = {} }) => {
  const {
    students = 0,
    instructors = 0,
    lessons = 0,
    ytd_earnings = 0,
  } = stats;

  const cards = [
    {
      title: "YTD Earnings",
      value: `₦${Number(ytd_earnings).toLocaleString()}`,
      icon: (
        <FaCopy className="bg-tertiary text-5xl p-2 rounded-md" />
      ),
      link: "/dashboard/earnings",
      color: "text-[#E60FE2]",
    },
    {
      title: "Total Students",
      value: students.toLocaleString(),
      icon: (
        <FaUsers className="bg-secondary text-5xl p-2 rounded-md" />
      ),
      link: "/dashboard/managestudents",
      color: "text-[#07C851]",
    },
    {
      title: "Total Instructors",
      value: instructors.toLocaleString(),
      icon: (
        <FaChalkboardTeacher className="bg-secondaryDark text-white text-5xl p-2 rounded-md" />
      ),
      link: "/dashboard/addInstructor",
      color: "text-[#E68C0F]",
    },
    {
      title: "Total Courses",
      value: lessons.toLocaleString(),
      icon: (
        <FaPenToSquare className="bg-primary text-5xl p-2 rounded-md" />
      ),
      link: "/dashboard/courselist",
      color: "text-primary",
    },
  ];

  return (
    <div className="font-inter grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <div className="text-2xl mb-5">
            {card.icon}
          </div>

          <p className="text-sm font-semibold text-secondaryDark">
            {card.title}
          </p>

          <h3 className="text-lg font-bold text-tertiary mb-4">
            {card.value}
          </h3>

          <Link
            to={card.link}
            className={`font-medium text-[10px] flex items-center ${card.color}`}
          >
            View all
            <HiOutlineArrowNarrowRight className="ml-3" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Stats;