import React from 'react'
import { FileText, Shield, Users, Globe, AlertTriangle } from 'lucide-react'

const TermsPage = () => {
  const sections = [
    {
      icon: Users,
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using BlogsInk, you accept and agree to be bound by the terms and provision of this agreement.',
        'If you do not agree to abide by the above, please do not use this service.',
        'We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting.',
        'Your continued use of the service after any such changes constitutes your acceptance of the new terms.'
      ]
    },
    {
      icon: Shield,
      title: 'User Accounts and Responsibilities',
      content: [
        'You must be at least 13 years old to create an account on BlogsInk.',
        'You are responsible for maintaining the confidentiality of your account and password.',
        'You agree to accept responsibility for all activities that occur under your account.',
        'You must not use the service for any illegal or unauthorized purpose.',
        'You are responsible for all content you post, publish, or share on the platform.'
      ]
    },
    {
      icon: FileText,
      title: 'Content Guidelines and Ownership',
      content: [
        'You retain ownership of the content you create and publish on BlogsInk.',
        'By posting content, you grant us a worldwide, non-exclusive license to use, reproduce, and distribute your content.',
        'Content must be original or properly attributed to the original author.',
        'We reserve the right to remove content that violates our community guidelines.',
        'You are responsible for ensuring your content does not infringe on the rights of others.'
      ]
    },
    {
      icon: Globe,
      title: 'Prohibited Activities',
      content: [
        'Posting content that is illegal, harmful, threatening, abusive, or defamatory.',
        'Impersonating another person or entity or providing false information.',
        'Attempting to gain unauthorized access to our systems or other users\' accounts.',
        'Using the service to distribute spam, malware, or other harmful content.',
        'Engaging in any activity that interferes with or disrupts the service.'
      ]
    }
  ]

  const additionalTerms = [
    {
      title: 'Intellectual Property Rights',
      content: 'The BlogsInk platform, including its original content, features, and functionality, is owned by BlogsInk and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.'
    },
    {
      title: 'Privacy and Data Protection',
      content: 'Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your personal information.'
    },
    {
      title: 'Limitation of Liability',
      content: 'In no event shall BlogsInk, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.'
    },
    {
      title: 'Termination',
      content: 'We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These terms govern your use of BlogsInk and the services we provide. 
              Please read them carefully before using our platform.
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
              Welcome to BlogsInk. These Terms of Service ("Terms") govern your access to and use of 
              the BlogsInk website and services (the "Service") operated by BlogsInk ("we," "us," or "our").
            </p>
            <p className="mb-4">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree 
              with any part of the terms, then you may not access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the Service. 
              By using our Service, you agree to these Terms and our Privacy Policy.
            </p>
          </div>
        </div>

        {/* Main Terms Sections */}
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

        {/* Additional Terms */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Terms</h2>
          <div className="space-y-6">
            {additionalTerms.map((term, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{term.title}</h3>
                <p className="text-gray-600">{term.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Conduct */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Conduct</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              As a user of BlogsInk, you agree to use the service in a manner consistent with any and 
              all applicable laws and regulations. You may not use the service to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Violate any applicable federal, state, local, or international law or regulation</li>
              <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>Submit false or misleading information</li>
              <li>Upload or transmit viruses or any other type of malicious code</li>
              <li>Collect or track the personal information of others</li>
              <li>Spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            </ul>
            <p>
              We reserve the right to terminate the account of any user who violates these terms of conduct.
            </p>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Disclaimers</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              The information on this website is provided on an "as is" basis. To the fullest extent 
              permitted by law, this Company:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Excludes all representations and warranties relating to this website and its contents</li>
              <li>Excludes all liability for damages arising out of or in connection with your use of this website</li>
              <li>Does not guarantee that the website will be available at all times or error-free</li>
              <li>Is not responsible for the content posted by users</li>
            </ul>
            <p>
              This includes, without limitation, direct loss, loss of business or profits, damage caused 
              to your computer, computer software, systems and programs and the data thereon.
            </p>
          </div>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              These Terms shall be interpreted and governed by the laws of the United States, without 
              regard to its conflict of law provisions.
            </p>
            <p className="mb-4">
              Our failure to enforce any right or provision of these Terms will not be considered a 
              waiver of those rights. If any provision of these Terms is held to be invalid or 
              unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
            <p>
              These Terms constitute the entire agreement between us regarding our Service, and 
              supersede and replace any prior agreements we might have between us regarding the Service.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to Terms</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days notice prior to any new 
              terms taking effect.
            </p>
            <p className="mb-4">
              What constitutes a material change will be determined at our sole discretion. By continuing 
              to access or use our Service after those revisions become effective, you agree to be bound 
              by the revised terms.
            </p>
            <p>
              If you do not agree to the new terms, please stop using the Service. We encourage you to 
              review these Terms periodically for any changes.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">Questions About These Terms?</h2>
          <div className="prose prose-lg max-w-none text-yellow-700">
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> legal@blogsink.com</p>
              <p><strong>Address:</strong> BlogsInk Legal Team, 123 Blog Street, Content City, CC 12345</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
            <p className="mt-4">
              We will respond to your inquiry within 5 business days and work to resolve any concerns 
              you may have about these terms.
            </p>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8 text-center">
          <p className="text-gray-600">
            These terms of service are effective as of {new Date().toLocaleDateString()}. 
            We may update these terms from time to time. Please check back periodically for updates.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
