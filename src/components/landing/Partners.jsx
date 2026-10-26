
import React from 'react'
import {
  FaGraduationCap,
  FaLaptopCode,
  FaChalkboardTeacher,
  FaRocket,
  FaArrowRight,
} from 'react-icons/fa'

const Partners = () => {
  const benefits = [
    {
      icon: <FaLaptopCode />,
      title: 'Future-Ready Skills',
      description:
        'Introduce students to coding, AI, and digital skills that prepare them for tomorrow’s opportunities.',
    },
    {
      icon: <FaGraduationCap />,
      title: 'Engaging Learning',
      description:
        'Make technology education fun and practical through interactive lessons, quizzes, projects, and challenges.',
    },
    {
      icon: <FaChalkboardTeacher />,
      title: 'Empower Educators',
      description:
        'Support your teachers with engaging digital learning resources that complement classroom instruction.',
    },
    {
      icon: <FaRocket />,
      title: 'Stand Out as a School',
      description:
        'Demonstrate your commitment to innovation and give parents another reason to choose your school.',
    },
  ]

  return (
    <section
      id="partnerships"
      className="px-4 py-16 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-secondaryLight px-4 py-2 text-sm font-semibold text-secondaryDark">
            EARLYSTART FOR SCHOOLS
          </span>

          <h2 className="text-[28px] font-bold leading-tight text-secondaryDark md:text-[42px]">
            Partner with Earlystart
          </h2>

          <p className="mt-4 text-lg font-semibold text-gray-700 md:text-xl">
            Empower Your Students. Future-Proof Your School.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            The future belongs to the innovators, creators, and problem-solvers
            of tomorrow. Earlystart partners with schools to make technology
            education accessible, engaging, and practical for every learner.
            Together, we can help students explore coding, Artificial
            Intelligence, and essential digital skills while preparing them
            for a world shaped by technology.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondaryLight text-2xl text-secondaryDark">
                {benefit.icon}
              </div>

              <h3 className="mb-3 text-lg font-bold text-secondaryDark">
                {benefit.title}
              </h3>

              <p className="text-sm leading-6 text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="rounded-3xl bg-secondaryLight px-6 py-10 text-center md:px-12 md:py-14">
          <h3 className="text-2xl font-bold text-secondaryDark md:text-3xl">
            Let’s Build the Next Generation of Innovators
          </h3>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-700">
            Whether you are a nursery, primary, or secondary school, Earlystart
            can help you take the next step in technology education. Partner
            with us to give your students the skills, confidence, and
            opportunities to thrive in a digital world.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondaryDark px-7 py-4 font-semibold text-white transition hover:opacity-90"
            >
              Become a Partner School
              <FaArrowRight />
            </a>

            
          </div>
        </div>
      </div>
    </section>
  )
}

export default Partners
