import React from 'react'
import icon from '../../../assets/images/dashboardicon.png';
import 'react-loading-skeleton/dist/skeleton.css';


const CourseForm = () => {
  return (
	<div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm">
		<h2 className="flex gap-2 text-base font-bold mb-4 border-b border-tertiaryDark py-3 -mx-3 px-3">
				<img src={icon} alt="Top Instructor Icon" /> ADD COURSE
		</h2>
	  
		<form className="space-y-4">
			<input
				type="text"
				placeholder="Add course title..."
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none"
			/>

			<select
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			>
				<option value="" disabled selected>Select course category</option>
				<option value="programming">Programming</option>
				<option value="design">Design</option>
				<option value="business">Business</option>
				<option value="marketing">Marketing</option>
				<option value="other">Other</option>
			</select>

			<textarea
				placeholder="Enter description"
				className="w-full p-3 h-36 rounded-md bg-gray-100 placeholder-[#9F9F9F] resize-none focus:outline-none"
			></textarea>

			<div className="w-full">
				<label htmlFor="course-photo" className="block text-sm text-[#9F9F9F] mb-1">Course Photo</label>
				<input
				id="course-photo"
				type="file"
				accept="image/*"
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
				/>
			</div>

			<div className="w-full">
				<label htmlFor="course-thumbnail" className="block text-sm text-[#9F9F9F] mb-1">Course Thumbnail</label>
				<input
				id="course-thumbnail"
				type="file"
				accept="image/*"
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
				/>
			</div>

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
				Add Course
			</button>
		</form>
	</div>
  )
}

export default CourseForm
