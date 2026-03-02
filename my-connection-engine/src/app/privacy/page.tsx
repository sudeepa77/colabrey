import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-black">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold font-display mb-4 dark:text-blue-400">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400">Last updated: October 13, 2025</p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-8 text-gray-700 dark:text-gray-300">
          <section>
            <p className="leading-relaxed mb-4">
              We are Colabrey ("company", "us", "we", or "our") operates{' '}
              <a href="http://www.colabrey.in" className="text-blue-600 dark:text-blue-400 hover:underline">
                www.colabrey.in
              </a>{' '}
              (the "Site"). This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of the Site.
            </p>
            <p className="leading-relaxed">
              We use your Personal Information only for providing and improving the Site. By using the Site, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">Information Collection and Use</h2>
            <p className="leading-relaxed">
              Colabrey collects your college email, name, username, date of birth, department, hobbies, interests, sports preferences, profile picture, and basic device/cookie data for login, personalization, and verification, without gathering any non-college personal contacts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">How We Use Your Information</h2>
            <p className="leading-relaxed">
              We use your data to verify your college identity, show profiles and connect users with shared interests, enable chats and community groups based on matching interests, provide support and security, and send notifications like email alerts for new conversations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">Messaging, Content, and Chat Privacy</h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>All chat messages are end-to-end encrypted. Even Colabrey cannot access your messages unless abuse is reported.</li>
              <li>You can delete your chat history anytime, and deleted messages are removed from our servers within a set time.</li>
              <li>Community groups function like interest-based spaces; you can join only if you share the group's interests in your profile.</li>
              <li>All user profiles and group memberships are public within Colabrey, encouraging open collaboration.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">Data Storage and Security</h2>
            <p className="leading-relaxed">
              Your information is securely stored using industry-leading hosting with encryption and protective protocols, and cookies are used solely to improve site functionality without being shared or sold to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">Eligibility and Access</h2>
            <p className="leading-relaxed">
              Only students with valid college email addresses can register, and the platform is restricted to college students without requiring age verification beyond email confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">User Rights and Controls</h2>
            <p className="leading-relaxed mb-3">
              You can update your interests, hobbies, passions, and profile picture anytime, but your college email and registered name cannot be changed. You may delete your account and chat history, and all data will be erased from servers upon request.
            </p>
            <p className="leading-relaxed">
              For college email or name changes, contact support at{' '}
              <a href="mailto:support@colabrey.in" className="text-blue-600 dark:text-blue-400 hover:underline">
                support@colabrey.in
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">Reporting, Blocking, and Moderation</h2>
            <p className="leading-relaxed">
              You can report or block users who violate community guidelines, and if you are blocked or moderated, you will be notified via email, as Colabrey enforces a strict zero-tolerance policy against harassment, bullying, and hate speech.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">Use of Third Parties</h2>
            <p className="leading-relaxed">
              Colabrey does not share data with third parties except hosting providers for operational needs, and no data is sold or shared with advertisers or marketers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">Authentication and Security</h2>
            <p className="leading-relaxed">
              If you forget your password, you can reset it using an OTP sent to your registered college email, and while two-factor authentication is not implemented, your sessions are secured with industry-standard encryption.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">Mobile and App Usage</h2>
            <p className="leading-relaxed">
              Colabrey is a web-based platform without a mobile app, but mobile users can scan the QR code displayed on the website using their phone, which opens the mobile version directly in their browser instead of an app.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">Updates to Our Policy</h2>
            <p className="leading-relaxed">
              Any changes to this policy will be shared through email and a notice in the site footer, and we encourage you to review it regularly for updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">Contact</h2>
            <p className="leading-relaxed">
              For questions or concerns about your privacy, please contact us at:{' '}
              <a href="mailto:support@colabrey.in" className="text-blue-600 dark:text-blue-400 hover:underline">
                support@colabrey.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 