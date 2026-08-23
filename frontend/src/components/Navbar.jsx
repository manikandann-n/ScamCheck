import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Shield, Menu, X, User, LogOut, LogIn, UserPlus, 
  Home, BarChart3, History, Activity, 
  Award, Bell, ChevronDown, Sparkles 
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

function Navbar({ showToast }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
    setMobileOpen(false)
    if (showToast) showToast('Logged out successfully', 'info')
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/analyze', label: 'Analyze', icon: Shield },
    { path: '/history', label: 'History', icon: History },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700/50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="default" showTagline={true} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-white bg-dark-800/50'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800/30'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Auth Section */}
            {user ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-dark-800/30 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium text-sm group-hover:scale-105 transition-transform">
                    {user.full_name ? user.full_name[0].toUpperCase() : user.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-dark-300 group-hover:text-white transition-colors">
                    {user.full_name || user.username}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    
                    <div className="absolute right-0 mt-2 w-64 glass rounded-xl border-dark-700 shadow-2xl py-1 z-50 animate-fade-in">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-dark-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                            {user.full_name ? user.full_name[0].toUpperCase() : user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.full_name || user.username}</p>
                            <p className="text-xs text-dark-400">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 transition-colors"
                        >
                          <User className="w-4 h-4 text-blue-400" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 transition-colors"
                        >
                          <Activity className="w-4 h-4 text-purple-400" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/history"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 transition-colors"
                        >
                          <History className="w-4 h-4 text-green-400" />
                          <span>History</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 transition-colors"
                        >
                          <Bell className="w-4 h-4 text-purple-400" />
                          <span>Notifications</span>
                        </Link>
                        <div className="border-t border-dark-700/50 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>

                      {/* Premium Badge */}
                      <div className="px-4 py-2 border-t border-dark-700/50">
                        <div className="flex items-center gap-2 text-xs">
                          <Award className="w-3 h-3 text-yellow-400" />
                          <span className="text-dark-400">Premium Member</span>
                          <Sparkles className="w-3 h-3 text-purple-400 ml-auto" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800/30 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.02]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-dark-800/50 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-dark-700/50 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-dark-800/30 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                  {user.full_name ? user.full_name[0].toUpperCase() : user.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.full_name || user.username}</p>
                  <p className="text-xs text-dark-400">{user.email}</p>
                </div>
              </div>
            )}

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-white bg-dark-800/50'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800/30'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}

            {user ? (
              <div className="border-t border-dark-700/50 pt-3 mt-2 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800/30 transition-colors"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800/30 transition-colors"
                >
                  <Bell className="w-4 h-4 text-purple-400" />
                  <span>Notifications</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-dark-700/50 pt-3 mt-2 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-center text-dark-300 hover:text-white hover:bg-dark-800/30 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <div className="mt-4 px-4 py-2 border-t border-dark-700/50">
              <p className="text-[10px] text-dark-500 text-center">
                ScamCheck v3.0 • Verify before you trust.
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar