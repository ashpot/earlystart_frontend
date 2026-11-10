
import React, { useEffect, useState } from 'react';
import logo from '../assets/images/earlystartlogo.png';

const API_URL = '/api/faqs/';

const COLORS = {
  navy: "#343652",
  blue: "#91ADC6",
  yellow: "#FBD22F",
};


// Four default FAQs
const defaultFaqs = [
  {
    id: 'default-1',
    question: 'What is Earlystart?',
    answer:
      'Earlystart is an interactive learning platform designed to help children and young learners develop essential technology and digital skills. Through interactive courses, live classes, quizzes, competitions, coding activities, and educational games, children can explore technology and prepare for the future.',
  },
  {
    id: 'default-2',
    question: 'Who can use Earlystart?',
    answer:
      'Earlystart is designed primarily for children and young learners. Parents and guardians can create and manage their children’s accounts, monitor their learning progress, and access relevant learning activities and features.',
  },
  {
    id: 'default-3',
    question: 'How do I get started on Earlystart?',
    answer:
      'Getting started is easy! Parents can create an account on Earlystart, add their children, and set up their learning profiles. Once the account is ready, children can log in and begin exploring available courses, activities, quizzes, and other learning resources.',
  },
  {
    id: 'default-4',
    question: 'Is Earlystart free?',
    answer:
      'Earlystart offers access to selected free learning resources, as well as premium learning experiences through Earlystart PRO. Premium features may include additional courses, live classes, and other exclusive learning opportunities. Visit the platform to explore the available plans.',
  },
];

// Reusable FAQ accordion item
const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-200">

    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center justify-between gap-4 text-left px-5 py-5 sm:px-6 hover:bg-slate-50 transition-colors"
    >
      <span className="text-base sm:text-lg font-semibold text-slate-900">
        {faq.question}
      </span>

      <span
        className={`flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl transition-transform duration-200 ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        +
      </span>
    </button>

    {isOpen && (
      <div className="px-5 sm:px-6 pb-6">
        <div className="border-t border-slate-100 pt-4 text-slate-600 text-[16px] leading-8">
          {faq.answer}
        </div>
      </div>
    )}

  </div>
);

const FAQPage = () => {
  const [faqs, setFaqs] = useState(defaultFaqs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Unable to load additional FAQs.');
        }

        const data = await response.json();

        // Support both regular arrays and Django REST Framework pagination.
        const backendFaqs = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : [];

        // Append backend FAQs to the four default FAQs.
        const formattedFaqs = backendFaqs.map((faq, index) => ({
          id: faq.id || `backend-${index}`,
          question: faq.question,
          answer: faq.answer,
        }));

        setFaqs([...defaultFaqs, ...formattedFaqs]);

      } catch (err) {
        console.error('FAQ loading error:', err);
        setError('Some additional questions could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleToggle = (id) => {
    setOpenFaq((current) => current === id ? null : id);
  };

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <a href="/" className="flex items-center space-x-4">
          <img
            src={logo}
            alt="Earlystart Logo"
            className="w-auto"
          />
        </a>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Page Heading */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1E1E1E] mb-6">
            Frequently Asked Questions
          </h1>

          <p className="text-lg text-slate-600 leading-8 max-w-3xl">
            Have questions about Earlystart? We've put together
            answers to some of the most common questions to help
            you understand our platform and make the most of your
            child's learning experience.
          </p>
        </div>

        {/* FAQ List */}
        <section className="mb-14">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              General Questions
            </h2>

            <span className="text-sm text-slate-500">
              {faqs.length} Questions
            </span>
          </div>

          <div className="space-y-4">

            {faqs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openFaq === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}

          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              Loading more questions...
            </div>
          )}

          {/* Error State */}
          {error && (
            <p className="text-sm text-amber-600 mt-5">
              {error} You can still browse the questions available above.
            </p>
          )}

        </section>

        {/* Still Have Questions */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12 text-center">

          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mx-auto mb-5">
            💬
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Still Have Questions?
          </h2>

          <p className="text-slate-600 leading-8 max-w-2xl mx-auto">
            Couldn't find the answer you were looking for?
            Our support team is always happy to help. Get in
            touch with us and we'll be glad to assist you.
          </p>

          <a
            href="/contact-us"
            className="inline-block mt-7 px-8 py-3.5 rounded-xl text-white font-semibold hover:bg-blue-700 transition duration-200"
            style={{
              backgroundColor: COLORS.yellow,
              color: COLORS.navy,
            }}
          >
            Contact Us
          </a>

          <p className="text-sm text-slate-500 mt-5">
            Or email us directly at{' '}
            <a
              href="mailto:support@earlystart.app"
              className="text-blue-600 font-medium hover:underline"
              style={{
              color: COLORS.navy,
            }}
            >
              support@earlystart.app
            </a>
          </p>

        </section>

      </main>
    </div>
  );
};

export default FAQPage;
