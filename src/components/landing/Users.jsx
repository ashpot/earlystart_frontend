import React from 'react';
import userImage from '../../assets/images/userImage.png';
import userImagee from '../../assets/images/userImagee.png';
import userBg from '../../assets/images/userBg.png';

const Users = () => {
  return (
	<section className=''>
		<div className='relative w-full md:w-[95%] mx-auto rounded-b-[30px] md:rounded-3xl flex items-center justify-center' loading='lazy'
				style={{
					backgroundImage: `url(${userBg})`,
					backgroundBlendMode: 'overlay',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					minHeight: '100vh',
					paddingTop: '20px',
					paddingBottom: '20px',
				}}>

			<div className=' '>
				<div className='text-center space-y-4 pb-5'>
					<h4 className='font-bold text-sm md:text-xl text-secondary'>OUR USERS</h4>
					<h1 className='font-bold text-[22px] md:text-[39px] text-secondary'>Who It's Made For</h1>
					<p className='font-medium text-base md:text-xl text-white w-[90%] mx-auto'>
						Earlystart is built for curious young minds and the grown-ups who care about their future. <br className='hidden md:block'/>
						Whether your child is just discovering technology or already showing signs of tech-savviness, 
						Earlystart meets them right where they are — making learning to code and explore tech fun, engaging, 
						and age-appropriate.
					</p>
				</div>
				
				<div className='grid grid-rows-1 md:grid-cols-2 w-[85%] md:w-3/5 mx-auto text-white gap-4 my-3'>
					<p className='border-3 rounded-full px-7 py-3 text-base font-semibold'
						style={{
							backgroundColor: '#0BA7F508',
							boxShadow: `
							inset 0px 3px 4px 0px #FFFFFF40,
							inset 0px -4px 4px 0px #3535352E
							`,
						}}
					>Kids aged 6–14 who want to play and learn at the same time.</p>
					<p className='border-3 rounded-full px-7 py-3 text-base font-semibold'
						style={{
							backgroundColor: '#0BA7F508',
							boxShadow: `
							inset 0px 3px 4px 0px #FFFFFF40,
							inset 0px -4px 4px 0px #3535352E
							`,
						}}
					>Parents looking for safe, meaningful screen time alternatives.</p>
					<p className='border-3 rounded-full px-7 py-3 text-base font-semibold'
						style={{
							backgroundColor: '#0BA7F508',
							boxShadow: `
							inset 0px 3px 4px 0px #FFFFFF40,
							inset 0px -4px 4px 0px #3535352E
							`,
						}}
					>Schools & Clubs offering tech-based enrichment programs.</p>
					<p className='border-3 rounded-full px-7 py-3 text-base font-semibold'
						style={{
							backgroundColor: '#0BA7F508',
							boxShadow: `
							inset 0px 3px 4px 0px #FFFFFF40,
							inset 0px -4px 4px 0px #3535352E
							`,
						}}
					>Educators introducing students to digital skills in a hands-on way.</p>
				</div>
			</div>
		</div>
		<div className='md:flex md:justify-end -mt-52 relative hidden'>
			<img src={userImage} alt="User Image" loading='lazy' className='w-1/5' />
		</div>
		<div className='flex justify-center relative md:hidden py-8'>
			<img src={userImagee} alt="User Image" loading='lazy' className='' />
		</div>
		
	</section>
  )
}

export default Users
