import React from 'react'
import icon from '../../../assets/images/dashboardicon.png';
import 'react-loading-skeleton/dist/skeleton.css';

const InstructorForm = () => {
  return (
	<div className="bg-white p-6 rounded-xl shadow-sm h-full">
		<h2 className="flex gap-2 text-base font-bold mb-4 border-b border-tertiaryDark py-3 -mx-3 px-3">
				<img src={icon} alt="Top Instructor Icon" /> ADD INSTRUCTOR
		</h2>
		
		<form className="space-y-4">
			<input
				type="text"
				placeholder="Fullname"
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none"
			/>

			<div className="w-full">
				<label htmlFor="profile-photo" className="block text-sm text-[#9F9F9F] mb-1">Profile Photo</label>
				<input
				id="profile-photo"
				type="file"
				accept="image/*"
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
				/>
			</div>

			<input
				type="text"
				placeholder='Portfolio'
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
			/>

			<select
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			>
				<option value="" disabled selected>Select Gender</option>
				<option value="male">Male</option>
				<option value="female">Female</option>
			</select>

			<input
				type="email"
				placeholder="Email"
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			/>

			<input
				type='text'
				placeholder='Phone'
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
			/>

			<button
				type="button"
				className="bg-secondaryDark text-white py-2 px-6 rounded-3xl"
			>
				Add Instructor
			</button>
		</form>
	</div>
  )
}

export default InstructorForm
