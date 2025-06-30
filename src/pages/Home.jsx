import { Link } from 'react-router-dom'
import { PenTool, Sparkles, BookOpen, Mic } from 'lucide-react'
import FloatingElements from '../components/FloatingElements'

export default function Home() {
  const features = [
    {
      icon: PenTool,
      title: 'Smart Writing Assistant',
      description: 'Get AI-powered suggestions to improve your writing style, grammar, and creativity.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Sparkles,
      title: 'Creative Rewrites',
      description: 'Transform your text with dramatic, funny, or surprising variations.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      title: 'Story Starters',
      description: 'Beat writer\'s block with AI-generated opening paragraphs for any genre.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Mic,
      title: 'Voice Narrator',
      description: 'Hear your writing come alive with expressive text-to-speech.',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="relative">
      <FloatingElements />
      
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-8xl mb-4 block animate-bounce-slow">✍️</span>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
              MuseAI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium mb-4">
              Write smarter, write better, write with AI.
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
              MuseAI helps you start, improve, and polish your stories, poems, and essays with the power of artificial intelligence.
            </p>
          </div>

          <Link
            to="/playground"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PenTool size={24} />
            <span>Start Writing</span>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            Unleash Your Creative Potential
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Writing?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of writers who are already creating amazing content with MuseAI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/playground"
                className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Try Writing Playground
              </Link>
              <Link
                to="/starter"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Get Story Ideas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}