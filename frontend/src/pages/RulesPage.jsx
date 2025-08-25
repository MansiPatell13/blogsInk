import React from 'react'
import { BookOpen, AlertTriangle, Shield, Users, Heart, Flag } from 'lucide-react'

const RulesPage = () => {
  const rules = [
    {
      icon: Shield,
      title: 'Content Guidelines',
      color: 'yellow',
      items: [
        'All content must be original or properly attributed',
        'No plagiarism, copyright infringement, or intellectual property violations',
        'Content must be accurate and factually correct',
        'No misleading or deceptive information',
        'Respect intellectual property rights of others'
      ]
    },
    {
      icon: Users,
      title: 'Community Standards',
      color: 'green',
      items: [
        'Treat all users with respect and dignity',
        'No harassment, bullying, or hate speech',
        'No discrimination based on race, gender, religion, or other characteristics',
        'Encourage constructive dialogue and meaningful discussions',
        'Report inappropriate behavior to moderators'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Prohibited Content',
      color: 'red',
      items: [
        'Explicit sexual content or pornography',
        'Violence, gore, or graphic content',
        'Illegal activities or criminal instructions',
        'Personal information of others without consent',
        'Spam, scams, or fraudulent content'
      ]
    },
    {
      icon: Heart,
      title: 'Positive Engagement',
      color: 'purple',
      items: [
        'Share valuable insights and knowledge',
        'Support and encourage fellow writers',
        'Provide constructive feedback when commenting',
        'Celebrate diverse perspectives and experiences',
        'Contribute to a welcoming community environment'
      ]
    }
  ]

  const enforcement = [
    {
      level: 'Warning',
      description: 'First-time minor violations',
      action: 'Content review and educational guidance'
    },
    {
      level: 'Temporary Suspension',
      description: 'Repeated violations or moderate infractions',
      action: 'Account suspended for 7-30 days'
    },
    {
      level: 'Permanent Ban',
      description: 'Severe or repeated serious violations',
      action: 'Account permanently removed from platform'
    }
  ]

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200'
    }
    return colorMap[color] || 'bg-gray-100 text-gray-600 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Community Rules & Guidelines
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To maintain a positive and productive environment for all users, we've established these 
              community rules and guidelines. Please read them carefully and ensure your content and 
              behavior align with our standards.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why We Have Rules</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              BlogsInk is a community of writers, readers, and thinkers who share knowledge, 
              experiences, and perspectives. Our rules exist to ensure that everyone can participate 
              in a safe, respectful, and enriching environment.
            </p>
            <p className="mb-4">
              These guidelines help us maintain the quality of our platform, protect our users, 
              and foster meaningful discussions. By following these rules, you contribute to making 
              BlogsInk a better place for everyone.
            </p>
            <p>
              Remember: these rules apply to all content you create, comments you make, and 
              interactions you have on our platform. Violations may result in content removal, 
              account suspension, or permanent banning.
            </p>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {rules.map((rule, index) => {
            const Icon = rule.icon
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getColorClasses(rule.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{rule.title}</h3>
                </div>
                <ul className="space-y-2">
                  {rule.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getColorClasses(rule.color).replace('bg-', 'bg-').replace('text-', 'bg-')}`}></div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Enforcement */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enforcement & Consequences</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Action Taken</th>
                </tr>
              </thead>
              <tbody>
                {enforcement.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.level === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                        item.level === 'Temporary Suspension' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{item.description}</td>
                    <td className="py-3 px-4 text-gray-600">{item.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reporting */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reporting Violations</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              If you encounter content or behavior that violates our community rules, please report it 
              immediately. Your reports help us maintain a safe and welcoming environment for everyone.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">How to Report:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Click the flag icon (🚩) on any content that violates our rules</li>
                <li>Select the appropriate violation category</li>
                <li>Provide specific details about the violation</li>
                <li>Submit your report for review</li>
              </ol>
            </div>
            <p className="mt-4">
              All reports are reviewed by our moderation team. We take each report seriously and 
              investigate thoroughly before taking any action. False reports may result in consequences 
              for the reporting user.
            </p>
          </div>
        </div>

        {/* Appeals */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Appeals Process</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              If you believe that action taken against your account was made in error, you have the 
              right to appeal the decision. Our appeals process is designed to be fair and transparent.
            </p>
            <div className="bg-yellow-50 rounded-lg p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Appeal Requirements:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Submit your appeal within 30 days of the action</li>
                <li>Provide clear reasoning for why the action should be reversed</li>
                <li>Include any relevant evidence or context</li>
                <li>Be respectful and constructive in your communication</li>
              </ul>
            </div>
            <p className="mt-4">
              Appeals are reviewed by senior moderators who were not involved in the original decision. 
              We aim to respond to all appeals within 7 business days.
            </p>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rule Updates</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Our community rules may be updated from time to time to address new challenges, 
              improve clarity, or better serve our community's needs.
            </p>
            <p className="mb-4">
              When we make significant changes to our rules, we will:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Notify all users via email and in-app notifications</li>
              <li>Provide a summary of key changes</li>
              <li>Give users time to review and understand new requirements</li>
              <li>Update this page with the latest version</li>
            </ul>
            <p>
              Continued use of our platform after rule updates constitutes acceptance of the new terms. 
              We encourage you to regularly review our rules to ensure compliance.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Rules?</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              If you have questions about our community rules or need clarification on any specific 
              guideline, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
                Contact Support
              </button>
              <button className="border border-yellow-600 text-yellow-600 px-6 py-3 rounded-lg font-medium hover:bg-yellow-50 transition-colors">
                Read FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8 text-center">
          <p className="text-gray-600">
            <strong>Remember:</strong> These rules exist to protect and enhance our community. 
            By following them, you help create a better experience for everyone on BlogsInk.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RulesPage
