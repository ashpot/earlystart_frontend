import React from 'react';
import { features } from '../../data/InfoList';

const Features = () => {
  return (
	<section className='max-w-[85%] mx-auto py-10 font-inter'>
	  <div className='text-center mb-10'>
		<h4 className='font-bold text-secondary text-sm md:text-3xl'>Core Features/Benefits</h4>
		<h1 className='font-bold text-3xl md:text-[50px] leading-10 my-3'>What Your Child Gets</h1>
		<p className='font-normal text-sm md:text-xl'>
			Earlystart is a smart learning companion for young children <br className='hidden md:block'></br> — 
			combining play and education to build confidence
		</p>
	  </div>

	  <div className='grid grid-cols-1 md:grid-cols-3 gap-6 font-inter text-center'>
		{features.map((feature, index) => (
			<div key={index} className='bg-white rounded-3xl pt-5 pb-10 px-11 flex flex-col items-center cursor-pointer shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-amber-50 transition-shadow duration-300'>
				<div className='text-primary text-6xl text-center'>{feature.icon}</div>
				<h2 className='font-bold text-2xl my-3'>{feature.title}</h2>
				<p className='font-normal text-sm'>{feature.description}</p>
			</div>
			
		))}
	  </div>
	</section>
  )
}

export default Features
