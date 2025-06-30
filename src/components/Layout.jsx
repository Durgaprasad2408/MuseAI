import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PenTool, Home, BookOpen, Mic, Archive, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import PWAInstallPrompt from './PWAInstallPrompt'

export default function Layout({ children }) {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Writing Playground', href: '/playground', icon: PenTool },
    { name: 'Story Starter', href: '/starter', icon: BookOpen },
    { name: 'Voice Narrator', href: '/narrator', icon: Mic },
    { name: 'My Vault', href: '/vault', icon: Archive },
  ]

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-100 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                <span className="text-2xl">✍️</span>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  MuseAI
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === '/profile'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <User size={16} />
                    <span className="text-sm font-medium">
                      {profile?.username ? `@${profile.username}` : profile?.full_name || user.email}
                    </span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors z-50 relative"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <div className="absolute top-full left-0 right-0 md:hidden border-t border-purple-100 bg-white/95 backdrop-blur-md shadow-lg z-50">
              <div className="px-4 pt-2 pb-3 space-y-1 max-h-screen overflow-y-auto">
                {/* User info at top of mobile menu */}
                {user && (
                  <div className="px-3 py-3 border-b border-gray-200 mb-2">
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        location.pathname === '/profile'
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <User size={20} />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {profile?.username ? `@${profile.username}` : profile?.full_name || 'Profile'}
                        </span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Navigation items */}
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 block ${
                        isActive
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}

                {/* Auth actions */}
                <div className="pt-2 border-t border-gray-200">
                  {user ? (
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
                    >
                      <User size={20} />
                      <span>Sign In</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-purple-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Made with ❤️ for creative writers everywhere
            </p>
            <p className="text-sm text-gray-500">
              Built with <span className="font-semibold">Bolt.new</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}