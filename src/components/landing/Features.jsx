import React from 'react';
import { features } from '../../data/InfoList';

const Features = () => {
  return (
	<section className='max-w-[85%] mx-auto mb-20'>
	  <div className='text-center mb-10 md:mb-20 space-y-4 text-secondaryDark'>
		<h4 className='font-bold text-sm md:text-xl'>CORE BENEFITS</h4>
		<h1 className='font-bold text-[22px] md:text-[39px]'>What Your Child Gets</h1>
		<p className='font-medium text-sm md:text-xl text-[#333333] w-[85%] mx-auto'>
			Earlystart is a smart learning companion for young children — 
			combining play and education to build confidence
		</p>
	  </div>

	  <div className='grid grid-cols-1 md:grid-cols-3 gap-12 font-inter text-center'>
		{features.map((feature, index) => (
			<div key={index} className='bg-secondaryLight rounded-2xl pt-5 pb-10 px-6 flex flex-col items-center cursor-pointer shadow-md'>
				<div className='text-[#617F99] text-7xl md:text-9xl text-center mb-9 mt-5'>{feature.icon}</div>
				<h2 className='font-bold text-lg md:text-xl text-[#333333] w-[80%] mx-auto mb-7'>{feature.title}</h2>
				<p className='font-normal text-base md:text-lg text-[#333333] bottom-0'>{feature.description}</p>
			</div>
			
		))}
	  </div>
	</section>
  )
}

export default Features
