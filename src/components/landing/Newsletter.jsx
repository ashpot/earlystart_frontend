import React from 'react'

const Newsletter = () => {
  return (
	<section className='font-inter py-14 w-[85%] mx-auto'>
	  <div className='text-center mb-10'>
		<h2 className='font-bold text-[20px] md:text-[40px]'>Newsletter Updates</h2>
		<p className='font-normal text-[14px] md:text-base'>Enter your email address below to subscribe to our tasty newsletter.</p>
	  </div>

	  <div className='flex flex-col md:flex-row justify-center gap-6 mt-4'>
		<input type="email" placeholder="Enter email..." 
			className="border rounded-3xl px-4 py-3 w-full md:w-2/5 font-normal text-base md:text-xl"
		/>
		<button className="bg-primary rounded-3xl px-12 py-3 md:ml-2 font-bold text-base hover:scale-110 transition-transform shadow-lg">Subscribe</button>
	  </div>

	  {/* <div className='h-40 bg-secondary my-20'> */}

	  {/* </div> */}
	</section>
  )
}

export default Newsletter
