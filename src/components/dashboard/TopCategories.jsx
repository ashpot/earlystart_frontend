import React from 'react'
import { Link } from 'react-router-dom'
import { topCategories } from '../../data/DashboardContent'
import icon from '../../assets/images/dashboardicon.png'

const TopCategories = () => {
  return (
	   <section className='bg-white rounded-lg p-4 font-inter shadow-md'>
		<div>
			<div className='flex justify-between items-center border-b border-tertiaryDark pb-2 -mx-5 px-5'>
				<h2 className='flex gap-2 font-bold text-base'><img src={icon} /> Top Categories</h2>
				<Link
					to="/dashboard/categories"
					className="bg-primaryLight text-black font-medium text-sm px-4 py-2 rounded hover:bg-yellow-400">
					View all
        		</Link>
			</div>

			<div className='grid grid-cols-4 gap-4 my-6 '>
			{topCategories.map((category, index) => (
				<Link
				key={index}
				className="border border-tertiary rounded-lg w-full h-40 p-4"
				>
				<div className='bg-primary rounded-lg w-[88px] h-[58px] my-auto mx-auto mb-2'></div>
				<div className="flex flex-col text-center items-center gap-2 max-w-full">
					<h3 className="text-sm font-semibold text-black">{category.title}</h3>
					<p className="text-tertiary text-xs">{category.courseCount}</p>
				</div>
				</Link>
			))}
			</div>

		</div>
	  </section>
  )
}

export default TopCategories
