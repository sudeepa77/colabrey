import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-black">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold font-display mb-4 text-blue-600 dark:text-blue-400">Terms & Conditions</h1>
          <p className="text-gray-600 dark:text-gray-400">Last updated: October 13, 2025</p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-8 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-bold font-display mb-4">Website Usage & Information Policy</h2>
            <p className="leading-relaxed mb-4">
              We are Colabrey ("Company," "we," "us," "our"). We operate the website{' '}
              <a href="http://www.colabrey.in" className="text-blue-600 dark:text-blue-400 hover:underline">
                Colabrey.in
              </a>{' '}
              (the "Site"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
            </p>
            <p className="leading-relaxed mb-4">
              You can contact us by email at{' '}
              <a href="mailto:support@colabrey.in" className="text-blue-600 dark:text-blue-400 hover:underline">
                support@colabrey.in
              </a>
            </p>
            <p className="leading-relaxed">
              We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms. It is your responsibility to periodically review these Legal Terms to stay informed of updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              This website (www.colabrey.in) is operated by Colabrey. By accessing or using Colabrey, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">2. User Eligibility</h2>
            <p className="leading-relaxed">
              Colabrey is a student networking platform exclusively for college students with verified .edu or .ac.in email addresses. Users must be 18 years or older, based on their college enrolment status.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">3. User Content and Ownership</h2>
            <p className="leading-relaxed mb-3">
              You retain ownership of all content, including profile information, chat messages, and community posts that you upload on Colabrey.
            </p>
            <p className="leading-relaxed mb-3">
              You grant Colabrey a license to use this content solely within the platform to operate and improve our services.
            </p>
            <p className="leading-relaxed">
              Your information will never be shared with third-party advertisers or marketers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">4. User Conduct and Community Rules</h2>
            <p className="leading-relaxed mb-3">
              Users must abide by strict community standards ensuring respect, decency, and safety for all members. Any form of harassment, bullying, hate speech, threats, or illegal behaviour is strictly prohibited.
            </p>
            <p className="leading-relaxed mb-3">
              Colabrey enforces a <strong>zero-tolerance policy</strong> on violations. Accounts found engaging in such activities will face <strong>immediate suspension or permanent banning</strong> without warning.
            </p>
            <p className="leading-relaxed mb-3">
              Posting explicit, obscene, or 18+ content in any community groups is forbidden and will result in <strong>instant removal of content and account termination.</strong>
            </p>
            <p className="leading-relaxed">
              Colabrey reserves the full right to take legal action when violations infringe upon applicable laws or endanger community members. Repeat offenders or severe breaches will be escalated as per government regulations, including reporting to law enforcement if necessary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">5. Community Groups and Moderation</h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>Community groups are interest-based and accessible only to users whose profiles match the group's interests.</li>
              <li>Unlike private chats, public groups and communities are not end-to-end encrypted and are monitored by Colabrey for compliance.</li>
              <li>Sharing of explicit or illegal content in groups will result in immediate action, including account suspension and notification via email.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">6. Messaging and Chat</h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>Private messages are protected by end-to-end encryption, ensuring privacy.</li>
              <li>Colabrey cannot access private chats unless reported for policy violation.</li>
              <li>Users can delete chat history at any time; deleted messages are removed from servers within a designated timeframe.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">7. Account Suspension and Termination</h2>
            <p className="leading-relaxed mb-3">Accounts may be suspended or terminated if a user:</p>
            <ul className="space-y-2 list-disc list-inside mb-4">
              <li>Violates any terms in this agreement, including community rules.</li>
              <li>Is reported for abusive, illegal, or harmful behaviour.</li>
              <li>Repeatedly disregards warnings or corrective steps provided by Colabrey.</li>
              <li>Engages in posting or sharing prohibited content within community groups.</li>
            </ul>
            <p className="leading-relaxed mb-3">
              Suspension actions may be temporary or permanent depending on the severity and frequency of violations. Affected users will receive timely notification via email.
            </p>
            <p className="leading-relaxed">
              Users may appeal suspension decisions by contacting support; however, final decisions rest with Colabrey.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">8. Data Security and Liability</h2>
            <p className="leading-relaxed mb-3">
              Colabrey commits to maintaining a secure platform, employing industry-standard encryption and security practices.
            </p>
            <p className="leading-relaxed">
              We accept responsibility for data loss due to technical errors, server failures, or platform outage. Colabrey is not responsible for indirect damages related to use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">9. Payment and Fees</h2>
            <p className="leading-relaxed">
              Colabrey does not currently charge any fees for the use of its services. All features are free of charge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">10. Third-Party Services</h2>
            <p className="leading-relaxed mb-3">
              Login is via Google using verified college emails only. No other third-party integrations or external website links are present on Colabrey.
            </p>
            <p className="leading-relaxed">
              Colabrey disclaims responsibility for any third-party services accessed via your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">11. Notifications and Updates</h2>
            <p className="leading-relaxed">
              All important updates, including changes to these Terms, will be communicated via email and a notice in the site footer. Continued use after notification constitutes acceptance of updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">12. Governing Law and Dispute Resolution</h2>
            <p className="leading-relaxed mb-3">
              All legal matters related to Colabrey are governed by the laws of India.
            </p>
            <p className="leading-relaxed">
              Colabrey takes responsibility only for public content in community groups; it disclaims liability for private messaging content, which is end-to-end encrypted. Users can block and report improper private conversations to Colabrey for review.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">13. Contact</h2>
            <p className="leading-relaxed">
              For questions about these Terms or any issues you encounter, please contact us at:{' '}
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