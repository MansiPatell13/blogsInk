import React from 'react'
import { Shield, Eye, Lock, Database, Users, Globe } from 'lucide-react'

const PrivacyPage = () => {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Personal information (name, email, profile information)',
        'Content you create and publish',
        'Usage data and analytics',
        'Device and browser information',
        'Cookies and similar technologies'
      ]
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      content: [
        'Provide and maintain our services',
        'Personalize your experience',
        'Communicate with you about our services',
        'Improve our platform and develop new features',
        'Ensure security and prevent fraud',
        'Comply with legal obligations'
      ]
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: [
        'We do not sell your personal information',
        'We may share information with service providers',
        'Information may be shared for legal compliance',
        'Aggregated, anonymized data may be shared for analytics',
        'Your content is shared according to your privacy settings'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'Industry-standard encryption for data transmission',
        'Secure servers and infrastructure',
        'Regular security audits and updates',
        'Limited access to personal information',
        'Secure authentication and authorization'
      ]
    },
    {
      icon: Globe,
      title: 'Your Rights and Choices',
      content: [
        'Access and update your personal information',
        'Delete your account and associated data',
        'Control your privacy settings',
        'Opt-out of certain communications',
        'Request data portability',
        'Contact us with privacy concerns'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              At BlogsInk, we believe in transparency and protecting your privacy. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="mb-4">
              By using BlogsInk, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies and practices, please do not use our service.
            </p>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting 
              the new privacy policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Cookies Policy */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Cookies and Tracking Technologies</h3>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our platform. 
              These technologies help us:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze how our platform is used</li>
              <li>Provide personalized content and recommendations</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
            <p>
              You can control cookie settings through your browser preferences. However, disabling certain 
              cookies may affect the functionality of our platform.
            </p>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Retention</h3>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              We retain your personal information for as long as necessary to provide our services and 
              fulfill the purposes outlined in this privacy policy. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Account information while your account is active</li>
              <li>Published content as long as you choose to keep it public</li>
              <li>Usage data for analytics and service improvement</li>
              <li>Legal and regulatory compliance requirements</li>
            </ul>
            <p>
              When you delete your account, we will remove or anonymize your personal information, 
              though some information may be retained for legal or legitimate business purposes.
            </p>
          </div>
        </div>

        {/* International Transfers */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">International Data Transfers</h3>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure that such transfers comply with applicable data protection laws and implement 
              appropriate safeguards to protect your information.
            </p>
            <p>
              By using our platform, you consent to the transfer of your information to countries 
              outside your residence, including the United States and other countries where our 
              service providers are located.
            </p>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Children's Privacy</h3>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Our platform is not intended for children under the age of 13. We do not knowingly 
              collect personal information from children under 13.
            </p>
            <p>
              If you are a parent or guardian and believe that your child has provided us with 
              personal information, please contact us immediately. We will take steps to remove 
              such information from our records.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> privacy@blogsink.com</p>
              <p><strong>Address:</strong> BlogsInk Privacy Team, 123 Blog Street, Content City, CC 12345</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
            <p className="mt-4">
              We will respond to your inquiry within 30 days and work to resolve any privacy concerns 
              you may have.
            </p>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8 text-center">
          <p className="text-gray-600">
            This privacy policy is effective as of {new Date().toLocaleDateString()}. 
            We may update this policy from time to time. Please check back periodically for updates.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
