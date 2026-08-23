import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Bell, Mail, BellRing, Shield, Calendar, Zap, Save
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Settings({ showToast }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    analysisComplete: true,
    scamAlerts: true,
    weeklyDigest: false,
    securityAlerts: true
  })

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    const label = key.replace(/([A-Z])/g, ' $1').trim()
    showToast(`✅ ${label} ${!notifications[key] ? 'enabled' : 'disabled'}`, 'success')
  }

  const handleSave = () => {
    showToast('✅ Notification settings saved!', 'success')
  }

  const Switch = ({ enabled, onChange }) => (
    <button onClick={onChange} className={`w-12 h-7 rounded-full transition-all duration-300 ${enabled ? 'bg-blue-600' : 'bg-dark-600'}`}>
      <div className={`w-5 h-5 rounded-full bg-white transition-all duration-300 mt-1 ${enabled ? 'ml-6' : 'ml-1'}`} />
    </button>
  )

  if (!user) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center py-20">
          <Bell className="w-16 h-16 text-dark-500 mx-auto mb-4" />
          <p className="text-dark-400">Please login</p>
          <button onClick={() => navigate('/login')} className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">Login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-responsive py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/profile')} className="p-2 rounded-lg hover:bg-dark-800/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-dark-400" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
          <p className="text-sm text-dark-400">Manage your preferences</p>
        </div>
      </div>

      <div className="glass rounded-2xl border-dark-700 p-4 sm:p-6">
        <div className="space-y-6">
          <p className="text-sm text-dark-400">Choose which notifications you want to receive</p>
          <div className="space-y-3">
            {[
              { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive via email', icon: Mail },
              { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push', icon: BellRing },
              { key: 'analysisComplete', label: 'Analysis Complete', desc: 'When analysis finishes', icon: Zap },
              { key: 'scamAlerts', label: 'Scam Alerts', desc: 'New scam patterns', icon: Shield },
              { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary', icon: Calendar },
              { key: 'securityAlerts', label: 'Security Alerts', desc: 'Important security', icon: Shield }
            ].map((item) => (
              <div key={item.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-dark-800/30 rounded-xl border border-dark-700/50 hover:border-dark-600 transition-all gap-3">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-dark-400" />
                  <div>
                    <p className="text-sm text-white">{item.label}</p>
                    <p className="text-xs text-dark-400">{item.desc}</p>
                  </div>
                </div>
                <Switch enabled={notifications[item.key]} onChange={() => toggleNotification(item.key)} />
              </div>
            ))}
          </div>
          <button onClick={handleSave} className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all">
            <Save className="w-4 h-4 inline mr-2" /> Save Settings
          </button>
        </div>
      </div>

      <div className="mt-6">
        <button onClick={() => navigate('/profile')} className="w-full py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-300 hover:text-white hover:border-dark-600 transition-all duration-200">
          <ArrowLeft className="w-4 h-4 inline mr-2" /> Back to Profile
        </button>
      </div>
    </div>
  )
}

export default Settings