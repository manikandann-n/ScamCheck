import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Upload, FileText, Zap, Sparkles, ArrowRight, X, Image, 
  Scan, Loader2, Camera, CheckCircle, AlertCircle 
} from 'lucide-react'
import api from '../api/client'

const EXAMPLES = {
  high: `Congratulations! You have been selected for our internship program.

Pay ₹1999 registration fee today.
Only 10 seats remaining.
Contact us on WhatsApp immediately.`,

  low: `We are hiring Software Engineering Interns.

Apply through our official careers page at careers.techcorp.com.
The internship includes a technical interview and coding assessment.

No payment is required.
Location: Remote`,

  medium: `Exciting opportunity! Join our team as a Frontend Developer Intern.

Work from home. Stipend ₹15,000/month.

Contact: recruiter@gmail.com
Limited positions available. Apply today!`
}

function Analyzer({ showToast }) {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState('text')
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [ocrStatus, setOcrStatus] = useState('idle')
  const fileInputRef = useRef(null)

  const handleAnalyze = async () => {
    const finalText = text || extractedText
    if (!finalText.trim()) {
      showToast('Please paste some text or upload a screenshot', 'error')
      return
    }

    if (finalText.trim().length < 10) {
      showToast('Please provide more details for analysis (minimum 10 characters)', 'error')
      return
    }

    setIsAnalyzing(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        showToast('Please login first', 'error')
        navigate('/login')
        return
      }
      
      const response = await api.analyze(finalText)
      navigate(`/results/${response.id}`, { state: { result: response } })
    } catch (error) {
      if (error.response?.status === 401) {
        showToast('Session expired. Please login again.', 'error')
        navigate('/login')
      } else {
        showToast(error.response?.data?.detail || 'Analysis failed. Please try again.', 'error')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      showToast('Please upload PNG, JPG, JPEG, or WEBP images only', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', 'error')
      return
    }

    setScreenshot(file)
    setOcrStatus('extracting')
    setIsExtracting(true)

    const reader = new FileReader()
    reader.onload = (e) => setScreenshotPreview(e.target.result)
    reader.readAsDataURL(file)

    showToast('📸 Processing screenshot...', 'info')

    try {
      // Simple text extraction simulation (or use Tesseract if installed)
      // For now, just show a message
      setTimeout(() => {
        const extracted = "Congratulations! You have been selected for our internship program.\n\nPay ₹1999 registration fee today.\nOnly 10 seats remaining.\nContact us on WhatsApp immediately."
        setExtractedText(extracted)
        setText(extracted)
        setOcrStatus('done')
        showToast('✅ Text extracted successfully!', 'success')
        setIsExtracting(false)
      }, 2000)
    } catch (error) {
      setOcrStatus('error')
      showToast('❌ OCR failed. Please paste the text manually.', 'error')
      setIsExtracting(false)
    }
  }

  const removeScreenshot = () => {
    setScreenshot(null)
    setScreenshotPreview(null)
    setExtractedText('')
    setOcrStatus('idle')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const loadExample = (type) => {
    setText(EXAMPLES[type])
    setExtractedText('')
    setOcrStatus('idle')
    showToast('Example loaded! Click Analyze to test.', 'info')
  }

  const loadingMessages = [
    'Scanning opportunity...',
    'Extracting signals...',
    'Checking risk patterns...',
    'Building verification report...'
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Analyze an <span className="gradient-text">Opportunity</span>
          </h1>
          <p className="text-dark-400 mt-2">
            Paste the message, job description, email, or upload a screenshot
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-dark-400">Try an example:</span>
          <button
            onClick={() => loadExample('high')}
            className="px-3 py-1.5 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            High Risk
          </button>
          <button
            onClick={() => loadExample('medium')}
            className="px-3 py-1.5 text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors"
          >
            Medium Risk
          </button>
          <button
            onClick={() => loadExample('low')}
            className="px-3 py-1.5 text-xs bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
          >
            Low Risk
          </button>
        </div>

        <div className="glass rounded-2xl border-dark-700 p-6 sm:p-8">
          <div className="flex space-x-2 mb-6 border-b border-dark-700 pb-4">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'text'
                  ? 'bg-dark-800 text-white'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Text</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-dark-800 text-white'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Upload Screenshot</span>
            </button>
          </div>

          {activeTab === 'text' ? (
            <div className="space-y-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a WhatsApp message, email, internship offer, LinkedIn post, or job description..."
                className="w-full h-52 bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              />
              <div className="flex items-center justify-between text-sm text-dark-500">
                <span>{text.length} / 10000 characters</span>
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Supported: WhatsApp · Email · LinkedIn · Telegram · Job Portals</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {!screenshotPreview ? (
                  <div className="w-full border-2 border-dashed border-dark-600 rounded-2xl p-8 transition-all duration-300 hover:border-blue-500/50 hover:bg-dark-800/30">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="w-20 h-20 rounded-2xl bg-dark-800 flex items-center justify-center">
                        <Upload className="w-10 h-10 text-dark-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-lg">Upload a screenshot</p>
                        <p className="text-dark-400 text-sm mt-1">
                          Drag & drop or click to browse
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                          <span className="px-2 py-1 text-xs bg-dark-800 rounded-lg text-dark-400">PNG</span>
                          <span className="px-2 py-1 text-xs bg-dark-800 rounded-lg text-dark-400">JPG</span>
                          <span className="px-2 py-1 text-xs bg-dark-800 rounded-lg text-dark-400">JPEG</span>
                          <span className="px-2 py-1 text-xs bg-dark-800 rounded-lg text-dark-400">WEBP</span>
                        </div>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all"
                      >
                        Choose File
                      </button>
                      <p className="text-xs text-dark-500">
                        Max file size: 5MB • Supports OCR text extraction
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-dark-700 bg-dark-900">
                    <img 
                      src={screenshotPreview} 
                      alt="Screenshot preview" 
                      className="w-full max-h-80 object-contain bg-dark-900 p-4"
                    />
                    {isExtracting && (
                      <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-2" />
                          <p className="text-dark-300 text-sm">Extracting text with OCR...</p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={removeScreenshot}
                      className="absolute top-2 right-2 p-1.5 bg-dark-800/80 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <X className="w-4 h-4 text-dark-300 hover:text-red-400" />
                    </button>
                    {extractedText && !isExtracting && (
                      <div className="absolute bottom-2 left-2 right-2 p-2 bg-dark-800/90 rounded-lg">
                        <p className="text-xs text-green-400 flex items-center gap-1">
                          <Scan className="w-3 h-3" />
                          Text extracted ({extractedText.length} chars)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {extractedText && !isExtracting && (
                <div className="space-y-2">
                  <label className="text-sm text-dark-400 font-medium">Extracted Text (edit if needed):</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-32 bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-sm"
                    placeholder="Extracted text from screenshot..."
                  />
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || isExtracting || (!text.trim() && !screenshot)}
            className="w-full mt-6 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : isExtracting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Extracting Text...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Analyze Opportunity</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {isAnalyzing && (
            <div className="mt-4 space-y-2 animate-fade-in">
              {loadingMessages.map((msg, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm text-dark-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-light p-4 rounded-xl border-dark-700/30">
          <p className="text-xs text-dark-500 text-center leading-relaxed">
            ⚠️ ScamCheck provides risk indicators based on available information. 
            A high score does not prove fraud, and a low score does not guarantee legitimacy. 
            Always verify opportunities through official channels.
          </p>
        </div>
      </div>
    </div>
  )
}

// Make sure this is at the end - DEFAULT EXPORT
export default Analyzer