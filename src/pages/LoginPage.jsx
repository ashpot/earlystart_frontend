// import React, { useState } from 'react'
// import logo from '../assets/images/earlystartlogo.png'
// import { FaEyeSlash } from "react-icons/fa";
// import { IoEyeSharp } from "react-icons/io5";
// import axios from 'axios';
// import { API_BASE_URL } from '../config';

// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [password, setPassword] = useState('');

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
// 	  <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
// 		  <div className="flex items-center justify-center mb-6">
// 			  <img src={logo} />
//       </div> 

//       <div className="bg-white p-10 rounded-2xl shadow-lg w-[400px] h-[450px] mx-auto font-inter">

//         <h2 className="text-base font-bold text-center mb-2">Sign In</h2>
//         <p className="text-sm font-normal text-center mb-10">
//           Sign in to administration backend to <br /> manage students, courses, etc
//         </p>

//         <form className="space-y-8">
//           <div>
//             <label htmlFor="email" className="block text-base font-bold ">
//               Email address
//             </label>
//             <input type="email" id="email" placeholder=""
//               className="mt-1 w-full p-2 border border-black rounded-md focus:outline-none "
//             />
//           </div>

//           <div>
//               <div className="flex justify-between items-center">
//                   <label htmlFor="password" className="block text-base font-bold ">
//                     Password
//                   </label>
//                   <a href="#" className="text-sm font-normal text-primary ">
//                     Forgot password?
//                   </a>
//               </div>
//               <div className="relative">
//                   <input type={showPassword ? 'text' : 'password'} id="password" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)}
//                     className="mt-1 w-full p-2 border border-black rounded-md focus:outline-none "
//                   />
//                   <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
//                     {showPassword ? <IoEyeSharp /> : <FaEyeSlash /> }
//                   </button>
//               </div>
//           </div>

//           <div className='text-center'>
//             <button type="submit" className="w-40 py-2 px-4 font-bold text-base bg-secondary text-white rounded-full hover:bg-secondaryDark ">
//               Sign In
//             </button>
//           </div>
        
//         </form>
//       </div>

//     </div>
//  )}

// export default LoginPage


import React, { useState } from 'react';
import logo from '../assets/images/earlystartlogo.png';
import { FaEyeSlash } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //*
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/rest-auth/admin_signin/`, {
        username: formData.email, // API expects 'username', using email
        password: formData.password,
      });
      console.log('Login response:', response.data);
      setMessage('Signed in successfully!');
      localStorage.setItem('token', response.data.token); // Save token for authenticated requests
      setError('');
      // Optionally redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
      <div className="flex items-center justify-center mb-6">
        <img src={logo} alt="EarlyStart Logo" />
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-lg w-[400px] h-[450px] mx-auto font-inter">
        <h2 className="text-base font-bold text-center mb-2">Sign In</h2>
        <p className="text-sm font-normal text-center mb-10">
          Sign in to administration backend to <br /> manage students, courses, etc
        </p>

        <form className="space-y-8" >
          <div>
            <label htmlFor="email" className="block text-base font-bold">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=""
              className="mt-1 w-full p-2 border border-black rounded-md focus:outline-none"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-base font-bold">
                Password
              </label>
              <a href="#" className="text-sm font-normal text-primary">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=""
                className="mt-1 w-full p-2 border border-black rounded-md focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? <IoEyeSharp /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-40 py-2 px-4 font-bold text-base bg-secondary text-white rounded-full hover:bg-secondaryDark"
            >
              Sign In
            </button>
          </div>
        </form>

        {message && <p className="text-center text-green-500 mt-4">{message}</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;