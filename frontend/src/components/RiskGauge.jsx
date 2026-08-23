import React, { useEffect, useState } from 'react'

function RiskGauge({ score, level }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const duration = 1500
    const startTime = performance.now()
    const startValue = 0
    const endValue = score

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(startValue + (endValue - startValue) * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [score])

  const getColor = (s) => {
    if (s >= 80) return '#ef4444'
    if (s >= 60) return '#f59e0b'
    if (s >= 30) return '#fbbf24'
    return '#10b981'
  }

  const getLevelColor = (lvl) => {
    const colors = { CRITICAL: 'text-red-400', HIGH: 'text-yellow-400', MEDIUM: 'text-orange-400', LOW: 'text-green-400' }
    return colors[lvl] || colors.LOW
  }

  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="relative inline-flex flex-col items-center w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
      <div className="relative w-full h-full">
        <svg width="100%" height="100%" viewBox="0 0 220 220" className="transform -rotate-90">
          <circle cx="110" cy="110" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="12" />
          <circle cx="110" cy="110" r={radius} fill="none" stroke={getColor(animatedScore)} strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-100" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl sm:text-4xl font-bold ${getLevelColor(level)}`}>{animatedScore}</span>
          <span className="text-xs text-dark-400 font-medium">/ 100</span>
          <span className={`text-sm font-semibold mt-1 ${getLevelColor(level)}`}>{level}</span>
        </div>
      </div>
      <span className="text-xs text-dark-500 mt-2 font-medium">RISK SCORE</span>
    </div>
  )
}

export default RiskGauge