import React from 'react'
import icon from '../../../assets/images/dashboardicon.png';
import 'react-loading-skeleton/dist/skeleton.css';

const FaqForm = () => {
  return (
	<div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm">
		<h2 className="flex gap-2 text-base font-bold mb-4 border-b border-tertiaryDark py-3 -mx-3 px-3">
				<img src={icon} alt="Top Instructor Icon" /> ADD FAQ
		</h2>
		
		<form action="" className="space-y-4">
			<input
				type="text"
				placeholder="Add title"
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none"
			/>

			<textarea
				placeholder="Add description"
				className="w-full p-3 h-36 rounded-md bg-gray-100 placeholder-[#9F9F9F] resize-none focus:outline-none"
			></textarea>

			<input
				type="text"
				placeholder="Prize"
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none"
			/>

			<input
				type="date"
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			/>

			<select
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			>
				<option value="" disabled selected>Select Sponsor</option>
				<option value="sponsor1">Sponsor 1</option>
				<option value="sponsor2">Sponsor 2</option>
				<option value="sponsor3">Sponsor 3</option>
				<option value="sponsor4">Sponsor 4</option>
			</select>

			<div className="w-full">
				<label htmlFor="competition-photo" className="block text-sm text-[#9F9F9F] mb-1">Photo</label>
				<input
				id="competition-photo"
				type="file"
				accept="image/*"
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
				/>
			</div>
			
			<button type="submit" className="bg-secondaryDark text-white py-2 px-6 rounded-3xl">Add FAQ</button>
		</form>
	</div>
  )
}

export default FaqForm
