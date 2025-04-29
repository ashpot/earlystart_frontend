import React from 'react';
import userImage from '../assets/images/userImage.png';

const Users = () => {
  return (
	<section className='bg-primary py-10'>
		<div className='flex flex-col md:flex-row justify-between items-center max-w-[85%] mx-auto'>
			<div className='w-2/5 relative'>
				<img src={userImage} alt="User Image" className='w-[] ' />
			</div>

			<div className='font-inter w-2/3 '>
				<div className='pl-10 pt-32'>
					<h4 className='font-bold text-white text-sm md:text-3xl'>Our Users</h4>
					<h1 className='font-bold text-3xl md:text-[50px] my-6'>Who It's Made For</h1>
					<p className='font-normal text-sm md:text-[28px] leading-9'>
						Earlystart is built for curious young minds and the grown-ups who care about their future.
						Whether your child is just discovering technology or already showing signs of tech-savviness, 
						Earlystart meets them right where they are — making learning to code and explore tech fun, engaging, 
						and age-appropriate.
					</p>
				</div>
				
				<div>
					<ul className='list-disc mt-5 font-normal text-xs md:text-xl grid grid-cols-2 gap-4'>
						<li>Kids aged 5–12 who want to play and learn at the same time</li>
						<li>Parents looking for safe, meaningful screen time alts</li>
						<li>Schools & Clubs offering tech-based enrichment programs</li>
						<li>Educators introducing students to digital skills in a hands-on way</li>
					</ul>
				</div>
			</div>
		</div>
	  
	</section>
  )
}

export default Users
