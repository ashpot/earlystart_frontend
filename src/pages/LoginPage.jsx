
import React, { useState } from 'react';
import logo from '../assets/images/eslogo.png';
import { FaEyeSlash } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import axios from 'axios';
import { BASE_URL } from '../config';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setMessage('');
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/rest-auth/admin/auth/signin/`, {
        username: formData.username,
        password: formData.password,
      });

      console.log(response.data);
      setMessage('Signed in successfully!');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.user);
      
      // Delay redirect slightly to show success message
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      setMessage('');
    } finally {
      setIsLoading(false); // End loading
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

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-base font-bold">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder=""
              className="mt-1 w-full p-2 border border-black rounded-md focus:outline-none"
              required
              disabled={isLoading} // Disable input during loading
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
                disabled={isLoading} // Disable input during loading
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                disabled={isLoading} // Disable toggle during loading
              >
                {showPassword ? <IoEyeSharp /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
            
              type="submit"
              className={`w-40 py-2 px-4 font-bold text-base rounded-full flex items-center justify-center
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondaryDark2 hover:bg-secondaryDark'} text-white`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.672 5.689 4 7.291l2-3.464z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
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