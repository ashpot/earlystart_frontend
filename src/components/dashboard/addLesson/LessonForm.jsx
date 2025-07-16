import React from 'react'
import icon from '../../../assets/images/dashboardicon.png';
import 'react-loading-skeleton/dist/skeleton.css';


const LessonForm = () => {
  return (
	<div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm">
		<h2 className="flex gap-2 text-base font-bold mb-4 border-b border-tertiaryDark py-3 -mx-3 px-3">
				<img src={icon} alt="Top Instructor Icon" /> ADD LESSON
		</h2>
	  
		<form className="space-y-4">
			<input
				type="text"
				placeholder="Add lesson title"
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none"
			/>

			<select
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			>
				<option value="" disabled selected>Select category</option>
				<option value="programming">Programming</option>
				<option value="design">Design</option>
				<option value="business">Business</option>
				<option value="marketing">Marketing</option>
				<option value="other">Other</option>
			</select>

			<select
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			>
				<option value="" disabled selected>Add to a course</option>
				<option value="course1">Course 1</option>
				<option value="course2">Course 2</option>
				<option value="course3">Course 3</option>
				<option value="course4">Course 4</option>
			</select>

			<select
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			>
				<option value="" disabled selected>Add to a section</option>
				<option value="section1">Section 1</option>
				<option value="section2">Section 2</option>
				<option value="section3">Section 3</option>
			</select>

			<div className="w-full">
				<label htmlFor="lesson-video" className="block text-sm text-[#9F9F9F] mb-1">Video</label>
				<input
				id="lesson-video"
				type="file"
				accept="video/*"
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
				/>
			</div>

			<div className="w-full">
				<label htmlFor="lesson-note" className="block text-sm text-[#9F9F9F] mb-1">Note (PDF)</label>
				<input
				id="lesson-note"
				type="file"
				accept="application/pdf"
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
				/>
			</div>

			<input
				type="text"
				placeholder="Duration"
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none"
			/>

			<select
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			>
				<option value="" disabled selected>Select Age Range</option>
				<option value="kids">Kids (5-12)</option>
				<option value="teens">Teens (13-17)</option>
				<option value="adults">Adults (18+)</option>
				<option value="all">All Ages</option>
			</select>

			<button
				type="button"
				className="bg-secondaryDark text-white py-2 px-6 rounded-3xl"
			>
				Add Lesson
			</button>
		</form>
	</div>
  )
}

export default LessonForm
