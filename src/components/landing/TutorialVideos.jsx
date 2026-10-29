
import React from 'react'
import {
  FaUserPlus,
  FaChild,
  FaClipboardCheck,
  FaUsersCog,
  FaPlay,
  FaYoutube,
} from 'react-icons/fa'

const tutorials = [
  {
    title: 'Create an Account',
    description:
      'New to Earlystart? Learn how to create your parent account and get started on your child’s learning journey.',
    icon: <FaUserPlus />,
    videoId: 'tD8DTuImaTw',
    duration: 'Getting Started',
    audience: 'Parents',
  },
  {
    title: 'How to Add a Child',
    description:
      'Follow this simple guide to create your child’s profile and give them access to exciting learning activities.',
    icon: <FaChild />,
    videoId: '8arodO_qthc',
    duration: 'Parent Guide',
    audience: 'Parents',
  },
  {
    title: 'How to Take a Quiz',
    description:
      'Discover how to find quizzes, answer questions, submit your answers, and test what you have learned.',
    icon: <FaClipboardCheck />,
    videoId: 'YOUR_TAKE_QUIZ_VIDEO_ID',
    duration: 'Learner Guide',
    audience: 'Learners',
  },
  {
    title: 'How to Manage Your Child',
    description:
      'Learn how to manage your child’s profile, update account details, and follow their learning progress.',
    icon: <FaUsersCog />,
    videoId: 'YOUR_MANAGE_CHILD_VIDEO_ID',
    duration: 'Parent Guide',
    audience: 'Parents',
  },
]

const TutorialVideos = () => {
  return (
    <section
      id="tutorial-videos"
      className="bg-white px-4 py-16 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-secondaryLight px-4 py-2 text-sm font-bold text-secondaryDark">
            YOUR GUIDE TO EARLYSTART
          </span>

          <h2 className="text-[28px] font-bold text-secondaryDark md:text-[39px]">
            Learn How to Use Earlystart
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#555555] md:text-lg">
            Getting started is easy! Explore our step-by-step video
            tutorials to learn how to use Earlystart features, manage
            your child’s learning, and make the most of every lesson.
          </p>
        </div>

        {/* Tutorial Cards */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {tutorials.map((tutorial) => {
            const hasVideo =
              tutorial.videoId.startsWith('YOUR_') === false

            const videoUrl = hasVideo
              ? `https://www.youtube.com/watch?v=${tutorial.videoId}`
              : null

            return (
              <article
                key={tutorial.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Video Thumbnail */}
                <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-secondaryLight">
                  {hasVideo ? (
                    <img
                      src={`https://img.youtube.com/vi/${tutorial.videoId}/hqdefault.jpg`}
                      alt={`${tutorial.title} tutorial thumbnail`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-secondaryDark">
                      <div className="text-5xl">
                        {tutorial.icon}
                      </div>
                      <span className="text-xs font-semibold">
                        VIDEO TUTORIAL
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition group-hover:bg-black/30">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-red-600 shadow-lg transition group-hover:scale-110">
                      <FaPlay className="ml-1" />
                    </div>
                  </div>

                  <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-secondaryDark">
                    {tutorial.audience}
                  </span>
                </div>

                {/* Tutorial Details */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-3 text-lg font-bold text-secondaryDark">
                    {tutorial.title}
                  </h3>

                  <p className="mb-6 flex-1 text-sm leading-6 text-gray-600">
                    {tutorial.description}
                  </p>

                  {hasVideo ? (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondaryDark px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      <FaYoutube className="text-lg" />
                      Watch Tutorial
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-400"
                    >
                      <FaYoutube className="text-lg" />
                      Coming Soon
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-gray-600 md:text-base">
            Need help getting started? Watch a tutorial and
            start exploring today.
          </p>

          <a
            href="https://www.youtube.com/@earlystartapp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-secondaryDark transition hover:opacity-70"
          >
            Visit our YouTube channel
            <FaYoutube className="text-xl text-red-600" />
          </a>
        </div>

      </div>
    </section>
  )
}

export default TutorialVideos
