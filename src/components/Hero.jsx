import React from 'react';
import appleicon from '../assets/images/appleicon.png';
import playstore from '../assets/images/playstore.png';
import heroImage from '../assets/images/heroimage.png';

const Hero = () => {
  return (
	<section className='flex flex-col md:flex-row '>
		<div className='w-[85%] pt-24 pl-20 absolute md:relative '>
			<div className='font-inter align-center pt-8 '>
				<h1 className='font-bold text-3xl md:text-5xl leading-10 mb-6'>Give Your Child a Smart Start <br /> — Learn, Play & Grow with <br /> Earlystart!</h1>
				<p className='font-normal text-sm md:text-2xl'>The all-in-one educational app designed to nurture young <br /> minds through fun, interactive lessons, games, and stories <br></br> — built just for kids, loved by parents.</p>
			</div>

			<div >
				<div className='flex space-x-4 mt-10 font-inter'>
					<a href="" 
					className='flex bg-primary font-semibold py-5 px-4 text-xs md:text-sm rounded-full items-center space-x-2 hover:bg-yellow-500 transition'>
						<img src={playstore} alt="PlayStore" 
						className='' />
						<span>Download on Playstore</span>
					</a>
					<a href=""
					className='flex font-semibold px-4 rounded-full items-center text-xs md:text-sm border border-solid border-primary hover:text-black hover:bg-yellow-500 transition'>
						<img src={appleicon} alt="Apple Store" className='-ml-3' />
						<span className='text-primary hover:text-black -ml-3'>Get It on Appstore</span>
					</a>
				</div>
				<p className="text-xs md:text-sm font-inter font-semibold mt-6">
					Over 50,000+ downloads. Safe. Fun. Educational.
				</p>
			</div>
			
		</div>

		<div className='ml-[510px]'>
			<img src={heroImage} alt="Hero Image" className="w-"/>
		</div>

	</section>
	
  )
}

export default Hero
