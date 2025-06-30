import { useState } from 'react'
import { callGeminiAPI, writingPrompts } from '../lib/gemini'
import { Link } from 'react-router-dom'
import { Sparkles, Loader2 } from 'lucide-react'

export default function StoryStarter() {
  const [selectedGenre, setSelectedGenre] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [loading, setLoading] = useState(false)

  const genres = [
    { id: 'fantasy', name: 'Fantasy', emoji: '🧙‍♂️', color: 'from-purple-500 to-indigo-500' },
    { id: 'horror', name: 'Horror', emoji: '👻', color: 'from-gray-700 to-red-600' },
    { id: 'romance', name: 'Romance', emoji: '💕', color: 'from-pink-500 to-rose-500' },
    { id: 'scifi', name: 'Sci-Fi', emoji: '🚀', color: 'from-blue-500 to-cyan-500' },
    { id: 'mystery', name: 'Mystery', emoji: '🕵️', color: 'from-gray-600 to-purple-600' },
    { id: 'adventure', name: 'Adventure', emoji: '🗺️', color: 'from-green-500 to-teal-500' },
    { id: 'thriller', name: 'Thriller', emoji: '⚡', color: 'from-red-500 to-orange-500' },
    { id: 'comedy', name: 'Comedy', emoji: '😂', color: 'from-yellow-400 to-orange-400' },
    { id: 'drama', name: 'Drama', emoji: '🎭', color: 'from-indigo-500 to-purple-500' },
    { id: 'historical', name: 'Historical', emoji: '🏛️', color: 'from-amber-600 to-orange-600' },
    { id: 'western', name: 'Western', emoji: '🤠', color: 'from-yellow-600 to-red-600' },
    { id: 'dystopian', name: 'Dystopian', emoji: '🏙️', color: 'from-gray-500 to-gray-700' },
    { id: 'essay', name: 'School Essay', emoji: '📚', color: 'from-green-500 to-emerald-500' },
    { id: 'rap', name: 'Rap', emoji: '🎤', color: 'from-orange-500 to-red-500' },
    { id: 'poetry', name: 'Poetry', emoji: '🌸', color: 'from-pink-400 to-purple-400' },
    { id: 'memoir', name: 'Memoir', emoji: '📖', color: 'from-blue-400 to-indigo-400' },
  ]

  const generateStarter = async () => {
    if (!selectedGenre) {
      alert('Please select a genre first!')
      return
    }

    setLoading(true)
    try {
      const prompt = writingPrompts.storyStarter(selectedGenre)
      const result = await callGeminiAPI(prompt)
      setGeneratedText(result)
    } catch (error) {
      console.error('Error:', error)
      alert('Sorry, there was an error generating your story starter. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Start Something New! ✨
          </h1>
          <p className="text-lg text-gray-600">
            Beat writer's block with AI-generated opening paragraphs
          </p>
        </div>

        {/* Genre Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Choose Your Genre
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`relative overflow-hidden p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  selectedGenre === genre.id
                    ? `bg-gradient-to-r ${genre.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{genre.emoji}</div>
                  <div className="font-semibold text-sm">{genre.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <button
            onClick={generateStarter}
            disabled={loading || !selectedGenre}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <Sparkles size={24} />
            )}
            <span>
              {loading ? 'Generating...' : 'Generate First Paragraph'}
            </span>
          </button>
        </div>

        {/* Generated Text */}
        {generatedText && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📝</span>
              Your Story Starter
            </h3>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <textarea
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                className="w-full h-40 bg-transparent border-none resize-none focus:outline-none text-gray-700 text-lg leading-relaxed"
                placeholder="Your generated story starter will appear here..."
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigator.clipboard.writeText(generatedText)}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>📋</span>
                <span>Copy Text</span>
              </button>
              <Link
                to={`/playground?text=${encodeURIComponent(generatedText)}`}
                className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                <span>✍️</span>
                <span>Continue in Playground</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}