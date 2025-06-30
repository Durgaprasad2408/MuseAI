import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Edit, Trash2, Download, Calendar, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import html2pdf from 'html2pdf.js'

export default function Vault() {
  const { user } = useAuth()
  const [writings, setWritings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchWritings()
    }
  }, [user])

  const fetchWritings = async () => {
    try {
      const { data, error } = await supabase
        .from('writings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWritings(data || [])
    } catch (error) {
      console.error('Error fetching writings:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteWriting = async (id) => {
    if (!confirm('Are you sure you want to delete this writing?')) return

    try {
      const { error } = await supabase
        .from('writings')
        .delete()
        .eq('id', id)

      if (error) throw error
      setWritings(writings.filter(w => w.id !== id))
    } catch (error) {
      console.error('Error deleting writing:', error)
      alert('Error deleting writing. Please try again.')
    }
  }

  const exportWriting = (writing) => {
    const content = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #7c3aed;">${writing.title}</h1>
        <p style="color: #666; margin-bottom: 20px;">Created: ${new Date(writing.created_at).toLocaleDateString()}</p>
        ${writing.original_text ? `<h2>Original Text:</h2><p style="line-height: 1.6;">${writing.original_text}</p>` : ''}
        ${writing.enhanced_text ? `<h2>Enhanced Text:</h2><p style="line-height: 1.6;">${writing.enhanced_text}</p>` : ''}
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Generated with MuseAI - Your Creative Writing Coach</p>
      </div>
    `

    const opt = {
      margin: 1,
      filename: `${writing.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(content).save()
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Sign In Required
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Please sign in to access your writing vault and save your creative works.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your writings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            My Writing Vault 📚
          </h1>
          <p className="text-lg text-gray-600">
            Your saved creative works and AI-enhanced writings
          </p>
        </div>

        {writings.length === 0 ? (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <BookOpen size={64} className="mx-auto text-gray-400 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your vault is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start writing in the playground to save your creative works here!
              </p>
              <Link
                to="/playground"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                <span>Start Writing</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writings.map((writing) => (
              <div key={writing.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {writing.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar size={14} className="mr-1" />
                    {new Date(writing.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {writing.original_text || writing.enhanced_text}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Link
                      to={`/playground?text=${encodeURIComponent(writing.enhanced_text || writing.original_text)}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit in Playground"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => exportWriting(writing)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => deleteWriting(writing.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}