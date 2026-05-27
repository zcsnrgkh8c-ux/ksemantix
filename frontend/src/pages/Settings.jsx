import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const handleExportPDF = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/export/pdf-report/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report_${fileId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Report exported successfully!')
      }
    } catch (error) {
      toast.error('Failed to export report')
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and export reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="glass-card p-4 fade-in">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'profile'
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'hover:bg-gray-800'
                }`}
              >
                👤 Profile
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'export'
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'hover:bg-gray-800'
                }`}
              >
                📄 Export Reports
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'about'
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'hover:bg-gray-800'
                }`}
              >
                ℹ️ About
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="glass-card p-6 fade-in">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <label className="text-gray-400 text-sm">Username</label>
                    <p className="text-white text-lg">{user?.username}</p>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <label className="text-gray-400 text-sm">Email</label>
                    <p className="text-white text-lg">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="glass-card p-6 fade-in">
                <h2 className="text-2xl font-bold text-white mb-6">Export Analysis Reports</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">PDF Report</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Export a comprehensive PDF report including word frequencies, 
                      sentiment analysis, character statistics, and AI-powered summaries.
                    </p>
                    <button
                      onClick={() => toast.success('Select a file from the files list to export')}
                      className="glass-button"
                    >
                      Download PDF Report
                    </button>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">JSON Data Export</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Export raw analysis data in JSON format for further processing.
                    </p>
                    <button
                      onClick={() => toast.success('Select a file to export JSON')}
                      className="glass-button"
                    >
                      Download JSON Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="glass-card p-6 fade-in">
                <h2 className="text-2xl font-bold text-white mb-6">About K-Semantix AI</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Platform Overview</h3>
                    <p className="text-gray-300">
                      K-Semantix AI is a Korean Semantic Analysis Platform designed for analyzing 
                      Korean drama and movie subtitles. It provides comprehensive NLP tools for 
                      text preprocessing, sentiment analysis, and semantic correlation analysis.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-2">Core Features</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Corpus Collection - Upload and parse subtitle files</li>
                      <li>Text Preprocessing - Korean text normalization and tokenization</li>
                      <li>Language Feature Extraction - Word frequency, POS tagging</li>
                      <li>Sentiment Analysis - Emotion classification using AI models</li>
                      <li>Semantic Analysis - Character relationship networks</li>
                      <li>Data Visualization - Interactive charts and dashboards</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-2">Technology Stack</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-800/50 p-3 rounded">
                        <span className="text-gray-400">Frontend:</span>
                        <p className="text-white">React + Vite + TailwindCSS</p>
                      </div>
                      <div className="bg-gray-800/50 p-3 rounded">
                        <span className="text-gray-400">Backend:</span>
                        <p className="text-white">Python Flask</p>
                      </div>
                      <div className="bg-gray-800/50 p-3 rounded">
                        <span className="text-gray-400">Database:</span>
                        <p className="text-white">SQLite</p>
                      </div>
                      <div className="bg-gray-800/50 p-3 rounded">
                        <span className="text-gray-400">NLP:</span>
                        <p className="text-white">KoNLPy + Transformers</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-500/10 p-6 rounded-lg border border-primary-500/30">
                    <h3 className="font-semibold text-primary-400 mb-2">AI-Powered Analysis</h3>
                    <p className="text-gray-300 text-sm">
                      This platform uses state-of-the-art NLP models including KoNLPy for Korean 
                      language processing, and transformer-based models for sentiment analysis 
                      and semantic similarity calculations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
