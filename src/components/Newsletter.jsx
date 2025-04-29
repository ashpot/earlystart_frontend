import React from 'react'

const Newsletter = () => {
  return (
	<section className='font-inter py-14'>
	  <div className='text-center mb-10'>
		<h2 className='font-bold text-[40px]'>Newsletter Updates</h2>
		<p className='font-normal text-base'>Enter your email address below to subscribe to our tasty newsletter.</p>
	  </div>

	  <div className='flex justify-center gap-6 mt-4'>
		<input type="email" placeholder="Enter email..." 
			className="border rounded-3xl px-4 py-3 w-2/5 font-normal text-xl"
		/>
		<button className="bg-primary rounded-3xl px-12 py-1 ml-2 font-bold text-base">Subscribe</button>
	  </div>
	</section>
  )
}

export default Newsletter
