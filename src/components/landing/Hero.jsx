import React from 'react';
import { BiLogoPlayStore } from "react-icons/bi";
import { GrAppleAppStore } from "react-icons/gr";
import heroImage from '../../assets/images/heroImage.png';
import heroImagee from '../../assets/images/heroImagee.png';
import logo from '../../assets/images/earlystartlogo.png';

const Hero = () => {
  return (
	<section id='home' className='relative'>
		
		<div className='relative w-full md:w-[95%] mx-auto bg-no-repeat rounded-b-[30px] md:rounded-3xl flex items-end justify-center' loading='lazy'
			style={{
				backgroundImage: `url(${heroImage})`,
				backgroundBlendMode: 'overlay',
				backgroundSize: 'cover',
				backgroundPosition: 'top',
				minHeight: '100vh',
				paddingTop: '20px',
				paddingBottom: '20px',
			}}>
			{/* <img src={heroImage} alt="Hero Image" className="w-[95%] mx-auto rounded-3xl hidden md:block " loading='lazy'/> */}
			{/* <img src={heroImagee} alt="Hero mobile Image" className="rounded-b-[30px] md:hidden block " loading='lazy'/> */}
			<div className='text-center relative leading-10 text-white space-y-6'>
				<img src={logo} alt="Hero mobile Image" className="md:hidden block absolute -mt-[95%] pl-6 " loading='lazy'/>
				<div className='space-y-4 w-[90%] mx-auto'>
					<h1 className='font-bold text-4xl md:text-6xl'>Give Your Child a <span className='text-primary italic'>Smart Start</span> </h1>
					<h5 className='font-bold text-base md:text-4xl'>Learn, Play & Grow with Earlystart!</h5>
					<p className='font-medium text-sm md:text-xl md:max-w-[70%] md:mx-auto'>The all-in-one educational app designed to nurture young minds through fun, interactive lessons, games, and stories; built just for kids, loved by parents.</p>
				</div>

				<div className='w-[90%] mx-auto'>
					<div className='flex flex-col md:flex-row justify-center gap-4 md:gap-7  md:w-[60%] md:mx-auto'>
						<a
						href=""
						className="flex items-center justify-center gap-2 border-3 rounded-full py-3 px-5 " target="_blank" rel="noopener noreferrer"
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
						className='flex items-center justify-center gap-2 border-3 rounded-full py-3 px-5' target="_blank" rel="noopener noreferrer"
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
					<p className="font-semibold text-xs md:text-[13px] md:pt-3 pt-7">
						Over 7,000 downloads  |  6K+ Satisfied Users  |  Over 100 Courses
					</p>
			
				</div>
				
			</div>
		</div>
		

		

	</section>
	
  )
}

export default Hero
