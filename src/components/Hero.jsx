import React from 'react';
import appleicon from '../assets/images/appleicon.png';
import playstore from '../assets/images/playstore.png';
import heroImage from '../assets/images/heroimage.png';

const Hero = () => {
  return (
	<section id='home' className='flex flex-col md:flex-row '>
		<div className='w-[85%] mx-auto md:pt-24 md:pl-20 md:absolute '>
			<div className='font-inter align-center pt-8 '>
				<h1 className='font-bold text-[28px] md:text-5xl leading-10 mb-6'>Give Your Child a Smart Start <br className='hidden md:block' /> — Learn, Play & Grow with <br className='hidden md:block'/> Earlystart!</h1>
				<p className='font-normal text-sm md:text-2xl'>The all-in-one educational app designed to nurture young <br className='hidden md:block'/> minds through fun, interactive lessons, games, and stories <br className='hidden md:block'/> — built just for kids, loved by parents.</p>
			</div>

			<div >
				<div className='flex space-x-4 mt-10 font-inter'>
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
				<p className="text-[10px] md:text-sm font-inter font-semibold my-6">
					Over 50,000+ downloads. Safe. Fun. Educational.
				</p>
		
			</div>
			
		</div>

		<div className='md:ml-[510px]'>
			<img src={heroImage} alt="Hero Image" className=""/>
		</div>

	</section>
	
  )
}

export default Hero
