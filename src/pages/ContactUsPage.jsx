
import React, { useState } from 'react';
import logo from '../assets/images/earlystartlogo.png';


const COLORS = {
  navy: "#343652",
  blue: "#91ADC6",
  yellow: "#FBD22F",
};


const ContactCard = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <div className="text-slate-600 leading-7">
      {children}
    </div>
  </div>
);

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Replace this with your actual contact API endpoint.
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Unable to send your message. Please try again.');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError(
        err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <a href="/" className="flex items-center space-x-4">
          <img src={logo} alt="Earlystart Logo" className="w-auto" />
        </a>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Page Heading */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1E1E1E] mb-6">
            Contact Us
          </h1>

          <p className="text-lg text-slate-600 leading-8 max-w-3xl">
            We'd love to hear from you! Whether you have a question about
            our courses, need technical assistance, want to partner with
            us, or simply want to learn more about Earlystart, our team
            is ready to help.
          </p>
        </div>

        {/* Contact Information */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Get in Touch
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <ContactCard icon="✉️" title="Email Support">
              <p>
                Send us an email and we'll get back to you as soon
                as possible.
              </p>
              <a
                href="mailto:support@earlystart.app"
                className="font-semibold hover:underline break-all"
                style={{
                    color: COLORS.yellow,
                }}
              >
                theeearlystartapp@gmail.com
              </a>
            </ContactCard>

            <ContactCard icon="🌐" title="Our Website">
              <p>
                Visit our website to explore our learning platform
                and discover more.
              </p>
              <a
                href="https://www.earlystart.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                style={{
                    color: COLORS.yellow,
                }}
              >
                www.earlystart.app
              </a>
            </ContactCard>

            <ContactCard icon="📍" title="Our Location">
              <p>
                Earlystart is operated by Ashpot.
              </p>
              <p className="font-semibold text-slate-800">
                United Kingdom & Nigeria.
              </p>
            </ContactCard>

            <ContactCard icon="💬" title="General Enquiries">
              <p>
                Have questions about subscriptions, courses, live
                classes, or partnerships? We're happy to assist.
              </p>
              <a
                href="mailto:theearlystartapp@gmail.com?subject=Earlystart%20Enquiry"
                className="font-semibold hover:underline"
                style={{
                    color: COLORS.yellow,
                }}
              >
                Send an Enquiry
              </a>
            </ContactCard>

          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-10">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Send Us a Message
            </h2>

            <p className="text-slate-600 leading-7">
              Fill out the form below and tell us how we can help.
              Please provide as much relevant information as possible
              so we can assist you better.
            </p>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
              Your message has been sent successfully. Thank you for
              contacting Earlystart!
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
              >
                <option value="">Select a subject</option>
                <option value="General Enquiry">General Enquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Courses and Learning">Courses and Learning</option>
                <option value="Subscription and Payment">Subscription and Payment</option>
                <option value="Live Classes">Live Classes</option>
                <option value="Partnership">Partnership</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="How can we help you?"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
              backgroundColor: COLORS.yellow,
              color: COLORS.navy,
            }}
            >
              {loading ? 'Sending Message...' : 'Send Message'}
            </button>

          </form>
        </section>

        {/* Additional Support */}
        <section className="mt-14 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            We're Here to Help!
          </h2>

          <p className="text-slate-600 leading-8 max-w-2xl mx-auto">
            At Earlystart, we believe every child deserves the
            opportunity to explore, create, and build the skills
            needed for the future. If you need help navigating
            the platform or getting your child started, don't
            hesitate to reach out.
          </p>

          <a
            href="mailto:theearlystartapp@gmail.com"
            className="inline-block mt-6 font-semibold hover:underline"
            style={{
                    color: COLORS.yellow,
                }}
          >
            Contact Earlystart Support →
          </a>
        </section>

      </main>
    </div>
  );
};

export default ContactUsPage;
