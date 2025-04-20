import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-2xl font-bold mb-2 text-center">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Last Updated: April 20, 2025
      </p>

      <div className="space-y-6 text-justify">
        <section>
          <h2 className="text-lg font-semibold mb-1">Introduction</h2>
          <p>
            This Privacy Policy outlines how the <strong>Department of Indigenous Affairs, Government of Arunachal Pradesh</strong> ("we," "our," or "us") handles user data for the <strong>Indigenous Folklore and Music</strong> application. We are committed to preserving user privacy and maintaining transparency in all aspects of our digital services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-1">Information We Collect</h2>
          <p>
            We do <strong>not collect any personal data</strong> or sensitive user information through the Indigenous Folklore and Music app. The application is built to operate without requiring personal identifiers such as names, phone numbers, email addresses, or device-specific data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-1">Use of Information</h2>
          <p>
            As no personal information is collected, we do <strong>not use, process, or analyze</strong> any user data for profiling, analytics, or marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-1">Third-Party Services</h2>
          <p>
            The app does <strong>not use or integrate with third-party services</strong> that gather, track, or analyze user information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-1">Data Security</h2>
          <p>
            While personal data is not collected, we implement <strong>robust security measures</strong> to protect the app from unauthorized access, misuse, or vulnerabilities. Our systems are secured using industry-standard protocols to ensure a safe and reliable experience for all users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-1">Children’s Privacy</h2>
          <p>
            The app does <strong>not knowingly collect information from children under the age of 13</strong>. Given the app’s data-free design, it fully complies with child data protection norms and digital safety regulations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-1">Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect regulatory changes or improvements. Updates will be available within the app and on our official website. Users are encouraged to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-1">Contact Us</h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy, please contact us at:
            <br />
            <strong>Email:</strong>{' '}
            <a
              href="mailto:privacy@indigenous.arunachal.gov.in"
              className="text-blue-600 underline"
            >
              privacy@indigenous.arunachal.gov.in
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;