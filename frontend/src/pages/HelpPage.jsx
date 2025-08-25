import React, { useState } from 'react'
import { Search, HelpCircle, BookOpen, MessageCircle, Mail, Phone, MapPin } from 'lucide-react'
import Accordion from '../components/ui/Accordion'

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('getting-started')

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'writing', label: 'Writing & Publishing', icon: BookOpen },
    { id: 'account', label: 'Account & Settings', icon: BookOpen },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: BookOpen }
  ]

  const faqs = {
    'getting-started': [
      {
        title: 'How do I create my first blog post?',
        content: 'To create your first blog post, click on the "Write" button in the sidebar or header. You\'ll be taken to our rich text editor where you can write, format, and add media to your post. Once you\'re satisfied, click "Publish" to make it live.'
      },
      {
        title: 'What are the different account types?',
        content: 'We offer two main account types: Free and Premium. Free accounts give you access to basic features like writing and publishing posts. Premium accounts include advanced features like custom domains, analytics, and priority support.'
      },
      {
        title: 'How do I customize my profile?',
        content: 'You can customize your profile by going to your Profile page and clicking the "Edit Profile" button. Here you can update your avatar, bio, location, website, and other personal information.'
      }
    ],
    'writing': [
      {
        title: 'What file types can I upload?',
        content: 'We support most common image formats (JPEG, PNG, GIF, WebP) and video formats (MP4, WebM). Images can be up to 5MB, and videos up to 100MB. For security reasons, we don\'t support executable files.'
      },
      {
        title: 'How do I add tags to my posts?',
        content: 'When creating or editing a post, you\'ll see a "Tags" field. Simply type your tags separated by commas. Tags help readers discover your content and improve your post\'s visibility.'
      },
      {
        title: 'Can I schedule posts for later?',
        content: 'Yes! When publishing a post, you can choose to publish immediately or schedule it for a future date and time. Scheduled posts will automatically go live at the specified time.'
      }
    ],
    'account': [
      {
        title: 'How do I change my password?',
        content: 'To change your password, go to Settings > Security. You\'ll need to enter your current password and then provide a new one. Make sure your new password is strong and unique.'
      },
      {
        title: 'Can I delete my account?',
        content: 'Yes, you can delete your account in Settings > Account. Please note that this action is irreversible and will permanently remove all your content and data.'
      },
      {
        title: 'How do I enable two-factor authentication?',
        content: 'Two-factor authentication can be enabled in Settings > Security. We recommend using an authenticator app like Google Authenticator or Authy for enhanced security.'
      }
    ],
    'troubleshooting': [
      {
        title: 'My post isn\'t publishing',
        content: 'First, check that all required fields are filled out. Make sure your post has a title and content. If the issue persists, try refreshing the page or clearing your browser cache. Contact support if the problem continues.'
      },
      {
        title: 'Images aren\'t loading properly',
        content: 'This could be due to file size limits or unsupported formats. Make sure your images are under 5MB and in a supported format. If the issue persists, try uploading the image again or contact support.'
      },
      {
        title: 'I can\'t log into my account',
        content: 'First, verify that you\'re using the correct email and password. If you\'ve forgotten your password, use the "Forgot Password" link on the login page. If you\'re still having issues, contact our support team.'
      }
    ]
  }

  const filteredFaqs = searchQuery
    ? Object.values(faqs).flat().filter(faq =>
        faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs[activeCategory] || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions, learn how to use BlogsInk effectively, and get the support you need.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-6 rounded-lg border transition-colors ${
                  activeCategory === category.id
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${
                    activeCategory === category.id ? 'text-yellow-600' : 'text-gray-600'
                  }`} />
                  <span className={`font-medium ${
                    activeCategory === category.id ? 'text-yellow-700' : 'text-gray-700'
                  }`}>
                    {category.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion items={filteredFaqs} />
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600">
              Our support team is here to help you get the most out of BlogsInk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get instant help from our support team
              </p>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                Start Chat
              </button>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Send us a detailed message
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                Send Email
              </button>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Call us for urgent issues
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Call Now
              </button>
            </div>
          </div>
        </div>

        {/* Office Hours */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Support Hours</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST</p>
              <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM EST</p>
            </div>
            <div>
              <p><strong>Sunday:</strong> Closed</p>
              <p><strong>Holidays:</strong> Limited support available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
