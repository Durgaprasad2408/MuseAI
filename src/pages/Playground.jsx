import { useState, useEffect } from 'react'
import { callGeminiAPI, writingPrompts } from '../lib/gemini'
import { generateSpeech, voiceProfiles } from '../lib/elevenlabs'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Wand2, Zap, Smile, Shuffle, Save, Download, Volume2, Loader2 } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export default function Playground() {
  const { user } = useAuth()
  const [originalText, setOriginalText] = useState('')
  const [enhancedText, setEnhancedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeAction, setActiveAction] = useState('')
  const [audioLoading, setAudioLoading] = useState('')

  // Load text from URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const textParam = urlParams.get('text')
    if (textParam) {
      setOriginalText(decodeURIComponent(textParam))
      // Clear the URL parameters after loading
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const actions = [
    { id: 'improve', label: 'Improve My Writing', icon: Wand2, color: 'from-purple-500 to-pink-500' },
    { id: 'dramatic', label: 'Make It Dramatic', icon: Zap, color: 'from-red-500 to-orange-500' },
    { id: 'funny', label: 'Make It Funnier', icon: Smile, color: 'from-green-500 to-emerald-500' },
    { id: 'twist', label: 'Add a Twist', icon: Shuffle, color: 'from-blue-500 to-cyan-500' },
  ]

  const handleAction = async (actionId) => {
    if (!originalText.trim()) {
      alert('Please enter some text first!')
      return
    }

    setLoading(true)
    setActiveAction(actionId)

    try {
      const prompt = writingPrompts[actionId](originalText)
      const result = await callGeminiAPI(prompt)
      setEnhancedText(result)
    } catch (error) {
      console.error('Error:', error)
      alert('Sorry, there was an error processing your request. Please try again.')
    } finally {
      setLoading(false)
      setActiveAction('')
    }
  }

  const saveToVault = async () => {
    if (!user) {
      alert('Please sign in to save your writing!')
      return
    }

    if (!originalText.trim() && !enhancedText.trim()) {
      alert('Nothing to save!')
      return
    }

    try {
      const { error } = await supabase
        .from('writings')
        .insert([
          {
            user_id: user.id,
            title: originalText.slice(0, 50) + (originalText.length > 50 ? '...' : ''),
            original_text: originalText,
            enhanced_text: enhancedText,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error
      alert('Saved to your vault! 📚')
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving to vault. Please try again.')
    }
  }

  const exportToPDF = () => {
    const content = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #7c3aed;">MuseAI Writing Export</h1>
        ${originalText ? `<h2>Original Text:</h2><p>${originalText}</p>` : ''}
        ${enhancedText ? `<h2>Enhanced Text:</h2><p>${enhancedText}</p>` : ''}
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Generated with MuseAI - Your Creative Writing Coach</p>
      </div>
    `

    const opt = {
      margin: 1,
      filename: 'muse-ai-writing.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(content).save()
  }

  const readAloud = async (text, textType) => {
    if (!text.trim()) {
      alert('No text to read!')
      return
    }

    setAudioLoading(textType)
    try {
      // Choose appropriate voice based on content
      let voiceProfile = 'calm'
      if (text.toLowerCase().includes('horror') || text.toLowerCase().includes('scary')) {
        voiceProfile = 'horror'
      } else if (text.toLowerCase().includes('love') || text.toLowerCase().includes('romance')) {
        voiceProfile = 'romantic'
      } else if (text.toLowerCase().includes('adventure') || text.toLowerCase().includes('action')) {
        voiceProfile = 'adventure'
      }

      const audioUrl = await generateSpeech(text, voiceProfile)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (error) {
      console.error('Error generating speech:', error)
      // Fallback to browser speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.8
        utterance.pitch = 1
        utterance.volume = 1
        speechSynthesis.speak(utterance)
      } else {
        alert('Text-to-speech is not supported in your browser.')
      }
    } finally {
      setAudioLoading('')
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Writing Playground 🎨
          </h1>
          <p className="text-lg text-gray-600">
            Transform your writing with AI-powered enhancements
          </p>
        </div>

        {/* Text Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Your Writing
          </label>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Start typing your story or paste your draft..."
            className="w-full h-40 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {actions.map((action) => {
            const Icon = action.icon
            const isActive = activeAction === action.id
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={loading}
                className={`relative overflow-hidden bg-gradient-to-r ${action.color} text-white p-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isActive && loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Icon size={20} />
                  )}
                  <span className="text-sm">{action.label}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Original Text */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📝</span>
              Original Text
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 min-h-[200px]">
              <p className="text-gray-700 whitespace-pre-wrap">
                {originalText || 'Your original text will appear here...'}
              </p>
            </div>
            {originalText && (
              <button
                onClick={() => readAloud(originalText, 'original')}
                disabled={audioLoading === 'original'}
                className="mt-4 flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors disabled:opacity-50"
              >
                {audioLoading === 'original' ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
                <span>{audioLoading === 'original' ? 'Generating...' : 'Read Aloud'}</span>
              </button>
            )}
          </div>

          {/* Enhanced Text */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">✨</span>
              AI-Enhanced Version
            </h3>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 min-h-[200px]">
              <p className="text-gray-700 whitespace-pre-wrap">
                {enhancedText || 'Your enhanced text will appear here...'}
              </p>
            </div>
            {enhancedText && (
              <button
                onClick={() => readAloud(enhancedText, 'enhanced')}
                disabled={audioLoading === 'enhanced'}
                className="mt-4 flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors disabled:opacity-50"
              >
                {audioLoading === 'enhanced' ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
                <span>{audioLoading === 'enhanced' ? 'Generating...' : 'Read Aloud'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={saveToVault}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            <Save size={20} />
            <span>Save to My Vault</span>
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            <Download size={20} />
            <span>Export as PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}