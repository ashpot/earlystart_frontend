import React from 'react'
import icon from '../../../assets/images/dashboardicon.png';
import 'react-loading-skeleton/dist/skeleton.css';

const LiveClassForm = () => {
  return (
	<div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm">
		<h2 className="flex gap-2 text-base font-bold mb-4 border-b border-tertiaryDark py-3 -mx-3 px-3">
				<img src={icon} alt="Top Instructor Icon" /> ADD LIVE CLASS
		</h2>
		
		<form className="space-y-4">
			<input
				type="text"
				placeholder="Title"
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none"
			/>

			<input
				type="date"
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			/>

			<div className="w-full">
				<label htmlFor="start-time" className="block text-sm text-[#9F9F9F] mb-1">Start Time</label>
				<input
				id="start-time"
				type="time"
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
				/>
			</div>

			<div className="w-full">
				<label htmlFor="end-time" className="block text-sm text-[#9F9F9F] mb-1">End Time</label>
				<input
				id="end-time"
				type="time"
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
				/>
			</div>

			<div className="w-full">
				<label htmlFor="live-class-photo" className="block text-sm text-[#9F9F9F] mb-1">Photo</label>
				<input
				id="live-class-photo"
				type="file"
				accept="image/*"
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
				/>
			</div>

			<select
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			>
				<option value="" disabled selected>Select Instructor</option>
				<option value="instructor1">Instructor 1</option>
				<option value="instructor2">Instructor 2</option>
				<option value="instructor3">Instructor 3</option>
				<option value="instructor4">Instructor 4</option>
			</select>

			<button
				type="button"
				className="bg-secondaryDark text-white py-2 px-6 rounded-3xl"
			>
				Add Live Class
			</button>
		</form>
	</div>
  )
}

export default LiveClassForm
