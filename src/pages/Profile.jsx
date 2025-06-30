import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Calendar, Edit3, Save, X, Camera, Loader2 } from 'lucide-react'

export default function Profile() {
  const { user, profile, updateProfile, updateEmail, updatePassword, checkUsernameAvailability } = useAuth()
  const navigate = useNavigate()
  
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Profile form data
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    date_of_birth: '',
    gender: '',
    bio: '',
    avatar_url: ''
  })
  
  // Account settings
  const [emailData, setEmailData] = useState({
    newEmail: '',
    currentPassword: ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [activeTab, setActiveTab] = useState('profile')
  const [usernameChecking, setUsernameChecking] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
      })
    }
  }, [user, profile, navigate])

  const checkUsername = async (usernameValue) => {
    if (!usernameValue || usernameValue.length < 3 || usernameValue === profile?.username) {
      setUsernameAvailable(null)
      return
    }

    setUsernameChecking(true)
    try {
      const { available } = await checkUsernameAvailability(usernameValue)
      setUsernameAvailable(available)
    } catch (error) {
      console.error('Error checking username:', error)
    } finally {
      setUsernameChecking(false)
    }
  }

  const handleUsernameChange = (value) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setFormData(prev => ({ ...prev, username: cleanValue }))
    
    // Debounce username checking
    clearTimeout(window.usernameTimeout)
    window.usernameTimeout = setTimeout(() => {
      checkUsername(cleanValue)
    }, 500)
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (formData.username !== profile?.username && usernameAvailable === false) {
        throw new Error('Username is already taken')
      }

      const { error } = await updateProfile(formData)
      if (error) throw error

      setSuccess('Profile updated successfully!')
      setEditing(false)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await updateEmail(emailData.newEmail)
      if (error) throw error

      setSuccess('Email update initiated! Check your new email for confirmation.')
      setEmailData({ newEmail: '', currentPassword: '' })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match')
      }
      if (passwordData.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      const { error } = await updatePassword(passwordData.newPassword)
      if (error) throw error

      setSuccess('Password updated successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateAge = (dateString) => {
    if (!dateString) return null
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  if (!user) return null

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            My Profile 👤
          </h1>
          <p className="text-lg text-gray-600">
            Manage your account settings and personal information
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'account', label: 'Account', icon: Mail },
                { id: 'security', label: 'Security', icon: Lock }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium md:text-xs transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Edit3 size={16} />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                            className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              usernameAvailable === false ? 'border-red-300' : 
                              usernameAvailable === true ? 'border-green-300' : 'border-gray-300'
                            }`}
                            placeholder="Choose a unique username"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {usernameChecking && <Loader2 className="animate-spin text-gray-400" size={16} />}
                            {!usernameChecking && usernameAvailable === true && <span className="text-green-500">✓</span>}
                            {!usernameChecking && usernameAvailable === false && <span className="text-red-500">✗</span>}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading || (formData.username !== profile?.username && usernameAvailable === false)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false)
                          setError('')
                          setSuccess('')
                          setUsernameAvailable(null)
                          // Reset form data
                          if (profile) {
                            setFormData({
                              full_name: profile.full_name || '',
                              username: profile.username || '',
                              date_of_birth: profile.date_of_birth || '',
                              gender: profile.gender || '',
                              bio: profile.bio || '',
                              avatar_url: profile.avatar_url || ''
                            })
                          }
                        }}
                        className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-700 mb-2">Full Name</h3>
                        <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-700 mb-2">Username</h3>
                        <p className="text-gray-900">@{profile?.username || 'Not set'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-700 mb-2">Date of Birth</h3>
                        <p className="text-gray-900">
                          {formatDate(profile?.date_of_birth)}
                          {profile?.date_of_birth && (
                            <span className="text-sm text-gray-500 ml-2">
                              (Age: {calculateAge(profile.date_of_birth)})
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-700 mb-2">Gender</h3>
                        <p className="text-gray-900 capitalize">{profile?.gender || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 mb-2">Bio</h3>
                      <p className="text-gray-900">{profile?.bio || 'No bio added yet'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">Current Email</h3>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>

                  <form onSubmit={handleEmailUpdate} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Update Email Address</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Email Address
                      </label>
                      <input
                        type="email"
                        value={emailData.newEmail}
                        onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter new email address"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !emailData.newEmail}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                      <span>Update Email</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-800">Change Password</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
                    <span>Update Password</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}