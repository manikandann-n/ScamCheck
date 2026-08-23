import React from 'react'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

function Logo({ size = 'default', showTagline = true }) {
  const sizes = {
    small: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      tagline: 'text-[10px]'
    },
    default: {
      icon: 'w-8 h-8',
      text: 'text-xl',
      tagline: 'text-xs'
    },
    large: {
      icon: 'w-12 h-12',
      text: 'text-3xl',
      tagline: 'text-sm'
    }
  }

  const currentSize = sizes[size] || sizes.default

  return (
    <Link to="/" className="flex items-center space-x-3 group">
      {/* Logo Icon */}
      <div className={`${currentSize.icon} rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:shadow-purple-600/40 transition-all duration-300 group-hover:scale-105`}>
        <Shield className="w-[60%] h-[60%] text-white" />
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1">
          <span className={`${currentSize.text} font-extrabold tracking-tight text-white`}>
            SCAM
          </span>
          <span className={`${currentSize.text} font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`}>
            CHECK
          </span>
          <span className="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md border border-blue-500/20">
            AI
          </span>
        </div>
        {showTagline && (
          <span className={`${currentSize.tagline} text-dark-400 font-light tracking-wider`}>
            Verify before you trust.
          </span>
        )}
      </div>
    </Link>
  )
}

export default Logo