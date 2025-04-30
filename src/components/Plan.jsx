import React from 'react'
import { FaVideo } from "react-icons/fa";

const Plan = () => {
  return (
	<section className='font-inter bg-black py-10 '>
	  <div className='text-center mb-16 md:mb-24 max-w-[85%] mx-auto'>
	  	<h4 className='font-bold text-primary text-sm md:text-3xl'>Pricing Plan</h4>
		<h1 className='font-bold text-white text-3xl md:text-[50px] leading-10 my-3'>What It Costs</h1>
		<p className='text-white font-normal text-sm md:text-xl'>
			Earlystart uses a yearly pricing plan that gives your child <br className='hidden md:flex'/> access to all lessons for a full year. 
			There is a free plan too!
		</p>
	  </div>

	  <div className='font-inter grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[85%] mx-auto pb-10'>
		<div className='bg-secondaryDark p-8 text-white rounded-3xl md:w-[520px] md:h-[430px]'>
			<div className='flex justify-between'>
				<h4 className='font-bold text-3xl md:text-[50px]'>Basic</h4> 
				<div className='bg-tertiary text-secondaryDark flex justify-center items-center w-[50px] h-[50px] md:w-[100px] md:h-[100px] rounded-[50px]'>
					< FaVideo  className='md:text-4xl'/>
				</div>
			</div>

			<ul className='list-disc md:w-[90%] md:px-12 font-normal text-sm md:text-2xl mb-12'>
				<li>Access to all videos and lessons</li>
				<li>Access to competitions and community forums</li>
				<li>Support on week days</li>
			</ul>
			
			<div className='bg-primary text-black rounded-full md:scale-90 font-bold text-base md:text-3xl py-4 flex justify-center items-center text-center gap-2 cursor-pointer hover:scale-95 transition-transform shadow-lg'>
				N10,000.00 <span className='font-normal text-xs md:text-xl'>per year</span>
			</div>
		</div>

		<div className='bg-primary p-8 rounded-3xl md:w-[520px] md:h-[430px]'>
			<div className='flex justify-between'>
				<h4 className='font-bold text-3xl md:text-[50px]'>Pro</h4> 
				<div className='bg-tertiary text-black flex justify-center items-center w-[50px] h-[50px] md:w-[100px] md:h-[100px] rounded-[50px]'> 
					<FaVideo className='md:text-4xl' />
				</div>
			</div>
			
			<ul className='list-disc md:px-12 font-normal text-sm md:text-2xl mb-5'>
				<li>Access to all videos and lessons</li>
				<li>Access to competitions and community forums</li>
				<li>Access to weekly live classes</li>
				<li>24/7 support</li>
			</ul>
			
			<div className='bg-tertiary text-black rounded-full md:scale-90 font-bold text-base md:text-3xl py-4 flex justify-center items-center text-center gap-2 cursor-pointer hover:scale-95 transition-transform shadow-lg'>
				N25,000.00 <span className='font-normal text-xs md:text-xl'>per year</span>
			</div>
		</div>

		
	  </div>
	</section>
  )
}

export default Plan
