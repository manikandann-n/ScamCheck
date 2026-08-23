import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  User, Mail, Shield, Edit2, Save, X, CheckCircle,
  Award, Activity, TrendingUp, Star,
  Bell, LogOut, ChevronRight
} from 'lucide-react'

function Profile({ showToast }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    username: user?.username || ''
  })

  if (!user) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center py-20">
          <User className="w-16 h-16 text-dark-500 mx-auto mb-4" />
          <p className="text-dark-400">Please login</p>
          <button onClick={() => navigate('/login')} className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">Login</button>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    showToast('✅ Profile updated!', 'success')
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    showToast('Logged out', 'info')
  }

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
          <p className="text-sm text-dark-400">Manage your account</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate('/settings')} className="flex items-center gap-2 px-3 py-2 sm:px-4 border border-dark-600 rounded-lg text-sm text-dark-300 hover:border-dark-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-600/30">
            {isEditing ? <><Save className="w-4 h-4" /> Save</> : <><Edit2 className="w-4 h-4" /> Edit</>}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass rounded-2xl border-dark-700 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white flex-shrink-0">
            {user.full_name ? user.full_name[0].toUpperCase() : user.username[0].toUpperCase()}
          </div>

          <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
            {isEditing ? (
              <div className="space-y-3 w-full">
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Full Name</label>
                  <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Username</label>
                  <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50" />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white">{user.full_name || user.username}</h2>
                <p className="text-sm text-dark-400">{user.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">Premium</span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs">Member {new Date(user.created_at).getFullYear()}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4 text-center sm:text-left">
            <div><p className="text-xl font-bold text-white">12</p><p className="text-xs text-dark-400">Analyses</p></div>
            <div><p className="text-xl font-bold text-yellow-400">8</p><p className="text-xs text-dark-400">Flagged</p></div>
            <div><p className="text-xl font-bold text-green-400">4</p><p className="text-xs text-dark-400">Safe</p></div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-dark-700">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-dark-600 rounded-lg text-sm text-dark-300 hover:border-dark-400 hover:text-white transition-colors"><X className="w-4 h-4 inline mr-1" /> Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all"><Save className="w-4 h-4 inline mr-1" /> Save</button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="glass rounded-2xl border-dark-700 p-3 sm:p-4 text-center"><Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" /><p className="text-lg sm:text-xl font-bold text-white">98%</p><p className="text-xs text-dark-400">Accuracy</p></div>
        <div className="glass rounded-2xl border-dark-700 p-3 sm:p-4 text-center"><Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" /><p className="text-lg sm:text-xl font-bold text-white">24</p><p className="text-xs text-dark-400">Analyses</p></div>
        <div className="glass rounded-2xl border-dark-700 p-3 sm:p-4 text-center"><TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" /><p className="text-lg sm:text-xl font-bold text-white">+15%</p><p className="text-xs text-dark-400">Growth</p></div>
        <div className="glass rounded-2xl border-dark-700 p-3 sm:p-4 text-center"><Star className="w-6 h-6 text-purple-400 mx-auto mb-2" /><p className="text-lg sm:text-xl font-bold text-white">4.8</p><p className="text-xs text-dark-400">Rating</p></div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => navigate('/settings')} className="glass rounded-2xl border-dark-700 p-4 sm:p-6 hover:border-dark-600 transition-all group text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center"><Bell className="w-5 h-5 text-purple-400" /></div>
            <div><p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">Notifications</p><p className="text-xs text-dark-400">Manage preferences</p></div>
            <ChevronRight className="w-4 h-4 text-dark-500 ml-auto group-hover:text-white transition-colors" />
          </div>
        </button>
        <button onClick={handleLogout} className="glass rounded-2xl border-dark-700 p-4 sm:p-6 hover:border-red-500/30 transition-all group text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center"><LogOut className="w-5 h-5 text-red-400" /></div>
            <div><p className="text-sm font-medium text-white group-hover:text-red-400 transition-colors">Logout</p><p className="text-xs text-dark-400">Sign out</p></div>
            <ChevronRight className="w-4 h-4 text-dark-500 ml-auto group-hover:text-white transition-colors" />
          </div>
        </button>
      </div>

      <div className="mt-6 glass-light p-4 rounded-xl border-dark-700/30">
        <p className="text-xs text-dark-500 text-center">🔒 Your data is encrypted and secure.</p>
      </div>
    </div>
  )
}

export default Profile