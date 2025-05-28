import React from 'react'
import { Link } from 'react-router-dom'
import { activeLearningsData } from '../../data/DashboardContent'
import icon from '../../assets/images/dashboardicon.png'

const ActiveLearning = () => {
  return (
	<section className="bg-white p-4 rounded-lg shadow-md font-inter">
      <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-2 -mx-6 px-6">
        <h2 className="flex gap-2 text-base font-bold"><img src={icon} /> Active Learnings</h2>
        <Link
			to="/dashboard/categories"
			className="bg-tertiary text-black font-medium text-sm px-4 py-2 rounded hover:bg-yellow-400">
			View all
		</Link>
      </div>
      <table className="w-full text-left ">
        <thead>
          <tr className="border-b text-sm">
            <th className="py-2">User</th>
            <th className="py-2">Course</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {activeLearningsData.map((item, index) => (
            <tr key={index} className="border-b text-xs">
              <td className="py-2">{item.user}</td>
              <td className="py-2">{item.course}</td>
              <td className="py-2">
				<div className='flex items-center'>
					<div className="w-full bg-primaryLight rounded-full h-2.5">
					<div
						className="bg-primary h-2.5 rounded-full"
						style={{ width: `${item.status}%` }}
					></div>
					</div>
					<span className="text-xs ml-3">{item.status}%</span>
				</div>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default ActiveLearning
