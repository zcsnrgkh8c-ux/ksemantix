import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_files: 0,
    total_lines: 0,
    top_words: [],
    sentiment_distribution: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const response = await api.get('/analysis/dashboard-stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const wordCloudOption = {
    tooltip: {
      show: true,
      formatter: (params) => `${params.name}: ${params.value}`
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '90%',
      height: '90%',
      sizeRange: [14, 60],
      rotationRange: [-45, 45],
      rotationStep: 15,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function () {
          return 'rgb(' + [
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160)
          ].join(',') + ')';
        }
      },
      data: stats.top_words.map(w => ({
        name: w.word,
        value: w.frequency
      }))
    }]
  }

  const sentimentOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#fff' }
    },
    color: ['#10b981', '#ef4444', '#3b82f6', '#8b5cf6'],
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {d}%'
      },
      data: Object.entries(stats.sentiment_distribution).map(([emotion, count]) => ({
        name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        value: count
      }))
    }]
  }

  const animatedNumber = (value) => {
    return value.toLocaleString()
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">K-Semantix AI Dashboard</h1>
          <p className="text-gray-400">Korean Semantic Analysis Platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Files</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {loading ? '...' : animatedNumber(stats.total_files)}
                </p>
              </div>
              <div className="text-4xl opacity-20">📁</div>
            </div>
          </div>

          <div className="glass-card p-6 fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Dialogues</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {loading ? '...' : animatedNumber(stats.total_lines)}
                </p>
              </div>
              <div className="text-4xl opacity-20">💬</div>
            </div>
          </div>

          <div className="glass-card p-6 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unique Words</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {loading ? '...' : animatedNumber(stats.top_words.length)}
                </p>
              </div>
              <div className="text-4xl opacity-20">📊</div>
            </div>
          </div>

          <div className="glass-card p-6 fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">System Status</p>
                <p className="text-xl font-bold text-green-400 mt-2">Online</p>
              </div>
              <div className="text-4xl opacity-20">✅</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6 fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Word Frequency</h2>
            <ReactECharts
              option={wordCloudOption}
              style={{ height: '400px' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>

          <div className="glass-card p-6 fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Emotion Distribution</h2>
            <ReactECharts
              option={sentimentOption}
              style={{ height: '400px' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/upload" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="text-center">
              <div className="text-5xl mb-4">📤</div>
              <h3 className="text-lg font-semibold text-white">Upload Files</h3>
              <p className="text-gray-400 text-sm mt-2">Upload subtitle files</p>
            </div>
          </Link>

          <Link to="/analysis" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-white">Analysis</h3>
              <p className="text-gray-400 text-sm mt-2">Text preprocessing</p>
            </div>
          </Link>

          <Link to="/sentiment" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="text-center">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-lg font-semibold text-white">Sentiment</h3>
              <p className="text-gray-400 text-sm mt-2">Emotion analysis</p>
            </div>
          </Link>

          <Link to="/visualization" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-lg font-semibold text-white">Visualization</h3>
              <p className="text-gray-400 text-sm mt-2">Data charts</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
