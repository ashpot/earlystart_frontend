import React from 'react'
import eStartLogo from '../assets/images/faxicon.png'
import appleicon from '../assets/images/appleicon.png';
import playstore from '../assets/images/playstore.png';

const Footer = () => {
  return (
	<section className=''>
		<div className='max-w-[85%] mx-auto font-inter my-12'>
			<div>
				<img src={eStartLogo} alt="early start logo" className='' />
			</div>
			
			<div className='flex flex-col md:flex-row gap-10 justify-between my-5 '>
				<p className='md:w-[40%] font-normal text-base md:text-lg'>
					Earlystart App makes coding and technology fun, easy, and exciting for kids. 
					Empowering the next generation of creators, inventors, and innovators — one lesson at a time.
				</p>

				<div className='flex flex-col space-y-3'>
					<h4 className='font-bold text-base md:text-xl'>Quick links</h4>
					<ul className='space-y-3 font-normal text-xs md:text-sm'>
						<li><a href="">Cookies Policy</a> </li>
						<li><a href="">Competitions</a> </li>
						<li><a href="">Competitions</a> </li>
						<li><a href="">Referral Opportunities</a> </li>
					</ul>
				</div>

				<div className='flex flex-col space-y-3'>
					<h4 className='font-bold text-base md:text-xl'>Legal</h4>
					<ul className='space-y-3 font-normal text-xs md:text-sm'>
						<li><a href=''>Privacy Policy</a></li>
						<li><a href="">Terms of Service</a> </li>
						<li><a href="">Cookies Policy</a> </li>
					</ul>
				</div>

				<div className='flex flex-col space-y-3'>
					<h4 className='font-bold text-base md:text-xl'>Contact</h4>
					<ul className='space-y-3 font-normal text-xs md:text-sm'>
						<li>Phone: +2348127870201</li>
						<li>Need help or have a question?</li>
						<li>Mail: support@ashpotmicrosystems.com</li>
					</ul>
				</div>

			</div>

			<div className="flex space-x-4 mt-10 font-inter justify-end mb-10">
				<a href="" 
				className='flex bg-primary font-semibold py-2 md:py-5 px-4 text-xs md:text-sm rounded-3xl md:rounded-full items-center space-x-2 hover:bg-yellow-500 transition'>
					<img src={playstore} alt="PlayStore" 
					className='w-5 h-5 md:w-6 md:h-6' />
					<span>Download on Playstore</span>
				</a>
				<a href=""
				className='flex font-semibold px-4 text-xs md:text-sm rounded-3xl md:rounded-full items-center border border-solid border-primary text-primary hover:text-black hover:bg-yellow-500 transition'>
					<img src={appleicon} alt="Apple Store" className='-ml-3 mr-3 w-9 h-9 md:w-12 md:h-12' />
					<span className=' -ml-4'>Get It on Appstore</span>
				</a>
			</div>

			

		</div>
	  
	  <div className='bg-black text-white w-full py-4 text-center md:text-right '>
		<p className='w-[85%] mx-auto font-inter font-normal text-xs md:text-sm '>Copyright &copy; Ashpot, 2025. All rights reversed</p>
	  </div>
	</section>
  )
}

export default Footer
