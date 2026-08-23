import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Brain, BarChart3, CheckCircle, AlertTriangle, Lock } from 'lucide-react'
import Logo from './Logo'

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center space-x-2 bg-dark-800/50 border border-dark-700 rounded-full px-4 py-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-dark-300 font-medium">Student Opportunity Verification</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                Before you apply.
                <br />
                <span className="gradient-text">Make sure it's real.</span>
              </h1>

              <p className="text-lg text-dark-300 leading-relaxed max-w-lg">
                ScamCheck analyzes internship and job opportunities for suspicious patterns, 
                financial demands, fake recruiter signals, risky links, urgency tactics, 
                and other warning signs.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/analyze"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.02]"
                >
                  Analyze an Opportunity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center px-6 py-3 border border-dark-600 rounded-lg font-medium text-dark-300 transition-all duration-300 hover:border-dark-400 hover:text-white"
                >
                  See How It Works
                </Link>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-dark-400">Free to use</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-dark-400">Privacy first</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-dark-400">Real-time analysis</span>
                </div>
              </div>
            </div>

            {/* Right Visual with Logo */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl border border-dark-700/50 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-6 w-3/4">
                    <div className="flex justify-center">
                      <Logo size="large" showTagline={true} />
                    </div>
                    <div className="glass p-4 rounded-xl border-dark-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-sm text-dark-300">Analyzing Opportunity...</span>
                      </div>
                    </div>
                    <div className="glass p-4 rounded-xl border-dark-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <span className="text-sm text-dark-300">Detected: 3 risk signals</span>
                      </div>
                    </div>
                    <div className="glass p-4 rounded-xl border-dark-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <span className="text-sm text-dark-300">Risk Score: 87/100</span>
                      </div>
                    </div>
                    <div className="glass p-4 rounded-xl border-dark-600 bg-red-500/10 border-red-500/30">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400 font-medium">High Risk — Do not proceed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-dark-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How <span className="gradient-text">ScamCheck</span> Works
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Three simple steps to verify any opportunity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-2xl border-dark-700 card-hover text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-600/10 border border-blue-600/20 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Paste & Analyze</h3>
            <p className="text-dark-400 text-sm">
              Paste any opportunity text or upload a screenshot. ScamCheck scans for warning signs.
            </p>
          </div>

          <div className="glass p-8 rounded-2xl border-dark-700 card-hover text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-600/10 border border-purple-600/20 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Get Risk Score</h3>
            <p className="text-dark-400 text-sm">
              Receive an explainable risk score with detailed breakdown of each warning indicator.
            </p>
          </div>

          <div className="glass p-8 rounded-2xl border-dark-700 card-hover text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-600/20 to-pink-600/10 border border-pink-600/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verify & Decide</h3>
            <p className="text-dark-400 text-sm">
              Get actionable recommendations and a verification checklist to make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="glass p-6 rounded-2xl border-dark-700/50">
          <p className="text-xs text-dark-500 text-center leading-relaxed">
            ⚠️ ScamCheck provides risk indicators based on available information. 
            A high score does not prove fraud, and a low score does not guarantee legitimacy. 
            Always verify opportunities through official channels.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Landing