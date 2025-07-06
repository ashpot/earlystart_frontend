import React from 'react'
import eslogo from '../../assets/images/eslogo.png'
import { BiLogoPlayStore } from "react-icons/bi";
import { GrAppleAppStore } from "react-icons/gr";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
	<section className='bg-secondaryDark2 p-9 text-white'>
		<div className='flex flex-col md:flex-row justify-center items-center -mb-36 md:-mb-24 mt-9 w-[100%] mx-auto'>
			
			<div className='flex flex-col md:flex-row items-center space-y-4 md:space-x-2 bg-secondaryDark md:bg-opacity-100 p-5 rounded-2xl '>
				<h3 className='font-medium text-sm md:text-xl md:mr-6 '>Start creating your memories...</h3>
				<a
				href=""
				className="flex items-center gap-2 border-3 rounded-full py-3 px-5 " target="_blank" rel="noopener noreferrer"
					style={{
						backgroundColor: '#0BA7F508',
						boxShadow: `
						inset 0px 2px 5px 0px #FFFFFF40,
						inset 0px -3px 4px 0px #35353540,
						inset 0px 2px 4px 0px #1A80F426
						`,
					}}>
					<BiLogoPlayStore size={24} aria-hidden="true" />
					<span className="font-semibold text-sm md:text-base">Download on Play Store</span> 
				</a>
				<a href=""
				className="flex items-center gap-2 border-3 rounded-full py-3 px-5 " target="_blank" rel="noopener noreferrer"
					style={{
						backgroundColor: '#0BA7F508',
						boxShadow: `
						inset 0px 2px 5px 0px #FFFFFF40,
						inset 0px -3px 4px 0px #35353540,
						inset 0px 2px 4px 0px #1A80F426
						`,
					}}>
				  < GrAppleAppStore size={24} aria-hidden="true" />
				  <span className='font-semibold text-sm md:text-base'>Download on App Store</span> 
				</a>
			</div>
		</div>
		<div className='w-full mx-auto my-12 border border-white/20 rounded-2xl pt-20 md:py-12 md:px-14'>
			
			<div className='flex flex-col md:flex-row justify-between items-start my-5 mb-10 pt-6'>
				<div className='w-[95%] md:w-[32%] mx-auto md:mx-0 text-center md:text-left'>
					<div className='flex justify-center md:block'>
						<img src={eslogo} alt="early start logo" className='mb-5 w-auto' />
					</div>
					<p className='font-normal text-sm md:text-base'>
						Earlystart App makes coding and technology fun, easy, and exciting for kids. 
						Empowering the next generation of creators, inventors, and innovators — one lesson at a time.
					</p>
					<div className='md:flex justify-between my-8 hidden '>
						<a href=''><FaFacebook size={30}/></a>
						<a href=''><FaInstagram size={30}/></a>
						<a href=''><FaXTwitter size={30}/></a>
						<a href=''><FaLinkedin size={30}/></a>
						<a href=''><FaYoutube size={30}/></a>
					</div>
				</div>
				

				<div className='flex justify-between gap-20 md:gap-10 mt-5 p-5 md:mt-0 md:p-0'>
					<div className='flex flex-col md:space-y-3  '>
						<h4 className='font-semibold text-secondary text-xs md:text-[13px] mb-5'>NAVIGATION</h4>
						<ul className='md:space-y-8 space-y-2 font-normal text-xs md:text-[16.8px]'>
							<li><a href="">Home</a> </li>
							<li><a href="">About Us</a> </li>
							<li><a href="">Core Benefits</a> </li>
							<li><a href="">Pricing</a> </li>
							<li><a href="">Our Partners</a> </li>
						</ul>
					</div>

					<div className='flex flex-col md:space-y-3 '>
						<h4 className='font-semibold text-secondary text-xs md:text-[13px] mb-5'>HELP</h4>
						<ul className='md:space-y-8 space-y-2 font-normal text-xs md:text-[16.8px]'>
							<li><a href=''>Contact Us</a></li>
							<li><a href="">FAQs</a> </li>
							<li><a href="">Terms & Conditions</a> </li>
							<li><a href="">Privacy Policy</a> </li>
						</ul>
					</div>
				</div>

				<div className='flex flex-col space-y-3 md:w-[32%] w-[85%] mx-auto md:mx-0'>
					<h4 className='font-semibold text-secondary text-xs md:text-[13px] md:mb-5 text-center md:text-left'>SUBSCRIBE TO OUR NEWSLETTER</h4>
					<div className='flex flex-col gap-4'>
						<input type="email" placeholder="Enter your email" 
							className="border rounded-xl p-2 w-full placeholder:text-xs md:placeholder:text-base text-secondary placeholder:font-normal placeholder:text-secondary placeholder:text-left"
						/>
						<button className="bg-primary p-2 w-[50%] mx-auto md:mx-0 rounded-xl font-semibold text-[13px] md:text-base text-secondaryDark">Subscribe</button>
					</div>
					<div className='flex justify-between pt-7 md:hidden '>
						<a href=''><FaFacebook size={30}/></a>
						<a href=''><FaInstagram size={30}/></a>
						<a href=''><FaXTwitter size={30}/></a>
						<a href=''><FaLinkedin size={30}/></a>
						<a href=''><FaYoutube size={30}/></a>
					</div>
				</div>

			</div>

			<div className=' text-white w-11/12 md:w-auto mx-auto text-center border-t border-white/20'>
				<p className='font-inter font-normal text-xs md:text-sm pt-5 md:pt-10 pb-5 md:pb-0'>&copy; 2025 Ashpot All rights reversed</p>
			</div>

		</div>
	</section>
  )
}

export default Footer
