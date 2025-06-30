import { useState, useRef } from 'react'
import { Volume2, VolumeX, Settings, Download, Loader2 } from 'lucide-react'
import { generateSpeech, voiceProfiles } from '../lib/elevenlabs'

export default function Narrator() {
  const [text, setText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('calm')
  const [audioUrl, setAudioUrl] = useState(null)
  const audioRef = useRef(null)

  const generateAndPlay = async () => {
    if (!text.trim()) {
      alert('Please enter some text to read!')
      return
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    setIsGenerating(true)
    try {
      const audioUrl = await generateSpeech(text, selectedVoice)
      setAudioUrl(audioUrl)
      
      // Create and play audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error generating speech:', error)
      alert('Sorry, there was an error generating the speech. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a')
      a.href = audioUrl
      a.download = 'muse-ai-narration.mp3'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Voice Narrator 🎤
          </h1>
          <p className="text-lg text-gray-600">
            Bring your writing to life with AI-powered emotional narration
          </p>
        </div>

        {/* Text Input */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <label className="block text-xl font-semibold text-gray-700 mb-4">
            Enter Your Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your story, poem, or any text you'd like to hear narrated with emotion..."
            className="w-full h-48 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Voice Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Settings className="mr-2" size={24} />
            Choose Your Narrator
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(voiceProfiles).map(([key, voice]) => (
              <button
                key={key}
                onClick={() => setSelectedVoice(key)}
                className={`p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  selectedVoice === key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{voice.emoji}</div>
                  <div className="font-semibold text-sm">{voice.name}</div>
                  <div className="text-xs opacity-75 mt-1">{voice.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Controls */}
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={generateAndPlay}
              disabled={!text.trim() || isGenerating}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                isPlaying
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Generating...</span>
                </>
              ) : isPlaying ? (
                <>
                  <VolumeX size={24} />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Volume2 size={24} />
                  <span>Generate & Play</span>
                </>
              )}
            </button>

            {isPlaying && (
              <button
                onClick={stopAudio}
                className="flex items-center space-x-2 px-6 py-4 rounded-2xl text-lg font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
              >
                <VolumeX size={20} />
                <span>Stop</span>
              </button>
            )}

            {audioUrl && (
              <button
                onClick={downloadAudio}
                className="flex items-center space-x-2 px-6 py-4 rounded-2xl text-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Download size={20} />
                <span>Download</span>
              </button>
            )}
          </div>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            onEnded={handleAudioEnd}
            className="hidden"
          />

          {/* Status Indicators */}
          {isGenerating && (
            <div className="flex items-center justify-center space-x-2 text-purple-600 mb-4">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="ml-2 font-medium">Creating emotional narration...</span>
            </div>
          )}

          {isPlaying && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
              <span className="font-medium">Playing with {voiceProfiles[selectedVoice].name}</span>
            </div>
          )}
        </div>

        {/* Voice Profile Info */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Current Voice: {voiceProfiles[selectedVoice].name} {voiceProfiles[selectedVoice].emoji}
          </h3>
          <p className="text-gray-600">
            {voiceProfiles[selectedVoice].description}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>💡 <strong>Tip:</strong> Different voices work better for different genres. Try the Horror Narrator for scary stories, or the Romantic Reader for love poems!</p>
          </div>
        </div>
      </div>
    </div>
  )
}