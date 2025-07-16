
// import React, { useState, useEffect, useRef } from 'react';
// import { FaSearch, FaAngleDown, FaUser } from 'react-icons/fa';
// import { HiOutlineMenuAlt1 } from "react-icons/hi";
// import { FaXmark } from "react-icons/fa6";
// import { FiLogOut } from "react-icons/fi";
// import { useNavigate } from 'react-router-dom';
// import photo from '../../../assets/images/photo.png';

// const DashboardNavbar = ({ toggleSidebar, isSidebarCollapsed}) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const toggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSearch = (query) => {
//     if (query && query.trim().length > 0) {
//       navigate('/search-results', { state: { searchQuery: query } });
//     } else {
//       setSearchQuery(''); // Clear input if empty
//     }
//   };

//   const handleInputChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     handleSearch(query); // Trigger search on change
//   };

//   return (
//     <div className=''>
//       <nav className="bg-white px-4 py-[11.2px] flex justify-between items-center shadow-md">
//         <div className=' items-center'>
//           {isSidebarCollapsed ? (
//             <FaXmark 
//               className="text-4xl font-extrabold cursor-pointer"
//               onClick={toggleSidebar}
//             />
//           ) : (
//             <HiOutlineMenuAlt1
//               className="text-4xl font-extrabold cursor-pointer"
//               onClick={toggleSidebar}
//             />
//           )}
//         </div>
        
//         <div className="relative w-3/4 max-w-lg">
//           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary font-semibold text-2xl" />
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={handleInputChange}
//             className="w-full font-normal text-sm p-2 pl-12 rounded-3xl border focus:outline-none focus:ring-2 focus:ring-yellow-400"
//           />
//         </div>
        
//         <div className="flex items-center space-x-8">
//           <div className="flex items-center space-x-4 cursor-pointer" ref={dropdownRef} onClick={toggleDropdown}>
//             <img
//               src={photo}
//               alt="User"
//               className="w-8 h-8 rounded-full "
//             />
//             <div className="flex flex-col">
//               <span className="font-bold text-base">Psalms Kalu</span>
//               <span className="font-normal text-[13px]">Administrator</span>
//             </div>
//             <FaAngleDown className='text-secondary text-xl cursor-pointer'/>
//           </div>
//           {isDropdownOpen && (
//             <ul className="absolute top-16 right-3 w-48 bg-white shadow-lg rounded-lg">
//               <li className="flex items-center gap-3 px-4 py-2 font-normal text-sm hover:bg-tertiary cursor-pointer"><FaUser className='text-secondaryDark'/> Profile</li>
//               <li className="flex items-center gap-3 px-4 py-2 font-normal text-sm hover:bg-tertiary cursor-pointer"> <FiLogOut className='text-secondaryDark'/> Logout</li>
//             </ul>
//           )}
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default DashboardNavbar;

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaAngleDown, FaUser } from 'react-icons/fa';
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { FaXmark } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import photo from '../../../assets/images/photo.png';

const DashboardNavbar = ({ toggleSidebar, isSidebarCollapsed }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    if (query && query.trim().length > 0) {
      navigate('/search-results', { state: { searchQuery: query } });
    } else {
      setSearchQuery('');
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleLogout = () => {
    // Clear authentication token from localStorage
    localStorage.removeItem('token');
    // Close dropdown
    setIsDropdownOpen(false);
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div>
      <nav className="bg-white px-4 py-[11.2px] flex justify-between items-center shadow-md">
        <div className="items-center">
          {isSidebarCollapsed ? (
            <FaXmark
              className="text-4xl font-extrabold cursor-pointer"
              onClick={toggleSidebar}
            />
          ) : (
            <HiOutlineMenuAlt1
              className="stopped text-4xl font-extrabold cursor-pointer"
              onClick={toggleSidebar}
            />
          )}
        </div>

        <div className="relative w-3/4 max-w-lg">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary font-semibold text-2xl" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full font-normal text-sm p-2 pl-12 rounded-3xl border focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4 cursor-pointer" ref={dropdownRef} onClick={toggleDropdown}>
            <img
              src={photo}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base">Psalms Kalu</span>
              <span className="font-normal text-[13px]">Administrator</span>
            </div>
            <FaAngleDown className="text-secondary text-xl cursor-pointer" />
          </div>
          {isDropdownOpen && (
            <ul className="absolute top-16 right-3 w-48 bg-white shadow-lg rounded-lg">
              <li className="flex items-center gap-3 px-4 py-2 font-normal text-sm hover:bg-tertiary cursor-pointer">
                <FaUser className="text-secondaryDark" /> Profile
              </li>
              <li
                className="flex items-center gap-3 px-4 py-2 font-normal text-sm hover:bg-tertiary cursor-pointer"
                onClick={handleLogout}
              >
                <FiLogOut className="text-secondaryDark" /> Logout
              </li>
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
};

export default DashboardNavbar;