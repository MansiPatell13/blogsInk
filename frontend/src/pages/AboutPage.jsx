import React from 'react'
import { Users, BookOpen, PenTool, Heart, Target, Award } from 'lucide-react'

const AboutPage = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Rich Content Creation',
      description: 'Create beautiful, engaging blog posts with our powerful rich text editor and media support.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with fellow writers, share ideas, and build meaningful relationships in our community.'
    },
    {
      icon: PenTool,
      title: 'Professional Tools',
      description: 'Access professional writing tools, SEO optimization, and analytics to grow your audience.'
    },
    {
      icon: Heart,
      title: 'Passion for Writing',
      description: 'Built by writers, for writers. We understand the creative process and support your journey.'
    },
    {
      icon: Target,
      title: 'Focused Experience',
      description: 'Clean, distraction-free interface designed to help you focus on what matters most - your writing.'
    },
    {
      icon: Award,
      title: 'Quality First',
      description: 'We prioritize quality content and provide tools to help you create your best work.'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Active Writers' },
    { number: '50K+', label: 'Blog Posts' },
    { number: '1M+', label: 'Monthly Readers' },
    { number: '95%', label: 'Satisfaction Rate' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              About BlogsInk
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering writers to share their stories, connect with readers, and build meaningful communities through the power of blogging.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            At BlogsInk, we believe that everyone has a story worth sharing. Our mission is to provide writers with the tools, 
            platform, and community they need to express themselves, reach their audience, and make a meaningful impact through their words.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            BlogsInk by the Numbers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-6">
                BlogsInk was born from a simple observation: while there are many blogging platforms available, 
                few truly understand the needs of serious writers and content creators. We saw an opportunity to 
                build something different - a platform that puts writers first.
              </p>
              <p className="mb-6">
                Our journey began in 2024 when a group of writers, developers, and designers came together with 
                a shared vision. We wanted to create a platform that would not only make it easy to write and 
                publish, but also help writers grow their audience and monetize their content.
              </p>
              <p className="mb-6">
                Today, BlogsInk has grown into a thriving community of writers from all walks of life. From 
                professional journalists to hobby bloggers, from technical writers to creative storytellers - 
                we're proud to support them all in their writing journey.
              </p>
              <p>
                As we look to the future, our commitment remains the same: to provide writers with the best 
                possible platform for sharing their stories with the world. We're constantly listening to our 
                community and improving our tools to better serve your needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Writing Journey?
          </h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            Join thousands of writers who are already sharing their stories on BlogsInk. 
            Start writing today and connect with readers around the world.
          </p>
          <div className="space-x-4">
            <button className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
