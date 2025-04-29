import React from 'react'
import logo from '../assets/images/earlystartlogo.png'

const Navbar = () => {
  return (
	<div className='flex justify-between items-center bg-primary px-4' >
		<div className='py-2' >
			<a href=''>
				<img src={logo} alt="EarlyStart Logo" className='text-xs' />
			</a>	
		</div>
	  
		<div className='font-inter space-x-9 font-bold text-base'>
			<a href=''>Home</a>
			<a href="#" >About EarlyStart</a>
			<a href="">Patnerships</a>
			<a href="#" className='pr-5' >Contact Us</a>
		</div>

	</div>
  )
}

export default Navbar
