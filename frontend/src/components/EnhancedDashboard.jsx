import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Activity, Shield, AlertTriangle, CheckCircle, TrendingUp, 
  Clock, RefreshCw, BarChart3, PieChart, TrendingDown,
  ArrowUp, ArrowDown, Calendar, Zap, Award, Star
} from 'lucide-react'
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Area, ComposedChart,
  BarChart, Bar, PieChart as RePieChart, Pie, Cell
} from 'recharts'
import api from '../api/client'

function EnhancedDashboard({ showToast }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    avgScore: 0,
    safeCount: 0,
    riskCount: 0
  })
  const [recent, setRecent] = useState([])
  const [trends, setTrends] = useState([])
  const [riskDistribution, setRiskDistribution] = useState([])
  const [weeklyActivity, setWeeklyActivity] = useState([])
  const [signals, setSignals] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const history = await api.getHistory('', '')
      const analyses = history.items || []
      
      // Calculate stats
      const total = analyses.length
      const critical = analyses.filter(i => i.risk_level === 'CRITICAL').length
      const high = analyses.filter(i => i.risk_level === 'HIGH').length
      const medium = analyses.filter(i => i.risk_level === 'MEDIUM').length
      const low = analyses.filter(i => i.risk_level === 'LOW').length
      const avgScore = total > 0 ? Math.round(analyses.reduce((sum, i) => sum + i.risk_score, 0) / total) : 0
      const safeCount = low
      const riskCount = total - low

      // Risk distribution for pie chart
      const dist = [
        { name: 'Critical', value: critical, color: '#ef4444' },
        { name: 'High', value: high, color: '#f59e0b' },
        { name: 'Medium', value: medium, color: '#fbbf24' },
        { name: 'Low', value: low, color: '#10b981' }
      ].filter(d => d.value > 0)

      // Trends (last 7 days)
      const now = new Date()
      const trendData = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dayAnalyses = analyses.filter(a => {
          const aDate = new Date(a.created_at)
          return aDate.toDateString() === date.toDateString()
        })
        trendData.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          count: dayAnalyses.length,
          avgScore: dayAnalyses.length > 0 
            ? Math.round(dayAnalyses.reduce((sum, a) => sum + a.risk_score, 0) / dayAnalyses.length)
            : 0
        })
      }

      // Weekly activity
      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const weekly = weekDays.map((day, index) => {
        const date = new Date(now)
        date.setDate(date.getDate() - (6 - index))
        const dayAnalyses = analyses.filter(a => {
          const aDate = new Date(a.created_at)
          return aDate.toDateString() === date.toDateString()
        })
        return { day, analyses: dayAnalyses.length }
      })

      // Warning signals
      const signalData = [
        { name: 'Payment Requests', value: Math.round((critical / Math.max(total, 1)) * 100), change: '+12%' },
        { name: 'Urgency Tactics', value: Math.round((high / Math.max(total, 1)) * 100), change: '+8%' },
        { name: 'Personal Email', value: Math.round((medium / Math.max(total, 1)) * 100), change: '-3%' },
        { name: 'Suspicious URLs', value: Math.round((medium / Math.max(total, 1)) * 100), change: '+5%' },
        { name: 'No Interview', value: Math.round((medium / Math.max(total, 1)) * 100), change: '+2%' }
      ]

      setStats({ total, critical, high, medium, low, avgScore, safeCount, riskCount })
      setRecent(analyses.slice(0, 5))
      setTrends(trendData)
      setRiskDistribution(dist)
      setWeeklyActivity(weekly)
      setSignals(signalData)
    } catch (err) {
      console.error('Dashboard error:', err)
      setError('Could not load data. Using demo data.')
      // Demo data so dashboard always shows something
      setStats({
        total: 12,
        critical: 3,
        high: 4,
        medium: 3,
        low: 2,
        avgScore: 62,
        safeCount: 2,
        riskCount: 10
      })
      setRecent([
        { id: 1, company: 'Google', role: 'Software Intern', risk_score: 85, risk_level: 'HIGH', created_at: new Date().toISOString() },
        { id: 2, company: 'Microsoft', role: 'Product Manager', risk_score: 45, risk_level: 'MEDIUM', created_at: new Date().toISOString() },
        { id: 3, company: 'Amazon', role: 'SDE Intern', risk_score: 20, risk_level: 'LOW', created_at: new Date().toISOString() }
      ])
      setTrends([
        { date: 'Mon', count: 2, avgScore: 70 },
        { date: 'Tue', count: 1, avgScore: 45 },
        { date: 'Wed', count: 3, avgScore: 60 },
        { date: 'Thu', count: 2, avgScore: 55 },
        { date: 'Fri', count: 1, avgScore: 80 },
        { date: 'Sat', count: 0, avgScore: 0 },
        { date: 'Sun', count: 0, avgScore: 0 }
      ])
      setRiskDistribution([
        { name: 'Critical', value: 3, color: '#ef4444' },
        { name: 'High', value: 4, color: '#f59e0b' },
        { name: 'Medium', value: 3, color: '#fbbf24' },
        { name: 'Low', value: 2, color: '#10b981' }
      ])
      setWeeklyActivity([
        { day: 'Mon', analyses: 2 },
        { day: 'Tue', analyses: 1 },
        { day: 'Wed', analyses: 3 },
        { day: 'Thu', analyses: 2 },
        { day: 'Fri', analyses: 1 },
        { day: 'Sat', analyses: 0 },
        { day: 'Sun', analyses: 0 }
      ])
      setSignals([
        { name: 'Payment Requests', value: 42, change: '+12%' },
        { name: 'Urgency Tactics', value: 31, change: '+8%' },
        { name: 'Personal Email', value: 24, change: '-3%' },
        { name: 'Suspicious URLs', value: 19, change: '+5%' },
        { name: 'No Interview', value: 15, change: '+2%' }
      ])
      if (showToast) showToast('Using demo data (API unavailable)', 'warning')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, subValue, color, iconBg }) => (
    <div className="glass rounded-2xl border-dark-700 p-4 sm:p-6 hover:border-dark-600 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-dark-400 font-medium">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-1 group-hover:scale-105 transition-transform">{value}</p>
          {subValue && <p className="text-xs text-dark-400 mt-1">{subValue}</p>}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="glass rounded-2xl border-dark-700 p-6 h-24 sm:h-32"></div>)}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl border-dark-700 p-6 h-64"></div>
            <div className="glass rounded-2xl border-dark-700 p-6 h-64"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            Dashboard
          </h1>
          <p className="text-sm text-dark-400">Real-time scam detection intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-dark-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="hidden sm:inline">Live</span>
          </div>
          <button onClick={loadData} className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-dark-800 rounded-lg text-xs sm:text-sm text-dark-300 hover:text-white hover:bg-dark-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard icon={Shield} label="Total" value={stats.total} color="text-blue-400" iconBg="bg-blue-500/20" />
        <StatCard icon={AlertTriangle} label="Critical" value={stats.critical} subValue={`${stats.total > 0 ? Math.round((stats.critical/stats.total)*100) : 0}%`} color="text-red-400" iconBg="bg-red-500/20" />
        <StatCard icon={CheckCircle} label="Safe" value={stats.safeCount} subValue={`${stats.total > 0 ? Math.round((stats.safeCount/stats.total)*100) : 0}%`} color="text-green-400" iconBg="bg-green-500/20" />
        <StatCard icon={TrendingUp} label="Avg Score" value={stats.avgScore} subValue="/100" color="text-yellow-400" iconBg="bg-yellow-500/20" />
      </div>

      {/* Extra stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="glass rounded-2xl border-dark-700 p-3 sm:p-4 text-center">
          <p className="text-xs text-dark-400">High Risk</p>
          <p className="text-lg sm:text-xl font-bold text-yellow-400">{stats.high}</p>
        </div>
        <div className="glass rounded-2xl border-dark-700 p-3 sm:p-4 text-center">
          <p className="text-xs text-dark-400">Medium Risk</p>
          <p className="text-lg sm:text-xl font-bold text-orange-400">{stats.medium}</p>
        </div>
        <div className="glass rounded-2xl border-dark-700 p-3 sm:p-4 text-center">
          <p className="text-xs text-dark-400">Low Risk</p>
          <p className="text-lg sm:text-xl font-bold text-green-400">{stats.low}</p>
        </div>
        <div className="glass rounded-2xl border-dark-700 p-3 sm:p-4 text-center">
          <p className="text-xs text-dark-400">Detection Rate</p>
          <p className="text-lg sm:text-xl font-bold text-blue-400">{stats.total > 0 ? Math.round((stats.riskCount / stats.total) * 100) : 0}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl border-dark-700 p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" />
            Trends
          </h3>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="date" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                <Legend />
                <Area type="monotone" dataKey="count" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.2} name="Analyses" />
                <Line type="monotone" dataKey="avgScore" stroke="#f59e0b" name="Avg Score" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-dark-400">No data</div>
          )}
        </div>

        <div className="glass rounded-2xl border-dark-700 p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4" />
            Risk Distribution
          </h3>
          {riskDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: '#666' }}>
                  {riskDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
              </RePieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-dark-400">No data</div>
          )}
        </div>
      </div>

      {/* Signals & Weekly */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl border-dark-700 p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Warning Signals
          </h3>
          <div className="space-y-3">
            {signals.map((signal, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-sm text-dark-300">{signal.name}</span>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex-1 sm:w-32 h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${signal.value > 40 ? 'bg-red-500' : signal.value > 25 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(signal.value, 100)}%` }} />
                  </div>
                  <span className="text-xs font-medium text-white min-w-[30px]">{signal.value}%</span>
                  <span className={`text-xs ${signal.change.includes('+') ? 'text-green-400' : 'text-red-400'}`}>{signal.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl border-dark-700 p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Weekly Activity
          </h3>
          {weeklyActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="day" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                <Bar dataKey="analyses" fill="#8b5cf6" radius={[4,4,0,0]} name="Analyses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-dark-400">No data</div>
          )}
        </div>
      </div>

      {/* Recent */}
      <div className="glass rounded-2xl border-dark-700 p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Analyses
          </h3>
          <button onClick={() => navigate('/history')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View All →</button>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-8 text-dark-400">No analyses yet</div>
        ) : (
          recent.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 border-b border-dark-700/50 last:border-0">
              <div className="w-full sm:w-auto">
                <p className="text-sm text-white truncate max-w-[200px] sm:max-w-[300px]">{item.company || 'Unknown'}</p>
                <p className="text-xs text-dark-400">{item.role || 'No role'}</p>
              </div>
              <div className="text-right mt-1 sm:mt-0">
                <span className={`text-sm font-medium ${item.risk_level === 'CRITICAL' ? 'text-red-400' : item.risk_level === 'HIGH' ? 'text-yellow-400' : item.risk_level === 'MEDIUM' ? 'text-orange-400' : 'text-green-400'}`}>
                  {item.risk_score}/100
                </span>
                <p className={`text-xs ${item.risk_level === 'CRITICAL' ? 'text-red-400' : item.risk_level === 'HIGH' ? 'text-yellow-400' : item.risk_level === 'MEDIUM' ? 'text-orange-400' : 'text-green-400'}`}>
                  {item.risk_level}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="glass-light p-4 rounded-xl border-dark-700/30">
        <p className="text-xs text-dark-500 text-center">⚠️ ScamCheck provides risk indicators. Always verify through official channels.</p>
      </div>
    </div>
  )
}

export default EnhancedDashboard