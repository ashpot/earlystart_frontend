// import React from 'react'
// import { Link } from 'react-router-dom';
// import { newStudentsData } from '../../data/DashboardContent';
// import icon from '../../assets/images/dashboardicon.png'
// import photo from '../../assets/images/photo.png'

// const NewStudents = () => {
//   return (
// 	<section className="bg-white p-3 rounded-lg shadow-md font-inter">
//       <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-2 -mx-3 px-3">
//         <h2 className="flex gap-2 text-base font-bold"><img src={icon} /> New Students</h2>
//         <Link
// 			to="/dashboard/categories"
// 			className="bg-tertiary text-black text-sm font-medium px-4 py-2 rounded hover:bg-yellow-400">
// 			View all
// 		</Link>
//       </div>
//       <table className="w-full text-left">
//         <thead>
//           <tr className="border-b font-bold text-sm">
//             <th className="py-2">Name</th>
//             <th className="py-2">Upgraded</th>
//             <th className="py-2">Completed</th>
//           </tr>
//         </thead>
//         <tbody>
//           {newStudentsData.map((student, index) => (
//             <tr key={index} className="border-b text-xs">
//               <td className="flex gap-2 py-2 font-medium">
//                 <img
//                   src={ photo }
//                   alt="Instructor"
//                   className="w-7 h-7 rounded-full"
//                 />
//                 <div>
//                   {student.name}
//                   <br />
//                   <span className="text-tertiary font-normal">{student.email}</span>
//                 </div>
//               </td>
//               <td className="py-2">{student.upgrading}</td>
//               <td className="py-2">{student.completed}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </section>
//   )
// }

// export default NewStudents


// src/components/dashboard/NewStudents.jsx
// import React, { useEffect } from 'react'; // CHANGE: Added useEffect for API fetch
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux'; // CHANGE: Added Redux hooks
// import { fetchNewStudents } from '../../features/newStudents/newStudentsSlice'; // CHANGE: Added fetch action
// // CHANGE: Removed static data import
// // import { newStudentsData } from '../../data/DashboardContent';
// import icon from '../../assets/images/dashboardicon.png';
// import photo from '../../assets/images/photo.png';

// const NewStudents = () => {
//   const dispatch = useDispatch();
//   // CHANGE: Fetch new students data as an array, default to empty array
//   const { data: newStudents = [], loading, error } = useSelector((state) => state.newStudents);

//   useEffect(() => {
//     dispatch(fetchNewStudents());
//   }, [dispatch]);

//   if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
//   if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

//   return (
//     <section className="bg-white p-3 rounded-lg shadow-md font-inter">
//       <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-2 -mx-3 px-3">
//         <h2 className="flex gap-2 text-base font-bold">
//           <img src={icon} /> New Students
//         </h2>
//         <Link
//           to="/dashboard/students" // CHANGE: Updated link to a more relevant path
//           className="bg-tertiary text-black text-sm font-medium px-4 py-2 rounded hover:bg-yellow-400"
//         >
//           View all
//         </Link>
//       </div>
//       <table className="w-full text-left">
//         <thead>
//           <tr className="border-b font-bold text-sm">
//             <th className="py-2">Name</th>
//             <th className="py-2">Upgraded</th>
//             <th className="py-2">Completed</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* CHANGE: Added conditional rendering for empty data */}
//           {newStudents.length === 0 ? (
//             <tr>
//               <td colSpan="3" className="text-center py-6 text-sm text-gray-500">
//                 No new students available.
//               </td>
//             </tr>
//           ) : (
//             newStudents.map((student, index) => (
//               <tr key={index} className="border-b text-xs">
//                 <td className="flex gap-2 py-2 font-medium">
//                   <img
//                     src={photo}
//                     alt="Student"
//                     className="w-7 h-7 rounded-full"
//                   />
//                   <div>
//                     {student.name}
//                     <br />
//                     <span className="text-tertiary font-normal">{student.email}</span>
//                   </div>
//                 </td>
//                 <td className="py-2">{student.upgrading}</td>
//                 <td className="py-2 text-center">{student.completed}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </section>
//   );
// };

// export default NewStudents;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNewStudents } from '../../../features/newStudents/newStudentsSlice';
import icon from '../../../assets/images/dashboardicon.png';
import photo from '../../../assets/images/photo.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const NewStudents = () => {
  const dispatch = useDispatch();
  const { data: newStudents = [], loading, error } = useSelector((state) => state.newStudents);

  useEffect(() => {
    dispatch(fetchNewStudents());
  }, [dispatch]);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (loading) {
    return (
      <section className="bg-white p-3 rounded-lg shadow-md font-inter">
        <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-2 -mx-3 px-3">
          <div className="flex gap-2 items-center">
            <Skeleton circle={true} width={20} height={20} />
            <Skeleton width={120} height={20} />
          </div>
          <Skeleton width={80} height={32} />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b font-bold text-sm">
              <th className="py-2"><Skeleton width="50%" /></th>
              <th className="py-2"><Skeleton width="50%" /></th>
              <th className="py-2"><Skeleton width="50%" /></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, index) => (
              <tr key={index} className="border-b text-xs">
                <td className="flex gap-2 py-2">
                  <Skeleton circle={true} width={28} height={28} />
                  <div>
                    <Skeleton width={80} height={12} className="mb-1" />
                    <Skeleton width={100} height={10} />
                  </div>
                </td>
                <td className="py-2"><Skeleton width="60%" /></td>
                <td className="py-2 text-center"><Skeleton width="40%" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  // if (newStudents.length === 0) {
  return (
    <section className="bg-white p-3 rounded-lg shadow-md font-inter">
      <div className="flex justify-between items-center mb-1 border-b border-tertiaryDark pb-2 -mx-3 px-3">
        <h2 className="flex gap-2 text-base font-bold">
          <img src={icon} alt="New Students Icon" /> New Students
        </h2>
        <Link
          to="/dashboard/students"
          className="bg-tertiary text-black text-sm font-medium px-4 py-2 rounded hover:bg-yellow-400"
        >
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
          {newStudents.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center py-6 text-sm text-gray-500">
                No new students available.
              </td>
            </tr>
          )}
          {newStudents.map((student, index) => (
            <tr key={index} className="border-b text-xs">
              <td className="flex gap-2 py-2 font-medium">
                <img
                  src={photo}
                  alt="Student"
                  className="w-7 h-7 rounded-full"
                />
                <div>
                  {student.name}
                  <br />
                  <span className="text-tertiary font-normal">{student.email}</span>
                </div>
              </td>
              <td className="py-2">{student.upgrading}</td>
              <td className="py-2 text-center">{student.completed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
// }
};

export default NewStudents;