import React, { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Sentiment = () => {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sentimentData, setSentimentData] = useState(null)

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      const response = await api.get('/corpus/files')
      setFiles(response.data)
    } catch (error) {
      console.error('Failed to load files:', error)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    setLoading(true)
    try {
      const response = await api.post(`/analysis/sentiment/${selectedFile.id}`)
      setSentimentData(response.data)
      toast.success('Sentiment analysis completed!')
    } catch (error) {
      toast.error('Sentiment analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const pieOption = {
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
        color: '#fff'
      },
      data: sentimentData ? Object.entries(sentimentData.sentiments.emotion_counts).map(([emotion, count]) => ({
        name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        value: count
      })) : []
    }]
  }

  const lineOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: sentimentData?.sentiments.sentiment_timeline?.map((_, idx) => idx) || [],
      axisLabel: { color: '#fff' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#fff' },
      min: -2,
      max: 2
    },
    series: [{
      type: 'line',
      smooth: true,
      data: sentimentData?.sentiments.sentiment_timeline?.map(s => {
        const map = { happy: 1, neutral: 0, sad: -1, angry: -2 }
        return map[s.emotion] || 0
      }) || [],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
          ]
        }
      },
      lineStyle: { color: '#667eea' },
      itemStyle: { color: '#667eea' }
    }]
  }

  const characterEmotionOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Happy', 'Angry', 'Sad', 'Neutral'],
      textStyle: { color: '#fff' }
    },
    xAxis: {
      type: 'category',
      data: sentimentData ? Object.keys(sentimentData.sentiments.character_emotions || {}) : [],
      axisLabel: { color: '#fff', rotate: 45 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#fff' } },
    series: [
      {
        name: 'Happy',
        type: 'bar',
        stack: 'total',
        data: sentimentData?.sentiments.character_emotions
          ? Object.values(sentimentData.sentiments.character_emotions).map(e => e.find(x => x.emotion === 'happy')?.count || 0)
          : [],
        itemStyle: { color: '#10b981' }
      },
      {
        name: 'Angry',
        type: 'bar',
        stack: 'total',
        data: sentimentData?.sentiments.character_emotions
          ? Object.values(sentimentData.sentiments.character_emotions).map(e => e.find(x => x.emotion === 'angry')?.count || 0)
          : [],
        itemStyle: { color: '#ef4444' }
      },
      {
        name: 'Sad',
        type: 'bar',
        stack: 'total',
        data: sentimentData?.sentiments.character_emotions
          ? Object.values(sentimentData.sentiments.character_emotions).map(e => e.find(x => x.emotion === 'sad')?.count || 0)
          : [],
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: 'Neutral',
        type: 'bar',
        stack: 'total',
        data: sentimentData?.sentiments.character_emotions
          ? Object.values(sentimentData.sentiments.character_emotions).map(e => e.find(x => x.emotion === 'neutral')?.count || 0)
          : [],
        itemStyle: { color: '#8b5cf6' }
      }
    ]
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Sentiment Analysis</h1>
          <p className="text-gray-400">Analyze emotions in Korean dialogues</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Select File</h2>
            
            <div className="space-y-3 mb-6">
              {files.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No files uploaded yet</p>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedFile?.id === file.id
                        ? 'bg-primary-500/20 border-2 border-primary-500'
                        : 'bg-gray-800/50 hover:bg-gray-800'
                    }`}
                  >
                    <h3 className="font-semibold text-white">{file.title}</h3>
                    <p className="text-sm text-gray-400">{file.total_lines} lines</p>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className="w-full glass-button py-3 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Sentiment'}
            </button>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {sentimentData && (
              <>
                <div className="glass-card p-6 fade-in">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Emotion Distribution
                  </h2>
                  <ReactECharts
                    option={pieOption}
                    style={{ height: '400px' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </div>

                <div className="glass-card p-6 fade-in">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Sentiment Timeline
                  </h2>
                  <ReactECharts
                    option={lineOption}
                    style={{ height: '300px' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </div>

                <div className="glass-card p-6 fade-in">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Character Emotion Analysis
                  </h2>
                  <ReactECharts
                    option={characterEmotionOption}
                    style={{ height: '400px' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </div>

                <div className="glass-card p-6 fade-in">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Emotion Statistics
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(sentimentData.sentiments.emotion_counts).map(([emotion, count]) => (
                      <div key={emotion} className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <p className="text-gray-400 text-sm capitalize">{emotion}</p>
                        <p className="text-3xl font-bold text-white mt-2">{count}</p>
                        <p className="text-primary-400 text-sm mt-1">
                          {sentimentData.sentiments.emotion_percentages[emotion]}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sentiment
