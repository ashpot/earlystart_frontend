import React, { useState }  from 'react'
import { FaHome } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { FaAward } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { FaGreaterThan } from "react-icons/fa";
import logo from '../../assets/images/earlystartlogo.png'

const Sidebar = () => {
	const [isUsersOpen, setIsUsersOpen] = useState(false);
	const [isCoursesOpen, setIsCoursesOpen] = useState(false);
	const [isLiveClassesOpen, setIsLiveClassesOpen] = useState(false);
	const [isCompetitionsOpen, setIsCompetitionsOpen] = useState(false);
	const [isSubscriptionsOpen, setIsSubscriptionsOpen] = useState(false);
	const [isSupportsOpen, setIsSupportsOpen] = useState(false);

	const toggleDropdown = (setter) => {
		setter(prev => !prev);
	};

  return (
	<div className='font-inter bg-primary text-secondaryDark w-60' >
		<div className="flex items-center justify-center border-b py-[10px] cursor-pointer">
			<img src={logo} className='w-3/4' />
		</div>

		<nav className='p-7'>
			<ul className='space-y-6 '>
				<li className='font-normal text-[10px] pt-3 px-2'>MAIN</li>
				<li className='flex items-center font-bold text-base gap-4 p-2'> <FaHome clas/> Dashboard</li>

				<li>
					<div className='flex items-center justify-between cursor-pointer rounded-3xl hover:bg-white p-2' onClick={() => toggleDropdown(setIsUsersOpen)}>
						<div className='flex items-center gap-4 '>
							<FaUser /> <span className='font-bold text-base'>Users</span>
						</div>
						<FaGreaterThan className={`text-xs transform transition-transform ${isUsersOpen ? 'rotate-90' : ''}`} />
					</div>
					{isUsersOpen && (
						<ul className='pl-8 mt-2'>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white rounded-2xl group'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Students
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Instructors
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Administrators
							</li>
						</ul>
					)}
				</li>

				<li>
					<div className='flex items-center justify-between cursor-pointer rounded-3xl hover:bg-white p-2' onClick={() => toggleDropdown(setIsCoursesOpen)}>
						<div className='flex items-center gap-4'>
							<FaPenToSquare /> <span className='font-bold text-base'>Courses</span>
						</div>
						<FaGreaterThan className={`text-xs transform transition-transform ${isCoursesOpen ? 'rotate-90' : ''}`} />
					</div>
					{isCoursesOpen && (
						<ul className='pl-8 mt-2'>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Add Lesson
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Manage Lessons
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Add Quiz
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Manage Quiz
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Manage Curriculums
							</li>
						</ul>
					)}
				</li>

				<li>
					<div className='flex items-center justify-between cursor-pointer rounded-3xl hover:bg-white p-2' onClick={() => toggleDropdown(setIsLiveClassesOpen)}>
						<div className='flex items-center gap-4'>
							<FaVideo /> <span className='font-bold text-base'>Live Classes</span>
						</div>
						<FaGreaterThan className={`text-xs transform transition-transform ${isLiveClassesOpen ? 'rotate-90' : ''}`} />
					</div>
					{isLiveClassesOpen && (
						<ul className='pl-8 mt-2'>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Create Class
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Manage Classes
							</li>
						</ul>
					)}
				</li>

				<li>
					<div className='flex items-center justify-between cursor-pointer rounded-3xl hover:bg-white p-2' onClick={() => toggleDropdown(setIsCompetitionsOpen)}>
						<div className='flex items-center gap-4'>
							<FaAward /> <span className='font-bold text-base'>Competitions</span>
						</div>
						<FaGreaterThan className={`text-xs transform transition-transform ${isCompetitionsOpen ? 'rotate-90' : ''}`} />
					</div>
					{isCompetitionsOpen && (
						<ul className='pl-8 mt-2'>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Add Competition
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Manage Competitions
							</li>
						</ul>
					)}
				</li>

				<li className='font-normal text-[10px] pt-5 px-2'>FINANCE</li>
				<li>
					<div className='flex items-center justify-between cursor-pointer rounded-3xl hover:bg-white p-2' onClick={() => toggleDropdown(setIsSubscriptionsOpen)}>
						<div className='flex items-center gap-4'>
							<FaShoppingCart /> <span className='font-bold text-base'>Subscriptions</span>
						</div>
						<FaGreaterThan className={`text-xs transform transition-transform ${isSubscriptionsOpen ? 'rotate-90' : ''}`} />
					</div>
					{isSubscriptionsOpen && (
						<ul className='pl-8 mt-2'>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Manage Subscriptions
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Manage Payments
							</li>
						</ul>
					)}
				</li>

				<li className='font-normal text-[10px] pt-7 px-2'>GENERAL</li>
				<li>
					<div className='flex items-center justify-between cursor-pointer rounded-3xl hover:bg-white p-2' onClick={() => toggleDropdown(setIsSupportsOpen)}>
						<div className='flex items-center gap-4'>
							<IoMdSettings /> <span className='font-bold text-base'>Supports</span>
						</div>
						<FaGreaterThan className={`text-xs transform transition-transform ${isSupportsOpen ? 'rotate-90' : ''}`} />
					</div>
					{isSupportsOpen && (
						<ul className='pl-8 mt-2'>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Tickets
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> FAQs
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> Articles
							</li>
						</ul>
					)}
				</li>
			</ul>
		</nav>
	  
	</div>
  )
}

export default Sidebar

