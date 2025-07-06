import React from 'react'
// import { aboutList } from '../../data/InfoList';
import aboutImage from '../../assets/images/aboutImage.png';
import aboutChild from '../../assets/images/aboutChild.png';
import aboutExplore from '../../assets/images/aboutExplore.png';
import aboutGet from '../../assets/images/aboutGet.png';
import aboutLearn from '../../assets/images/aboutLearn.png';


const About = () => {
  return (
	<section id='about' className='pt-14 pb-2'>
	  <div className='text-center mb-10 space-y-4 text-secondaryDark'>
		<h4 className='font-bold text-base md:text-xl'>ABOUT US</h4>
		<h1 className='font-bold text-2xl md:text-[39px]'>What is Earlystart?</h1>
	  </div>

	  <div className='flex flex-col md:flex-row justify-center ' >
		<div className='w-[100%]'>
			<img src={aboutImage} alt="About Image" className='' loading='lazy' />
		</div>
		<div className='w-[90%] mx-auto md:w-[65%] md:mx-0 md:mr-20 md:mt-20 font- text-center md:text-left text-[#333333]'>
			<p className=''>Earlystart is a smart learning companion for young children — combining play and education to build confidence, curiosity, and foundational skills that last a lifetime.</p>
			<p className='mt-6'>We created Earlystart to support parents, teachers, and caregivers in giving kids the best beginning possible — right from home, anytime.</p>
			<div className='grid md:grid-cols-2 mt-8'>
				<img src={aboutLearn} alt="About Image" className='cursor-pointer w-full rotate-3 z-10 transition-transform duration-300 hover:scale-110' loading='lazy' />
				<img src={aboutGet} alt="About Image" className='cursor-pointer w-full z-0 md:z-10 -mt-14 md:-mt-0 transition-transform duration-300 hover:scale-110' loading='lazy' />
				<img src={aboutExplore} alt="About Image" className='cursor-pointer -rotate-2 -mt-12 md:-mt-9 z-10 md:z-0 w-full transition-transform duration-300 hover:scale-110' loading='lazy' />
				<img src={aboutChild} alt="About Image" className='cursor-pointer rotate-6 -mt-12 md:-mt-8 z-0 w-full transition-transform duration-300 hover:scale-110' loading='lazy' />
			</div>
		</div>
		
	  </div>

	</section>
  )
}

export default About
