import React from 'react'
import { Link } from 'react-router-dom';
import { newStudentsData } from '../../data/DashboardContent';
import icon from '../../assets/images/dashboardicon.png'
import photo from '../../assets/images/photo.png'

const NewStudents = () => {
  return (
	<section className="bg-white p-3 rounded-lg shadow-md font-inter">
      <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-2 -mx-3 px-3">
        <h2 className="flex gap-2 text-base font-bold"><img src={icon} /> New Students</h2>
        <Link
			to="/dashboard/categories"
			className="bg-tertiary text-black text-sm font-medium px-4 py-2 rounded hover:bg-yellow-400">
			View all
		</Link>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b font-bold text-sm">
            <th className="py-2">Name</th>
            <th className="py-2">Upgraded</th>
            <th className="py-2">Completed</th>
          </tr>
        </thead>
        <tbody>
          {newStudentsData.map((student, index) => (
            <tr key={index} className="border-b text-xs">
              <td className="flex gap-2 py-2 font-medium">
                <img
                  src={ photo }
                  alt="Instructor"
                  className="w-7 h-7 rounded-full"
                />
                <div>
                  {student.name}
                  <br />
                  <span className="text-tertiary font-normal">{student.email}</span>
                </div>
              </td>
              <td className="py-2">{student.upgrading}</td>
              <td className="py-2">{student.completed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default NewStudents
