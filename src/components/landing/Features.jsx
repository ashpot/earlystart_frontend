
import React from 'react'
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaGamepad,
  FaClipboardCheck,
  FaTrophy,
  FaCode,
  FaRobot,
} from 'react-icons/fa'

const features = [
  {
    icon: <FaBookOpen />,
    title: 'Age-Appropriate Courses',
    description:
      'Learning designed for your child’s age and skill level, with exciting courses in coding, AI, robotics, web development, and digital skills that grow with them.',
  },
  {
    icon: <FaChalkboardTeacher />,
    title: 'Weekend Live Classes',
    description:
      'Learn directly from instructors in interactive weekend classes. Ask questions, explore new concepts, and build practical technology skills in a supportive environment.',
  },
  {
    icon: <FaGamepad />,
    title: 'Educational Games',
    description:
      'Make learning an adventure! Enjoy fun, interactive games that develop logical thinking, creativity, problem-solving, and essential digital skills.',
  },
  /*
  {
    icon: <FaClipboardCheck />,
    title: 'Interactive Quizzes',
    description:
      'Test your knowledge, answer exciting questions, and get better with every attempt. Quizzes help learners reinforce lessons and track their understanding.',
  },
  */
  {
    icon: <FaTrophy />,
    title: 'Competitions & Challenges',
    description:
      'Put your skills to the test! Participate in exciting challenges, compete with other learners, celebrate achievements, and build confidence as you improve.',
  },
  {
    icon: <FaCode />,
    title: 'Coding Playground',
    description:
      'Turn ideas into reality! Experiment with code, practise programming, test your ideas, and create your own projects in a fun, hands-on coding environment.',
  },
  {
    icon: <FaRobot />,
    title: 'AI Code Buddy',
    description:
      'Meet your AI-powered learning companion! Get coding guidance, understand tricky concepts, explore solutions, and build confidence as you learn to code.',
  },
]

const Features = () => {
  return (
    <section
      id="features"
      className="mx-auto mb-20 max-w-[85%] py-10"
    >
      {/* Section Heading */}
      <div className="mb-10 space-y-4 text-center text-secondaryDark md:mb-16">
        <h4 className="text-sm font-bold md:text-xl">
          LEARN, PLAY & CREATE
        </h4>

        <h2 className="text-[22px] font-bold md:text-[39px]">
          Everything Your Child Needs to Thrive in Tech
        </h2>

        <p className="mx-auto w-full text-sm font-medium text-[#333333] md:w-[85%] md:text-xl">
          Earlystart makes technology education exciting and accessible.
          From age-appropriate courses and live classes to games, coding
          challenges, and AI-powered guidance, your child has everything
          needed to explore, practise, and develop future-ready skills.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-6 font-inter sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group flex h-full cursor-pointer flex-col items-center rounded-2xl border border-transparent bg-secondaryLight px-6 pb-8 pt-6 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-secondaryDark/10 hover:shadow-xl"
          >
            <div className="mb-6 mt-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-4xl text-[#617F99] shadow-sm transition-transform duration-300 group-hover:scale-110 md:h-24 md:w-24 md:text-5xl">
              {feature.icon}
            </div>

            <h3 className="mb-4 text-lg font-bold text-[#333333] md:text-xl">
              {feature.title}
            </h3>

            <p className="text-sm leading-7 text-[#333333] md:text-base">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
