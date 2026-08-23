import React, { useState } from 'react'
import { 
  Crown, Zap, Shield, Award, Sparkles, TrendingUp,
  Globe, Users, Brain, Cpu, Lock, CheckCircle,
  Star, Gift, Rocket, Infinity
} from 'lucide-react'

function PremiumFeatures() {
  const [hoveredFeature, setHoveredFeature] = useState(null)

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning detects subtle scam patterns",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: Zap,
      title: "Real-Time Detection",
      description: "Instant analysis with sub-second response time",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Multi-Layer Security",
      description: "20+ detection layers for comprehensive protection",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Globe,
      title: "Global Intelligence",
      description: "Real-time scam database from around the world",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Community Verified",
      description: "Verified by thousands of users worldwide",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Cpu,
      title: "Quantum-Ready",
      description: "Prepared for next-generation computing",
      color: "from-red-500 to-pink-500"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass border-dark-700 p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-500/30 mb-6">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-500">PREMIUM FEATURES</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            World-Class Scam Detection
            <br />
            <span className="gradient-text">at Your Fingertips</span>
          </h2>
          
          <p className="text-dark-300 max-w-2xl mx-auto text-lg">
            ScamCheck combines cutting-edge AI, real-time intelligence, and 
            community verification to provide the most advanced scam detection 
            platform ever created.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-dark-300">#1 Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-dark-300">10K+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-dark-300">99.9% Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-dark-300">195 Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="glass rounded-2xl border-dark-700 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-dark-600"
            onMouseEnter={() => setHoveredFeature(index)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 transition-all duration-300 ${
              hoveredFeature === index ? 'scale-110 rotate-6' : ''
            }`}>
              <feature.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-dark-400">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="glass rounded-2xl border-dark-700 p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold gradient-text">10K+</p>
            <p className="text-sm text-dark-400">Opportunities Analyzed</p>
          </div>
          <div>
            <p className="text-3xl font-bold gradient-text">99.9%</p>
            <p className="text-sm text-dark-400">Detection Accuracy</p>
          </div>
          <div>
            <p className="text-3xl font-bold gradient-text">195</p>
            <p className="text-sm text-dark-400">Countries Covered</p>
          </div>
          <div>
            <p className="text-3xl font-bold gradient-text">4.9★</p>
            <p className="text-sm text-dark-400">User Rating</p>
          </div>
        </div>
      </div>

      {/* Premium CTA */}
      <div className="relative overflow-hidden rounded-3xl glass border-dark-700 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span>Ready to protect yourself?</span>
            </h3>
            <p className="text-dark-400 text-sm">Join thousands of students already using ScamCheck</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.02]">
            <Rocket className="w-4 h-4 inline mr-2" />
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  )
}

export default PremiumFeatures