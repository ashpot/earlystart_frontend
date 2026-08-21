
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

const Terms = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-8'>
        <a href='/' className='flex items-center space-x-4'>
          <img src={logo} alt="Logo Icon" className='w-auto' />
        </a>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        <h1 className="text-4xl md:text-6xl font-bold text-[#1E1E1E] mb-10">Terms</h1>
        <p className="text-lg font-medium mb-5">
          Last Updated: August 21, 2026
        </p>


      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">

        <Section title="1. About Earlystart">
  <p>
    Earlystart provides educational content, courses, activities, coding
    resources, competitions, assessments, and other learning experiences
    intended primarily for children and young learners.
  </p>

  <p>
    Earlystart may be operated by <strong>Ashpot Microsystems Ltd</strong>{" "}
    ("Earlystart," "we," "us," or "our").
  </p>

  <p>
    We reserve the right to modify, suspend, or discontinue any part of the
    Platform at any time.
  </p>
</Section>

<Section title="2. Eligibility">
  <p>
    Earlystart is intended for children and young learners, with accounts
    potentially being created or managed by parents, guardians, schools, or
    other authorized adults.
  </p>

  <p>
    Where a user is under the applicable age of digital consent, a parent or
    legal guardian must create, authorize, or supervise the child's account.
  </p>

  <p>
    By creating an account for a child, the parent or guardian confirms that:
  </p>

  <ul>
    <li>They have the legal authority to provide the required consent.</li>
    <li>The information provided is accurate.</li>
    <li>They accept these Terms on behalf of the child.</li>
    <li>
      They are responsible for supervising the child's use of the Platform where
      appropriate.
    </li>
  </ul>
</Section>

<Section title="3. Account Registration">
  <p>Some features of Earlystart require an account.</p>

  <p>
    When creating an account, you agree to provide accurate and current
    information and to keep your login credentials secure.
  </p>

  <p>You are responsible for activities carried out through your account.</p>

  <p>You must not:</p>

  <ul>
    <li>Create an account using false information.</li>
    <li>Share your password with unauthorized persons.</li>
    <li>Access another user's account.</li>
    <li>
      Create multiple accounts for the purpose of abusing promotions,
      competitions, or other Platform features.
    </li>
    <li>
      Allow a child to use an account belonging to another person without
      authorization.
    </li>
  </ul>

  <p>
    We reserve the right to suspend or terminate accounts that violate these
    Terms.
  </p>
</Section>

<Section title="4. Children's Use of Earlystart">
  <p>
    Earlystart is designed to provide a safe and educational environment for
    young learners.
  </p>

  <p>
    Parents and guardians are encouraged to supervise children's use of the
    Platform and to discuss appropriate online behavior with them.
  </p>

  <p>Children must not use Earlystart to:</p>

  <ul>
    <li>Harass, threaten, bully, or intimidate another person.</li>
    <li>Share inappropriate or offensive content.</li>
    <li>Attempt to access another person's account.</li>
    <li>Circumvent security measures.</li>
    <li>Upload malicious software or harmful files.</li>
    <li>Engage in fraudulent activities.</li>
    <li>Share sensitive personal information unnecessarily.</li>
  </ul>

  <p>
    We may remove content or restrict accounts where we reasonably believe that
    the Platform is being misused.
  </p>
</Section>

<Section title="5. Educational Content">
  <p>
    Earlystart provides educational materials for learning and development.
  </p>

  <p>
    Although we make reasonable efforts to ensure that our content is accurate,
    educational content may contain errors, omissions, or information that
    becomes outdated.
  </p>

  <p>Earlystart does not guarantee that:</p>

  <ul>
    <li>A learner will achieve a particular academic result.</li>
    <li>A learner will pass a particular examination.</li>
    <li>Completing a course will result in employment or admission.</li>
    <li>All educational materials will always be available.</li>
    <li>Content will be completely free from errors.</li>
  </ul>

  <p>
    Educational content should be used as a learning resource and not as a
    substitute for professional educational advice where such advice is
    required.
  </p>
</Section>

<Section title="6. Courses and Learning Materials">
  <p>
    Some courses and learning materials may be provided free of charge, while
    others may require payment.
  </p>

  <p>
    Where a course requires payment, the applicable price and payment terms will
    be displayed before payment is completed.
  </p>

  <p>
    Course access may be provided for a specified period or according to the
    subscription plan purchased.
  </p>

  <p>
    We reserve the right to modify course content, instructors, schedules,
    learning materials, or delivery methods where reasonably necessary to
    improve the educational experience.
  </p>
</Section>

<Section title="7. Payments and Subscriptions">
  <p>
    Where Earlystart offers paid services, payments may be processed through
    third-party payment providers.
  </p>

  <p>By making a payment, you confirm that:</p>

  <ul>
    <li>You are authorized to use the payment method.</li>
    <li>The information supplied during payment is accurate.</li>
    <li>
      You agree to the applicable price displayed at the time of purchase.
    </li>
  </ul>

  <p>
    Subscription plans may be offered on a monthly, yearly, or other basis.
  </p>

  <p>
    The duration of a subscription will be determined by the plan purchased.
    Access may expire at the end of the applicable subscription period unless
    renewed.
  </p>

  <p>
    Except where required by applicable law or expressly stated otherwise,
    payments may be non-refundable once access to digital educational content
    has been provided.
  </p>
</Section>

<Section title="8. Refunds">
  <p>
    Refund requests will be considered in accordance with our applicable refund
    policy.
  </p>

  <p>
    Where a refund is approved, the refund may be processed through the original
    payment method or another appropriate payment channel.
  </p>

  <p>We may decline refunds where:</p>

  <ul>
    <li>The user has substantially consumed the purchased digital content.</li>
    <li>The refund request is outside the applicable refund period.</li>
    <li>The account has violated these Terms.</li>
    <li>There is evidence of fraudulent activity.</li>
  </ul>

  <p>
    Nothing in this section limits any mandatory consumer rights available under
    applicable law.
  </p>
</Section>

<Section title="9. Competitions and Challenges">
  <p>
    Earlystart may organize coding competitions, quizzes, challenges, camps, or
    other educational activities.
  </p>

  <p>
    Additional rules may apply to individual competitions or challenges. Where
    applicable, those rules will form part of these Terms.
  </p>

  <p>We reserve the right to disqualify participants who:</p>

  <ul>
    <li>Cheat or manipulate results.</li>
    <li>Use unauthorized assistance.</li>
    <li>Provide false information.</li>
    <li>Attempt to interfere with the competition system.</li>
    <li>Violate the rules of the competition.</li>
  </ul>

  <p>
    Prizes are subject to the specific rules and eligibility requirements of
    each competition.
  </p>
</Section>

<Section title="10. Intellectual Property">
  <p>
    All content available through Earlystart, including but not limited to:
  </p>

  <ul>
    <li>Text</li>
    <li>Videos</li>
    <li>Images</li>
    <li>Graphics</li>
    <li>Logos</li>
    <li>Course materials</li>
    <li>Software</li>
    <li>Source code</li>
    <li>Assessments</li>
    <li>Quizzes</li>
    <li>Animations</li>
    <li>User interface designs</li>
    <li>Educational resources</li>
  </ul>

  <p>
    is owned by or licensed to Earlystart and is protected by applicable
    intellectual property laws.
  </p>

  <p>Unless we expressly authorize it, you may not:</p>

  <ul>
    <li>Copy or reproduce our materials for commercial purposes.</li>
    <li>Sell or redistribute our courses.</li>
    <li>Upload our materials to another platform.</li>
    <li>Modify and redistribute our educational content.</li>
    <li>Remove copyright or ownership notices.</li>
    <li>Use Earlystart's branding without permission.</li>
  </ul>

  <p>
    Your access to Earlystart does not transfer ownership of any intellectual
    property to you.
  </p>
</Section>

<Section title="11. User-Generated Content">
  <p>
    Certain features may allow users to submit content, including projects,
    assignments, comments, images, code, answers, or other materials.
  </p>

  <p>
    You retain ownership of your original content, subject to any rights
    necessary for us to operate the Platform.
  </p>

  <p>
    By submitting content, you grant Earlystart a non-exclusive, worldwide,
    royalty-free license to host, store, reproduce, display, and process that
    content for purposes of operating, improving, and promoting the Platform,
    subject to our Privacy Policy and applicable law.
  </p>

  <p>
    Parents or guardians should ensure that children do not submit unnecessary
    personal or sensitive information.
  </p>
</Section>

<Section title="12. Prohibited Activities">
  <p>Users must not use Earlystart to:</p>

  <ol>
    <li>Break any applicable law or regulation.</li>
    <li>Attempt to gain unauthorized access to our systems.</li>
    <li>Introduce malware, viruses, or other harmful code.</li>
    <li>Interfere with the operation of the Platform.</li>
    <li>
      Reverse engineer or exploit the Platform except where permitted by law.
    </li>
    <li>
      Scrape or systematically collect information from the Platform without
      authorization.
    </li>
    <li>Impersonate another person.</li>
    <li>Engage in fraud or deceptive activity.</li>
    <li>Abuse competitions, rewards, or promotional offers.</li>
    <li>
      Upload content that is unlawful, abusive, threatening, defamatory,
      obscene, or otherwise inappropriate.
    </li>
  </ol>
</Section>

<Section title="13. Privacy and Personal Information">
  <p>Your privacy is important to us.</p>

  <p>
    Our collection, use, storage, and protection of personal information are
    governed by our Privacy Policy.
  </p>

  <p>
    Because Earlystart may be used by children, parents and guardians should
    review the Privacy Policy carefully before creating or authorizing a child's
    account.
  </p>

  <p>
    We encourage users not to share unnecessary personal information publicly
    through the Platform.
  </p>
</Section>

<Section title="14. Third-Party Services">
  <p>
    Earlystart may integrate with or rely on third-party services, including
    payment processors, cloud hosting providers, authentication providers,
    analytics services, video hosting services, and other technology providers.
  </p>

  <p>
    Your use of third-party services may be subject to those providers' own
    terms and policies.
  </p>

  <p>
    We are not responsible for the availability, security, or operation of
    third-party services outside our reasonable control.
  </p>
</Section>

<Section title="15. Availability of the Platform">
  <p>
    We aim to keep Earlystart available and functioning properly, but we do not
    guarantee uninterrupted availability.
  </p>

  <p>The Platform may occasionally be unavailable because of:</p>

  <ul>
    <li>Maintenance.</li>
    <li>Software updates.</li>
    <li>Security issues.</li>
    <li>Network failures.</li>
    <li>Server problems.</li>
    <li>Third-party service interruptions.</li>
    <li>Circumstances beyond our reasonable control.</li>
  </ul>

  <p>
    We may temporarily suspend access when necessary to maintain or protect the
    Platform.
  </p>
</Section>

<Section title="16. Account Suspension and Termination">
  <p>
    We may suspend or terminate an account where we reasonably believe that the
    user:
  </p>

  <ul>
    <li>Has violated these Terms.</li>
    <li>Has engaged in fraudulent activity.</li>
    <li>Has compromised the security of the Platform.</li>
    <li>Has abused another user.</li>
    <li>Has used the Platform for unlawful purposes.</li>
  </ul>

  <p>
    A parent or guardian may also request the closure of a child's account.
  </p>

  <p>
    Upon termination, access to certain content and services may immediately
    cease.
  </p>
</Section>

<Section title="17. Disclaimer">
  <p>
    Earlystart is provided on an "as available" and "as is" basis to the extent
    permitted by applicable law.
  </p>

  <p>We do not guarantee that the Platform will always be:</p>

  <ul>
    <li>Available.</li>
    <li>Error-free.</li>
    <li>Secure.</li>
    <li>Complete.</li>
    <li>Accurate.</li>
    <li>Suitable for every learner.</li>
  </ul>

  <p>
    We make reasonable efforts to provide a high-quality educational experience
    but cannot guarantee particular educational, academic, professional, or
    financial outcomes.
  </p>
</Section>

<Section title="18. Limitation of Liability">
  <p>
    To the maximum extent permitted by applicable law, Earlystart and its
    owners, employees, affiliates, partners, and service providers will not be
    liable for indirect, incidental, special, consequential, or unforeseeable
    losses arising from your use of the Platform.
  </p>

  <p>
    Nothing in these Terms excludes or limits liability that cannot legally be
    excluded or limited under applicable law.
  </p>
</Section>

<Section title="19. Changes to These Terms">
  <p>We may update these Terms from time to time.</p>

  <p>
    When we make significant changes, we may provide notice through the
    Platform, email, or another appropriate method.
  </p>

  <p>
    Your continued use of Earlystart after the updated Terms become effective
    constitutes acceptance of the revised Terms.
  </p>
</Section>

<Section title="20. Governing Law">
  <p>
    These Terms shall be governed by and interpreted in accordance with the
    applicable laws of the <strong>Federal Republic of Nigeria</strong>, unless
    applicable law requires otherwise.
  </p>

  <p>
    Any dispute arising from these Terms or your use of Earlystart shall be
    subject to the jurisdiction of the appropriate courts in Nigeria.
  </p>
</Section>

<Section title="21. Contact Us">
  <p>
    If you have questions, concerns, complaints, or requests regarding these
    Terms, please contact us:
  </p>

  <p>
    <strong>Earlystart / Ashpot </strong>
  </p>

  <p>
    <strong>Email:</strong> support@earlystart.app
  </p>

  <p>
    <strong>Website:</strong> www.earlystart.app
  </p>

  <p>
    <strong>Address:</strong> Aba, Abia State, Nigeria.
  </p>

  <p>
    <strong>Phone:</strong> +234 XXX XXX XXXX
  </p>
</Section>

<Section title="Acceptance">
  <p>
    By creating an account or using Earlystart, you confirm that you have read,
    understood, and agreed to these Terms and Conditions.
  </p>

  <p>
    <strong>Last Updated:</strong> [Insert Date]
  </p>
</Section>
      </div>
      </main>
    </div>
    
  );
};


export default PrivacyPolicy;