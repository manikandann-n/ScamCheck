import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Copy, Check, AlertTriangle, Shield, FileText, 
  Download, Mail, Share2, Printer 
} from 'lucide-react'
import RiskGauge from './RiskGauge'
import jsPDF from 'jspdf'

function Results({ showToast }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [copying, setCopying] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const result = location.state?.result

  useEffect(() => {
    if (!result) {
      navigate('/analyze')
    }
  }, [result, navigate])

  if (!result) return null

  const getRiskColor = (level) => {
    const colors = {
      CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
      HIGH: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      MEDIUM: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      LOW: 'text-green-400 bg-green-500/10 border-green-500/30'
    }
    return colors[level] || colors.LOW
  }

  // Generate report text for copying
  const generateReportText = () => {
    const lines = [
      '═══════════════════════════════════════',
      '        SCAMCHECK VERIFICATION REPORT',
      '═══════════════════════════════════════',
      '',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '📋 OPPORTUNITY OVERVIEW',
      '────────────────────────',
      `Company: ${result.company || 'Not detected'}`,
      `Role: ${result.role || 'Not detected'}`,
      `Location: ${result.location || 'Not detected'}`,
      `Salary: ${result.salary || 'Not detected'}`,
      `Source: ${result.source || 'Not detected'}`,
      `Contact: ${result.contact || 'Not detected'}`,
      `Website: ${result.website || 'Not detected'}`,
      '',
      '🎯 RISK ASSESSMENT',
      '────────────────────────',
      `Risk Score: ${result.risk_score}/100`,
      `Risk Level: ${result.risk_level}`,
      '',
      '✅ VERIFICATION CHECKLIST',
      '────────────────────────',
    ]

    result.verification.forEach(v => {
      const statusMap = {
        '✅': '✓ PASS',
        '⚠️': '⚠ WARNING',
        '🔴': '✗ FAIL'
      }
      lines.push(`${statusMap[v.status] || v.status}  ${v.label}: ${v.detail}`)
    })

    if (result.indicators && result.indicators.length > 0) {
      lines.push('', '⚠️ WARNING INDICATORS', '────────────────────────')
      result.indicators.forEach(indicator => {
        lines.push(`  ${indicator.icon} ${indicator.title} (${indicator.severity})`)
        lines.push(`    ${indicator.description}`)
        if (indicator.evidence) {
          lines.push(`    Evidence: "${indicator.evidence}"`)
        }
        if (indicator.recommendation) {
          lines.push(`    💡 ${indicator.recommendation}`)
        }
        lines.push('')
      })
    }

    lines.push('💡 RECOMMENDATION', '────────────────────────')
    lines.push(result.recommendation)
    lines.push('', '═══════════════════════════════════════')
    lines.push('⚠️ DISCLAIMER')
    lines.push('ScamCheck provides risk indicators based on available information.')
    lines.push('A high score does not prove fraud, and a low score does not')
    lines.push('guarantee legitimacy. Always verify opportunities through')
    lines.push('official channels.')
    lines.push('═══════════════════════════════════════')

    return lines.join('\n')
  }

  // Copy Report to Clipboard
  const handleCopyReport = async () => {
    setCopying(true)
    try {
      const reportText = generateReportText()
      await navigator.clipboard.writeText(reportText)
      setCopied(true)
      showToast('📋 Report copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      const textarea = document.createElement('textarea')
      textarea.value = generateReportText()
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      showToast('📋 Report copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 3000)
    } finally {
      setCopying(false)
    }
  }

  // Download PDF Report
  const handleDownloadPDF = () => {
    setDownloading(true)
    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      let yPos = 25

      const checkNewPage = () => {
        if (yPos > pageHeight - 30) {
          doc.addPage()
          yPos = 25
          return true
        }
        return false
      }

      // === HEADER ===
      doc.setFontSize(28)
      doc.setTextColor(99, 102, 241)
      doc.text('SCAMCHECK', pageWidth / 2, yPos, { align: 'center' })
      yPos += 12

      doc.setFontSize(18)
      doc.setTextColor(167, 139, 250)
      doc.text('Verification Report', pageWidth / 2, yPos, { align: 'center' })
      yPos += 10

      doc.setFontSize(10)
      doc.setTextColor(150, 150, 150)
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' })
      yPos += 12

      doc.setDrawColor(50, 50, 50)
      doc.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 8

      // === RISK ASSESSMENT ===
      doc.setFontSize(14)
      doc.setTextColor(99, 102, 241)
      doc.text('RISK ASSESSMENT', margin, yPos)
      yPos += 8

      doc.setFillColor(30, 30, 40)
      doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 3, 3, 'F')

      doc.setFontSize(20)
      doc.setTextColor(255, 255, 255)
      doc.text(`Score: ${result.risk_score}/100`, margin + 10, yPos + 17)

      const riskColor = result.risk_level === 'CRITICAL' ? [239, 68, 68] :
                        result.risk_level === 'HIGH' ? [245, 158, 11] :
                        result.risk_level === 'MEDIUM' ? [251, 191, 36] :
                        [16, 185, 129]
      doc.setTextColor(riskColor[0], riskColor[1], riskColor[2])
      doc.text(`Level: ${result.risk_level}`, margin + 100, yPos + 17)

      yPos += 32
      doc.setDrawColor(50, 50, 50)
      doc.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 8

      // === OPPORTUNITY OVERVIEW ===
      checkNewPage()
      doc.setFontSize(14)
      doc.setTextColor(99, 102, 241)
      doc.text('OPPORTUNITY OVERVIEW', margin, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setTextColor(200, 200, 200)
      const overviewData = [
        ['Company', result.company || 'Not detected'],
        ['Role', result.role || 'Not detected'],
        ['Location', result.location || 'Not detected'],
        ['Salary', result.salary || 'Not detected'],
        ['Source', result.source || 'Not detected'],
        ['Contact', result.contact || 'Not detected'],
        ['Website', result.website || 'Not detected']
      ]

      overviewData.forEach(([label, value]) => {
        doc.setTextColor(150, 150, 150)
        doc.text(`${label}:`, margin + 5, yPos)
        doc.setTextColor(200, 200, 200)
        doc.text(value, margin + 55, yPos)
        yPos += 7
      })

      yPos += 5
      checkNewPage()
      doc.setDrawColor(50, 50, 50)
      doc.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 8

      // === VERIFICATION CHECKLIST ===
      doc.setFontSize(14)
      doc.setTextColor(99, 102, 241)
      doc.text('VERIFICATION CHECKLIST', margin, yPos)
      yPos += 8

      doc.setFontSize(9)
      result.verification.forEach(v => {
        checkNewPage()
        const statusSymbol = v.status === '✅' ? '✓' : v.status === '⚠️' ? '⚠' : '✗'
        const statusColor = v.status === '✅' ? [16, 185, 129] : 
                           v.status === '⚠️' ? [251, 191, 36] : [239, 68, 68]
        
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
        doc.text(statusSymbol, margin + 5, yPos)
        doc.setTextColor(200, 200, 200)
        doc.text(`${v.label}:`, margin + 15, yPos)
        doc.setTextColor(150, 150, 150)
        doc.text(v.detail, margin + 65, yPos)
        yPos += 7
      })

      yPos += 5
      checkNewPage()
      doc.setDrawColor(50, 50, 50)
      doc.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 8

      // === WARNING INDICATORS ===
      if (result.indicators && result.indicators.length > 0) {
        doc.setFontSize(14)
        doc.setTextColor(99, 102, 241)
        doc.text('WARNING INDICATORS', margin, yPos)
        yPos += 8

        result.indicators.forEach((indicator, index) => {
          checkNewPage()

          const severityColor = indicator.severity === 'CRITICAL' ? [239, 68, 68] :
                               indicator.severity === 'HIGH' ? [245, 158, 11] :
                               indicator.severity === 'MEDIUM' ? [251, 191, 36] :
                               [16, 185, 129]

          doc.setFontSize(11)
          doc.setTextColor(255, 255, 255)
          doc.text(`${indicator.icon} ${indicator.title}`, margin + 5, yPos)
          
          doc.setFontSize(9)
          doc.setTextColor(severityColor[0], severityColor[1], severityColor[2])
          doc.text(`(${indicator.severity})`, margin + 85, yPos)
          yPos += 6

          doc.setFontSize(9)
          doc.setTextColor(200, 200, 200)
          const descLines = doc.splitTextToSize(`  ${indicator.description}`, pageWidth - margin * 2 - 15)
          doc.text(descLines, margin + 5, yPos)
          yPos += (descLines.length * 5) + 3

          if (indicator.evidence) {
            doc.setFontSize(8)
            doc.setTextColor(150, 150, 150)
            const eviLines = doc.splitTextToSize(`  Evidence: "${indicator.evidence}"`, pageWidth - margin * 2 - 15)
            doc.text(eviLines, margin + 5, yPos)
            yPos += (eviLines.length * 4) + 2
          }

          if (indicator.recommendation) {
            doc.setFontSize(8)
            doc.setTextColor(99, 102, 241)
            const recLines = doc.splitTextToSize(`  💡 ${indicator.recommendation}`, pageWidth - margin * 2 - 15)
            doc.text(recLines, margin + 5, yPos)
            yPos += (recLines.length * 4) + 2
          }

          yPos += 3
          if (index < result.indicators.length - 1) {
            doc.setDrawColor(40, 40, 40)
            doc.line(margin + 5, yPos, pageWidth - margin - 5, yPos)
            yPos += 4
          }
        })

        yPos += 5
        checkNewPage()
        doc.setDrawColor(50, 50, 50)
        doc.line(margin, yPos, pageWidth - margin, yPos)
        yPos += 8
      }

      // === RECOMMENDATION ===
      doc.setFontSize(14)
      doc.setTextColor(99, 102, 241)
      doc.text('RECOMMENDATION', margin, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setTextColor(200, 200, 200)
      const recLines = doc.splitTextToSize(result.recommendation, pageWidth - margin * 2 - 10)
      doc.text(recLines, margin + 5, yPos)
      yPos += (recLines.length * 6) + 10

      checkNewPage()
      doc.setDrawColor(50, 50, 50)
      doc.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 8

      // === DISCLAIMER ===
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      const disclaimer = '⚠️ Disclaimer: ScamCheck provides risk indicators based on available information. A high score does not prove fraud, and a low score does not guarantee legitimacy. Always verify opportunities through official channels.'
      const disLines = doc.splitTextToSize(disclaimer, pageWidth - margin * 2)
      doc.text(disLines, margin, yPos)
      yPos += (disLines.length * 5) + 8

      // === FOOTER ===
      doc.setFontSize(8)
      doc.setTextColor(80, 80, 80)
      doc.text('Generated by ScamCheck AI • www.scamcheck.ai', pageWidth / 2, pageHeight - 10, { align: 'center' })

      doc.save(`ScamCheck_Report_${result.id || 'unknown'}.pdf`)
      showToast('📄 PDF downloaded successfully!', 'success')
    } catch (error) {
      console.error('PDF Error:', error)
      showToast('Failed to generate PDF. Please try again.', 'error')
    } finally {
      setDownloading(false)
    }
  }

  // Print Report
  const handlePrint = () => {
    window.print()
  }

  // Email Report
  const handleEmail = () => {
    const subject = encodeURIComponent(`ScamCheck Report: ${result.company || 'Opportunity'} Analysis`)
    const body = encodeURIComponent(generateReportText())
    window.location.href = `mailto:?subject=${subject}&body=${body}`
    showToast('📧 Email client opened!', 'info')
  }

  // Share Report
  const handleShare = async () => {
    const shareData = {
      title: `ScamCheck Report: ${result.company || 'Opportunity'}`,
      text: `Risk Score: ${result.risk_score}/100 (${result.risk_level})\n\n${result.recommendation.substring(0, 100)}...`,
      url: window.location.href
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        showToast('📤 Shared successfully!', 'success')
      } catch (err) {
        if (err.name !== 'AbortError') {
          showToast('Share cancelled', 'info')
        }
      }
    } else {
      const shareText = `${shareData.title}\n\n${shareData.text}`
      await navigator.clipboard.writeText(shareText)
      showToast('📋 Share text copied to clipboard!', 'success')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button - Hidden in print */}
      <button
        onClick={() => navigate('/analyze')}
        className="flex items-center space-x-2 text-dark-400 hover:text-white transition-colors mb-6 group no-print"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>New Analysis</span>
      </button>

      {/* Header - Action buttons hidden in print */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 no-print">
        <div>
          <h1 className="text-2xl font-bold">Verification Report</h1>
          <p className="text-dark-400 text-sm">
            {result.company || result.role || 'Opportunity'} • {new Date(result.created_at).toLocaleString()}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopyReport}
            disabled={copying}
            className="flex items-center space-x-2 px-4 py-2 border border-dark-600 rounded-lg text-sm text-dark-300 hover:border-dark-400 hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>Copied!</span>
              </>
            ) : copying ? (
              <>
                <div className="w-4 h-4 border-2 border-dark-400 border-t-white rounded-full animate-spin" />
                <span>Copying...</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center space-x-2 px-4 py-2 border border-dark-600 rounded-lg text-sm text-dark-300 hover:border-dark-400 hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-dark-400 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 border border-dark-600 rounded-lg text-sm text-dark-300 hover:border-dark-400 hover:text-white transition-all duration-200"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <button
            onClick={handleEmail}
            className="flex items-center space-x-2 px-4 py-2 border border-dark-600 rounded-lg text-sm text-dark-300 hover:border-dark-400 hover:text-white transition-all duration-200"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 border border-dark-600 rounded-lg text-sm text-dark-300 hover:border-dark-400 hover:text-white transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* ===== RESULTS CONTENT - Shows in print ===== */}
      <div className="space-y-6 animate-slide-up print-content">
        {/* Score Card */}
        <div className="glass rounded-2xl border-dark-700 p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-1 flex items-center justify-center">
              <RiskGauge score={result.risk_score} level={result.risk_level} />
            </div>
            <div className="col-span-2 flex flex-col justify-center space-y-3">
              <div>
                <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium border ${getRiskColor(result.risk_level)}`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{result.risk_level} RISK</span>
                </span>
              </div>
              <p className="text-dark-300 text-sm leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Opportunity Overview */}
        <div className="glass rounded-2xl border-dark-700 p-6">
          <h2 className="text-sm font-semibold text-dark-300 mb-4 flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Opportunity Overview</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Company', value: result.company || 'Not detected' },
              { label: 'Role', value: result.role || 'Not detected' },
              { label: 'Location', value: result.location || 'Not detected' },
              { label: 'Salary', value: result.salary || 'Not detected' },
              { label: 'Source', value: result.source || 'Not detected' },
              { label: 'Contact', value: result.contact || 'Not detected' },
              { label: 'Website', value: result.website || 'Not detected' },
            ].map((item, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-xs text-dark-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm text-dark-200 truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="glass rounded-2xl border-dark-700 p-6">
          <h2 className="text-sm font-semibold text-dark-300 mb-4 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Verification Checklist</span>
          </h2>
          <div className="space-y-2">
            {result.verification.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0">
                <div className="flex items-center space-x-3">
                  <span className="text-base">{item.status}</span>
                  <span className="text-sm text-dark-200">{item.label}</span>
                </div>
                <span className={`text-xs ${item.status === '✅' ? 'text-green-400' : item.status === '🔴' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {item.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Indicators */}
        {result.indicators && result.indicators.length > 0 && (
          <div className="glass rounded-2xl border-dark-700 p-6">
            <h2 className="text-sm font-semibold text-dark-300 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Warning Indicators</span>
            </h2>
            <div className="space-y-4">
              {result.indicators.map((indicator, i) => (
                <div key={i} className="p-4 rounded-xl border border-dark-700/50 bg-dark-800/30">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{indicator.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-medium text-white">{indicator.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          indicator.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          indicator.severity === 'HIGH' ? 'bg-yellow-500/20 text-yellow-400' :
                          indicator.severity === 'MEDIUM' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {indicator.severity}
                        </span>
                      </div>
                      <p className="text-sm text-dark-400 mt-1">{indicator.description}</p>
                      {indicator.evidence && (
                        <div className="mt-2 p-2 bg-dark-900/50 rounded-lg border border-dark-700/50">
                          <p className="text-xs text-dark-400 font-mono break-all">"{indicator.evidence}"</p>
                        </div>
                      )}
                      {indicator.recommendation && (
                        <p className="text-xs text-blue-400 mt-2">💡 {indicator.recommendation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
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

export default Results