import React from 'react'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import About from '../components/landing/About'
import Users from '../components/landing/Users'
import Features from '../components/landing/Features'
import Plan from '../components/landing/Plan'
import Partners from '../components/landing/Partners'
import Footer from '../components/landing/Footer'

const index = () => {
  return (
	<div>
		<Navbar />
		<Hero />
		<About />
		<Features />
		<Users />
		<Plan />
		<Partners />
		<Footer />
	</div>
  )
}

export default index
