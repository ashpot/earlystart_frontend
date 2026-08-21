import React, { useState }  from 'react'
import { NavLink, Link } from 'react-router-dom';
import { FaHome, FaQuestionCircle } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaChartLine, FaPenToSquare } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { FaAward } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { FaGreaterThan } from "react-icons/fa";
import logo from '../../../assets/images/eslogo.png'

const Sidebar = () => {
	const [isUsersOpen, setIsUsersOpen] = useState(false);
	const [isCoursesOpen, setIsCoursesOpen] = useState(false);
	const [isQuizOpen, setIsQuizOpen] = useState(false);
	const [isLiveClassesOpen, setIsLiveClassesOpen] = useState(false);
	const [isCompetitionsOpen, setIsCompetitionsOpen] = useState(false);
	const [isSubscriptionsOpen, setIsSubscriptionsOpen] = useState(false);
	const [isSupportsOpen, setIsSupportsOpen] = useState(false);
	const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

	const toggleDropdown = (setter) => {
		setter(prev => !prev);
	};

  return (
	<div className='font-inter bg-primary text-secondaryDark w-60' >
		<div className="flex items-center justify-center border-b py-[11.2px] cursor-pointer">
			<img src={logo} className='w-3/4' />
		</div>

		<nav className='p-7'>
			<ul className='space-y-6 '>
				<li className='font-normal text-[10px] pt-3 px-2'>MAIN</li>
				<li className='flex items-center font-bold text-base gap-4 p-2'>
					<Link to="/admin/dashboard" className="flex items-center gap-4">
						<FaHome /> Dashboard
					</Link>
		  		</li>

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
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/students" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Students
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/instructors/add" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Instructors
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/administrators/add" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Administrators
								</NavLink>
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
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/category/add" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Add Category
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/categories" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Categories
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/course/add" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Add Course
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/courses" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Course
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/section/add" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Add Section
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/sections" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Sections
								</NavLink>
							</li>

							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/lesson/add" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Add Lesson
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/lessons" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Lessons
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/lesson-test/add" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Add Lesson Test
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/lesson-tests" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Lesson Tests
								</NavLink>
							</li>
							
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/curriculums" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Curriculums
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quiz-scores" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Curriculum Lessons
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quiz-scores" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Enrollments
								</NavLink>
							</li>
						</ul>
					)}
				</li>


				<li>
					<div className='flex items-center justify-between cursor-pointer rounded-3xl hover:bg-white p-2' onClick={() => toggleDropdown(setIsQuizOpen)}>
						<div className='flex items-center gap-4'>
							<FaQuestionCircle /> <span className='font-bold text-base'>Quizs</span>
						</div>
						<FaGreaterThan className={`text-xs transform transition-transform ${isQuizOpen ? 'rotate-90' : ''}`} />
					</div>
					{isQuizOpen && (
						<ul className='pl-8 mt-2'>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quiz/add" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Add Quiz
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quizes" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Quiz
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quiz-question/add" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Add Quiz Question
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quiz-questions" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Quiz Questions
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quiz-attempts" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Quiz Attempts
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quiz-attempts/answers" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Quiz Attempts Answers
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quiz-scores" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Quiz Scores
								</NavLink>
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
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/class/create" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Create Class
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/classes" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Classes
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quiz-scores" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Class Participants
								</NavLink>
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
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/competition/add" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Add Competition
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/competitions" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Competitions
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quiz-scores" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Competitors
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/quiz-scores" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Sponsors
								</NavLink>
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
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/subscriptions" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Subscriptions
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/payments" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Payments
								</NavLink>
							</li>
						</ul>
					)}
				</li>

				<li className='font-normal text-[10px] pt-7 px-2'>GENERAL</li>
				<li>
					<div className='flex items-center justify-between cursor-pointer rounded-3xl hover:bg-white p-2' onClick={() => toggleDropdown(setIsAnalyticsOpen)}>
						<div className='flex items-center gap-4'>
							<FaChartLine /> <span className='font-bold text-base'>Analytics</span>
						</div>
						<FaGreaterThan className={`text-xs transform transition-transform ${isAnalyticsOpen ? 'rotate-90' : ''}`} />
					</div>
					{isAnalyticsOpen && (
						<ul className='pl-8 mt-2'>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/subscriptions" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Progress
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/payments" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Ranks
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/payments" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Manage Achievements
								</NavLink>
							</li>
						</ul>
					)}
				</li>

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
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/tickets" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Tickets
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/faqs" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									FAQs
								</NavLink>
							</li>
							<li className='flex items-center gap-3 p-2 font-normal text-sm hover:bg-white group rounded-2xl'>
								<span className='w-2 h-2 bg-white group-hover:bg-black rounded-full'></span> 
								<NavLink to="/admin/articles" className={({ isActive }) => `text-secondaryDark ${isActive ? 'font-bold' : ''}`}>
									Articles
								</NavLink>
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

