import React, { useState, useEffect } from 'react'
import { 
  Globe, AlertTriangle, TrendingUp, TrendingDown,
  Zap, Shield, Database, Clock, Search, Filter,
  ArrowUp, ArrowDown, Minus, Activity
} from 'lucide-react'
import api from '../api/client'

function ScamIntelligence({ showToast }) {
  const [data, setData] = useState({
    loading: true,
    patterns: {},
    total: 0,
    mostCommon: '',
    trend: 'stable',
    topScams: [],
    globalStats: {}
  })

  useEffect(() => {
    loadIntelligence()
  }, [])

  const loadIntelligence = async () => {
    try {
      const [patterns, stats] = await Promise.all([
        api.getScamPatterns(),
        api.getIntelligence()
      ])
      
      setData({
        loading: false,
        patterns: patterns.patterns || {},
        total: patterns.total_analyses || 0,
        mostCommon: patterns.most_common || 'None',
        trend: patterns.trend || 'stable',
        topScams: stats.top_scams || [],
        globalStats: stats
      })
    } catch (error) {
      showToast('Failed to load intelligence data', 'error')
      setData(prev => ({ ...prev, loading: false }))
    }
  }

  if (data.loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="glass rounded-2xl border-dark-700 p-6">
          <div className="h-32 bg-dark-800 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-2xl border-dark-700 p-6 h-48"></div>
          <div className="glass rounded-2xl border-dark-700 p-6 h-48"></div>
        </div>
      </div>
    )
  }

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-red-400" />
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-green-400" />
    return <Minus className="w-4 h-4 text-yellow-400" />
  }

  const getPatternColor = (value) => {
    if (value > 20) return 'text-red-400'
    if (value > 10) return 'text-yellow-400'
    return 'text-green-400'
  }

  const patternLabels = {
    'payment': '💰 Payment Requests',
    'urgency': '⏰ Urgency Tactics',
    'personal_email': '📧 Personal Email',
    'whatsapp': '💬 WhatsApp/Telegram',
    'no_interview': '❌ No Interview',
    'fake_selection': '🏆 Fake Selection',
    'suspicious_url': '🔗 Suspicious URLs'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Scam Intelligence Center</h1>
          <p className="text-dark-400 text-sm">Global scam pattern analysis & real-time insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-dark-400">Live</span>
          </div>
          <button 
            onClick={loadIntelligence}
            className="px-4 py-2 bg-dark-800 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <Database className="w-4 h-4 inline mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl border-dark-700 p-6">
          <p className="text-sm text-dark-400">Total Analyses</p>
          <p className="text-2xl font-bold text-white mt-1">{data.total}</p>
          <p className="text-xs text-dark-500 mt-1">Global database</p>
        </div>
        <div className="glass rounded-2xl border-dark-700 p-6">
          <p className="text-sm text-dark-400">Most Common Scam</p>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {data.mostCommon || 'None'}
          </p>
          <p className="text-xs text-dark-500 mt-1">Based on detection patterns</p>
        </div>
        <div className="glass rounded-2xl border-dark-700 p-6">
          <p className="text-sm text-dark-400">Trend</p>
          <div className="flex items-center gap-2 mt-1">
            {getTrendIcon(data.trend)}
            <p className={`text-2xl font-bold ${
              data.trend === 'increasing' ? 'text-red-400' :
              data.trend === 'decreasing' ? 'text-green-400' :
              'text-yellow-400'
            }`}>
              {data.trend.charAt(0).toUpperCase() + data.trend.slice(1)}
            </p>
          </div>
          <p className="text-xs text-dark-500 mt-1">Last 30 days</p>
        </div>
      </div>

      {/* Pattern Analysis */}
      <div className="glass rounded-2xl border-dark-700 p-6">
        <h3 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Scam Pattern Detection
        </h3>
        <div className="space-y-3">
          {Object.entries(data.patterns).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-dark-300">{patternLabels[key] || key}</span>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                    style={{ width: `${Math.min((value / Math.max(...Object.values(data.patterns), 1)) * 100, 100)}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${getPatternColor(value)}`}>
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Scams */}
      <div className="glass rounded-2xl border-dark-700 p-6">
        <h3 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Top Scams Worldwide
        </h3>
        <div className="space-y-2">
          {data.topScams.map((scam, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-dark-400">#{i + 1}</span>
                <span className="text-sm text-white">{scam.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-400">{scam.count}</span>
                <span className="text-xs text-dark-500">reports</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Stats */}
      <div className="glass rounded-2xl border-dark-700 p-6">
        <h3 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Global Protection Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-blue-400">{data.globalStats.total_analyses || 0}</p>
            <p className="text-xs text-dark-400">Total Analyses</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-400">{data.globalStats.unique_users || 0}</p>
            <p className="text-xs text-dark-400">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-yellow-400">{data.globalStats.detection_rate || 0}%</p>
            <p className="text-xs text-dark-400">Detection Rate</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-purple-400">24/7</p>
            <p className="text-xs text-dark-400">Active Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScamIntelligence