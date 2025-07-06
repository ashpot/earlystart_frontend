import React from 'react'
import { FaVideo } from "react-icons/fa";
import planBasic from '../../assets/images/planBasic.png';
import planPro from '../../assets/images/planPro.png';

const Plan = () => {
  return (
	<section className='py-10 md:-mt-40'>
	  <div className='text-center mb-10 md:mb-20 space-y-4 text-secondaryDark'>
	  	<h4 className='font-bold text-sm md:text-xl'>PRICING PLAN</h4>
		<h1 className='font-bold text-[22px] md:text-[39px]'>What It Costs</h1>
		<p className='font-medium text-base md:text-xl text-[#333333] w-[90%] md:w-[70%] mx-auto'>
			Earlystart uses a yearly pricing plan that gives your child access to all lessons for a full year. 
			There is a free plan too!
		</p>
	  </div>

	  <div className='flex flex-col md:flex-row justify-center gap-16 max-w-[75%] md:max-w-[85%] mx-auto pb-10'>
		<div className='bg-[#EAF4FB] py-10 rounded-3xl text-center'>
			<div className='mb-6'>
				<div className='flex justify-center mb-3'>
					<img src={planBasic} alt="Basic Plan" className='items-center ' loading='lazy' />
				</div>
				<h4 className='font-extrabold text-[19.96px] md:text-[25px] text-secondaryDark'>Basic</h4> 
			</div>

			<ul className='list-disc text-left w-[60%] mx-auto font-medium text-[#333333] text-base md:text-xl'>
				<li>Access to all videos and lessons</li>
				<li>Access to competitions and community forums</li>
				<li>Support on week days</li>
			</ul>
			
			{/* <h5 className='text-secondaryDark font-extrabold text-[32px] flex justify-center items-center pt-[70px]'>
				N10,000 <span className='font-semibold text-xs md:text-xl ml-2'>per year</span>
			</h5> */}
			<button className='bg-[#617F99] border-3 rounded-full py-3 px-10 my-4 text-white text-xl font-bold mt-[70px]' 
				style={{
						backgroundColor: '#617F99',
						boxShadow: `
						inset 0px 3px 4px 0px #FFFFFF40,
						inset 0px -4px 4px 0px #3535352E
						`,
					}}
				>N10,000 <span className='font-semibold text-xs md:text-xl ml-2'>per year</span></button>
		</div>

		<div className='bg-[#F7F1E5] py-10 rounded-3xl text-center'>
			<div className='mb-6'>
				<div className='flex justify-center mb-3'>
					<img src={planPro} alt="Pro Plan" className='items-center ' loading='lazy' />
				</div>
				<h4 className='font-extrabold text-[19.96px] md:text-[25px] text-[#E69F06]'>Pro</h4> 
			</div>
			
			<ul className='list-disc text-left w-[60%] mx-auto font-medium text-[#333333] text-base md:text-xl'>
				<li>Access to all videos and lessons</li>
				<li>Access to competitions and community forums</li>
				<li>Access to weekly live classes</li>
				<li>24/7 support</li>
			</ul>
			
			{/* <h5 className='text-[#E69F06] font-extrabold text-[32px] flex justify-center items-center pt-4'>
				N25,000 <span className='font-semibold text-xs md:text-xl ml-2'>per year</span>
			</h5> */}
			<button className='bg-primary border-3 rounded-full py-3 px-10 my-4 text-[#333652] text-xl font-bold' 
				style={{
						backgroundColor: '#E69F06',
						boxShadow: `
						inset 0px 3px 4px 0px #FFFFFF40,
						inset 0px -4px 4px 0px #3535352E
						`,
				}}
			>N25,000 <span className='font-semibold text-xs md:text-xl ml-2'>per year</span></button>
		</div>

		
	  </div>
	</section>
  )
}

export default Plan
