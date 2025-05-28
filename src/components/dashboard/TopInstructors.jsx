import React from 'react'
import { topInstructorsData } from '../../data/DashboardContent';
import photo from '../../assets/images/photo.png'
import icon from '../../assets/images/dashboardicon.png'

const TopInstructors = () => {
  return (
	<section className="bg-white p-2 rounded-lg shadow-md font-inter">
	<h2 className="flex gap-2 text-base font-bold mb-4 border-b border-tertiaryDark py-3 -mx-3 px-3"><img src={icon} /> Top Instructor</h2>
	<div className="space-y-4">
	  {topInstructorsData.map((instructor, index) => (
		<div key={index} className="flex items-center px-1 space-x-3">
		  <img
			src={ photo }
			alt="Instructor"
			className="w-7 h-7 rounded-full"
		  />
		  <div className='flex justify-between w-full'>
			<p className="font-bold text-xs">{instructor.name} <br /> <span className='text-[11px] font-normal text-tertiary'>{instructor.degree}</span></p>
			<p className="text-xs font-bold text-primary text-right">
			  {instructor.classes} Classes <br /> <span className='text-[11px] font-normal text-tertiary'>{instructor.course}</span> 
			</p>
		  </div>
		</div>
	  ))}
	</div>
  </section>
  )
}

export default TopInstructors
