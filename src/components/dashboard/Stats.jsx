import React from 'react'
import { Link } from 'react-router-dom';
import { statsData } from '../../data/DashboardContent';
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const Stats = () => {
  return (
	<div className="font-inter grid grid-cols-2 gap-4">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md ">
          <div className="text-2xl mb-5 ">{stat.icon}</div>
          <p className="text-sm font-semibold text-secondaryDark">{stat.value}</p>
          <h3 className="text-xs font-normal text-tertiary mb-4">{stat.title}</h3>
          <Link to={stat.link} className="font-medium text-[10px] flex items-center ">View all <HiOutlineArrowNarrowRight className='ml-3'/> </Link>
        </div>
      ))}
    </div>
  )
}

export default Stats
