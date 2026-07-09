
import React from 'react';
import logo from '../assets/images/earlystartlogo.png';


const Section = ({ title, children }) => (
  <section className="mb-10">
    <h1 className="text-2xl font-bold text-slate-900 mb-4">{title}</h1>
    <div className="space-y-4 text-slate-700 leading-8 text-[17px]">
      {children}
    </div>
  </section>
);

const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-8'>
        <a href='/' className='flex items-center space-x-4'>
          <img src={logo} alt="Logo Icon" className='w-auto' />
        </a>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        <h1 className="text-4xl md:text-6xl font-bold text-[#1E1E1E] mb-10">Privacy Policy</h1>
        <p className="text-lg font-medium mb-5">
          Last Updated: July 9, 2026
        </p>


      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">

        <Section title="1. Introduction">
          <p>
            Welcome to <strong>EarlyStart</strong>.
          </p>

          <p>
            EarlyStart ("EarlyStart", "we", "our", or "us") is an online
            learning platform designed to help children and teenagers develop
            digital skills through interactive courses, coding lessons, quizzes,
            projects, AI-assisted learning, and other educational resources.
          </p>

          <p>
            We are committed to protecting the privacy and security of every
            learner, parent, guardian, teacher, and visitor who uses our
            platform. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you use our website,
            mobile applications, and related services (collectively, the
            "Services").
          </p>

          <p>
            By using EarlyStart, you agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>
        </Section>

        <Section title="2. Who This Policy Applies To">
          <p>This Privacy Policy applies to:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Students and learners</li>
            <li>Parents and guardians</li>
            <li>Teachers and schools</li>
            <li>Visitors to our website</li>
            <li>Registered users of the EarlyStart mobile app</li>
            <li>Anyone interacting with our educational platform</li>
          </ul>

          <p>
            Because many of our users are children, we take children's privacy
            seriously and encourage parents and guardians to remain actively
            involved in their child's online learning experience.
          </p>
        </Section>

        <Section title="3. Information We Collect">

          <h3 className="text-xl font-semibold">A. Account Information</h3>

          <p>When you create an account, we may collect:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number (where applicable)</li>
            <li>Username</li>
            <li>Password (securely encrypted)</li>
            <li>Date of birth or age group</li>
            <li>Gender (optional)</li>
            <li>Country and city</li>
            <li>Profile photograph (optional)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8">
            B. Learning Information
          </h3>

          <p>We collect learning information such as:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Enrolled courses</li>
            <li>Completed lessons</li>
            <li>Quiz scores</li>
            <li>Coding exercise submissions</li>
            <li>Project submissions</li>
            <li>Certificates earned</li>
            <li>Progress percentages</li>
            <li>Learning streaks</li>
            <li>Time spent learning</li>
            <li>Achievements and badges</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8">
            C. AI ChatBuddy Conversations
          </h3>

          <p>
            EarlyStart includes an AI-powered educational assistant that helps
            learners understand programming, technology, and other educational
            topics.
          </p>

          <p>We may collect:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Questions asked</li>
            <li>Responses generated</li>
            <li>Conversation history</li>
            <li>Feedback provided on AI responses</li>
          </ul>

          <p>
            Please do not share sensitive personal or financial information in
            conversations with the AI assistant.
          </p>

          <h3 className="text-xl font-semibold mt-8">
            D. Technical Information
          </h3>

          <ul className="list-disc pl-6 space-y-2">
            <li>Device type</li>
            <li>Operating system</li>
            <li>Browser type</li>
            <li>App version</li>
            <li>IP address</li>
            <li>Language settings</li>
            <li>Device identifiers</li>
            <li>Log files</li>
            <li>Crash reports</li>
            <li>Usage analytics</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8">
            E. Payment Information
          </h3>

          <p>
            Payment processing is handled by trusted third-party payment
            providers. We receive transaction confirmations and subscription
            details, but we do not store complete debit or credit card
            information.
          </p>

        </Section>

        <Section title="4. How We Use Your Information">

          <ul className="list-disc pl-6 space-y-2">
            <li>Create and manage user accounts</li>
            <li>Deliver educational content</li>
            <li>Track learning progress</li>
            <li>Generate certificates</li>
            <li>Provide personalized recommendations</li>
            <li>Power AI learning assistance</li>
            <li>Improve course quality</li>
            <li>Conduct educational analytics</li>
            <li>Process subscriptions and payments</li>
            <li>Provide customer support</li>
            <li>Send important notifications</li>
            <li>Prevent fraud and abuse</li>
            <li>Maintain platform security</li>
            <li>Comply with legal obligations</li>
          </ul>

        </Section>

        <Section title="5. Children's Privacy">

          <p>
            Protecting children's privacy is one of our highest priorities.
          </p>

          <p>
            Where required by law, we obtain appropriate parental or guardian
            consent before collecting personal information from children.
          </p>

          <p>Parents and guardians may:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Review their child's information</li>
            <li>Request corrections</li>
            <li>Request deletion of their child's account</li>
            <li>Contact us regarding privacy concerns</li>
          </ul>

        </Section>

        <Section title="6. Cookies and Similar Technologies">

          <p>
            We use cookies and similar technologies to:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Keep users signed in</li>
            <li>Remember user preferences</li>
            <li>Improve website functionality</li>
            <li>Measure performance</li>
            <li>Analyze usage trends</li>
            <li>Enhance platform security</li>
          </ul>

        </Section>

        <Section title="7. How We Share Information">

          <p>
            We do not sell personal information.
          </p>

          <p>
            We only share information when necessary with trusted service
            providers, to comply with legal obligations, or during business
            transfers such as mergers or acquisitions.
          </p>

        </Section>

        <Section title="8. Data Security">

          <ul className="list-disc pl-6 space-y-2">
            <li>HTTPS/SSL Encryption</li>
            <li>Secure authentication</li>
            <li>Password encryption</li>
            <li>Role-based access control</li>
            <li>Secure cloud infrastructure</li>
            <li>Continuous monitoring</li>
            <li>Regular security updates</li>
          </ul>

          <p>
            While we strive to protect your information, no online system can be
            guaranteed to be 100% secure.
          </p>

        </Section>

        <Section title="9. Data Retention">

          <p>
            We retain personal information only for as long as necessary to
            provide our services, maintain educational records, meet legal
            obligations, resolve disputes, and enforce our agreements.
          </p>

        </Section>

        <Section title="10. Your Rights">

          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Update your profile</li>
            <li>Request account deletion</li>
            <li>Request a copy of your data</li>
            <li>Withdraw consent where applicable</li>
            <li>Object to certain processing activities</li>
          </ul>

        </Section>

        <Section title="11. Third-Party Services">

          <p>
            EarlyStart integrates with trusted third-party providers for cloud
            hosting, analytics, authentication, AI services, payment processing,
            and email delivery. These providers operate under their own privacy
            policies.
          </p>

        </Section>

        <Section title="12. Educational Content and User Contributions">

          <p>
            Learners may submit coding projects, assignments, quizzes,
            discussion responses, AI prompts, and feedback. These submissions
            help us provide educational services and improve learning
            experiences.
          </p>

        </Section>

        <Section title="13. International Data Transfers">

          <p>
            Depending on where our service providers operate, your information
            may be processed in countries outside your own. We implement
            appropriate safeguards to protect your data.
          </p>

        </Section>

        <Section title="14. Email and Notifications">

          <p>
            We may send notifications regarding:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Account verification</li>
            <li>Password resets</li>
            <li>Course enrollments</li>
            <li>Learning reminders</li>
            <li>Certificates</li>
            <li>Subscription updates</li>
            <li>Platform announcements</li>
            <li>Security alerts</li>
          </ul>

        </Section>

        <Section title="15. Account Deletion">

          <p>
            Users may request deletion of their EarlyStart account. Upon
            verification, personal information will be deleted or anonymized
            where appropriate, subject to legal, accounting, and educational
            record retention requirements.
          </p>

        </Section>

        <Section title="16. Changes to This Privacy Policy">

          <p>
            We may update this Privacy Policy from time to time. Significant
            changes will be communicated through the website, mobile app, or
            email where appropriate.
          </p>

        </Section>

        <Section title="17. Contact Us">

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">

            <p className="font-semibold text-lg">EarlyStart</p>

            <p>Email: privacy@earlystart.app</p>

            <p>Website: https://earlystart.app</p>

          </div>

        </Section>

        <Section title="18. Consent">

          <p>
            By accessing or using EarlyStart, you acknowledge that you have
            read, understood, and agreed to this Privacy Policy. Where required,
            parents or guardians provide consent on behalf of children using the
            platform.
          </p>

        </Section>

      </div>
      </main>
    </div>
    
  );
};


export default PrivacyPolicy;