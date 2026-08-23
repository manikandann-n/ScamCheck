import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import api from '../api/client'

function History({ showToast }) {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await api.getHistory()
      setItems(data.items || [])
    } catch (error) {
      showToast('Failed to load history', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-dark-400">Loading...</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Analysis History</h1>
      {items.length === 0 ? (
        <div className="glass rounded-2xl border-dark-700 p-12 text-center">
          <Calendar className="w-12 h-12 text-dark-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">No analyses yet</h3>
          <p className="text-dark-400 text-sm">Start by analyzing an opportunity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="glass rounded-2xl border-dark-700 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">{item.company || 'Unknown'}</h3>
                  <p className="text-sm text-dark-400">{item.role || 'No role specified'}</p>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${
                    item.risk_level === 'CRITICAL' ? 'text-red-400' :
                    item.risk_level === 'HIGH' ? 'text-yellow-400' :
                    item.risk_level === 'MEDIUM' ? 'text-orange-400' :
                    'text-green-400'
                  }`}>
                    {item.risk_score}/100
                  </span>
                  <p className="text-xs text-dark-400">{item.risk_level}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History