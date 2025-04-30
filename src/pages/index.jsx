import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Users from '../components/Users'
import Features from '../components/Features'
import Plan from '../components/Plan'
import Newsletter from '../components/Newsletter'
import Partners from '../components/Partners'
import Footer from '../components/Footer'

const index = () => {
  return (
	<div>
		<Navbar />
		<Hero />
		<About />
		<Users />
		<Features />
		<Plan />
		<Newsletter />
		<Partners />
		<Footer />
	</div>
  )
}

export default index
