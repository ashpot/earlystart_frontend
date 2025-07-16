import React from 'react'
import icon from '../../../assets/images/dashboardicon.png';
import 'react-loading-skeleton/dist/skeleton.css';

const QuizForm = () => {
  return (
	<div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm">
		<h2 className="flex gap-2 text-base font-bold mb-4 border-b border-tertiaryDark py-3 -mx-3 px-3">
				<img src={icon} alt="Top Instructor Icon" /> ADD QUIZ
		</h2>
		
		<form className="space-y-4">
			<select
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			>
				<option value="" disabled selected>Select Lesson</option>
				<option value="lesson1">Lesson 1</option>
				<option value="lesson2">Lesson 2</option>
				<option value="lesson3">Lesson 3</option>
				<option value="lesson4">Lesson 4</option>
			</select>

			<select
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			>
				<option value="" disabled selected>Select Section</option>
				<option value="section1">Section 1</option>
				<option value="section2">Section 2</option>
				<option value="section3">Section 3</option>
			</select>

			<textarea
				placeholder="Enter Quiz Question"
				className="w-full p-3 h-36 rounded-md bg-gray-100 placeholder-[#9F9F9F] resize-none focus:outline-none"
			></textarea>

			<input
				type="text"
				placeholder="Option A"
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none"
			/>

			<input
				type="text"
				placeholder="Option B"
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none"
			/>

			<input
				type="text"
				placeholder="Option C"
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none"
			/>

			<input
				type="text"
				placeholder="Option D"
				className="w-full p-3 rounded-md bg-gray-100 placeholder-[#9F9F9F] focus:outline-none"
			/>

			<select
				className="w-full p-3 rounded-md bg-gray-100 text-[#9F9F9F] focus:outline-none focus:ring-2 focus:ring-yellow-400"
			>
				<option value="" disabled selected>Correct Answer</option>
				<option value="A">Option A</option>
				<option value="B">Option B</option>
				<option value="C">Option C</option>
				<option value="D">Option D</option>
			</select>

			<button
				type="button"
				className="bg-secondaryDark text-white py-2 px-6 rounded-3xl"
			>
				Add Quiz
			</button>
		</form>
	</div>
  )
}

export default QuizForm
