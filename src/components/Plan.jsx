import React from 'react'

const Plan = () => {
  return (
	<section className='font-inter bg-black py-10 '>
	  <div className='text-center mb-10'>
	  	<h4 className='font-bold text-primary text-sm md:text-3xl'>Pricing Plan</h4>
		<h1 className='font-bold text-white text-3xl md:text-[50px] leading-10 my-3'>What It Costs</h1>
		<p className='text-white font-normal text-sm md:text-xl'>
			Earlystart uses a yearly pricing plan that gives your child <br /> access to all lessons fro a full year. 
			There is a free plan too!
		</p>
	  </div>

	  <div className='font-inter grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[85%] mx-auto'>
		<div className='bg-secondaryDark p-8 text-white rounded-3xl'>
			<div className='flex justify-between mb-28'>
				<h4 className='font-bold text-[50px]'>Basic</h4> 
				<p className='bg-tertiary w-20 h-20 border rounded-full '></p>
			</div>
			
			<p className='font-bold text-3xl text-center mb-6'>N10,000.00</p>
			<div className='bg-primary w-3/4 mx-auto h-12 border rounded-3xl'></div>
		</div>

		<div className='bg-primary p-8 rounded-3xl'>
			<div className='flex justify-between mb-28'>
				<h4 className='font-bold text-[50px]'>Pro</h4> 
				<p className='bg-tertiary w-20 h-20 border rounded-full '></p>
			</div>
			
			<p className='font-bold text-3xl text-center mb-6'>N25,000.00</p>
			<div className='bg-tertiary w-3/4 mx-auto h-12 border rounded-3xl'></div>
		</div>

		
	  </div>
	</section>
  )
}

export default Plan
