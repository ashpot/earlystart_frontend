import React from 'react'
import { aboutList } from '../data/InfoList';

const About = () => {
  return (
	<section className='font-inter max-w-[85%] mx-auto py-20 flex flex-col md:flex-row justify-between gap-10'>
	  <div className='w-[55%]'>
		<h4 className='font-bold text-primary text-sm md:text-3xl mt-5'>About Us</h4>
		<h1 className='font-bold text-3xl md:text-[50px] my-7'>What is Earlystart?</h1>
		<p className='font-normal text-sm md:text-[28px] leading-9'>Earlystart is a smart learning companion for young children — combining play and education to build confidence, curiosity, and foundational skills that last a lifetime.</p>
		<p className='font-normal text-sm md:text-[28px] leading-9'>We created Earlystart to support parents, teachers, and caregivers in giving kids the best beginning possible — right from home, anytime.</p>
	  </div>

	  <div className='grid grid-col-1 md:grid-cols-2 gap-6 font-inter w-2/5 ' >
		{aboutList.map((key, index) => (
		<div className='bg-secondary flex flex-col justify-center items-center rounded-3xl'>
			<div className='text-white text-7xl mt-10 mb-3'>{key.icon}</div>
			<p className='font-bold text-2xl text-primary w-[80%] mx-auto pb-2'>{key.title}</p>
		</div>
  		))}
	  </div>

	</section>
  )
}

export default About
