import React, { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Visualization = () => {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [chartType, setChartType] = useState('wordcloud')
  const [chartData, setChartData] = useState(null)

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

  const loadChartData = async (type) => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    setLoading(true)
    setChartType(type)

    try {
      let endpoint = ''
      switch (type) {
        case 'wordcloud':
          endpoint = `/visualization/word-cloud/${selectedFile.id}`
          break
        case 'sentiment':
          endpoint = `/visualization/sentiment-chart/${selectedFile.id}`
          break
        case 'character':
          endpoint = `/visualization/character-analysis/${selectedFile.id}`
          break
        case 'pos':
          endpoint = `/visualization/pos-distribution/${selectedFile.id}`
          break
        case 'relationship':
          endpoint = `/visualization/relationship-graph/${selectedFile.id}`
          break
        default:
          break
      }

      const response = await api.get(endpoint)
      setChartData(response.data)
    } catch (error) {
      toast.error('Failed to load chart data')
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
      sizeRange: [14, 80],
      rotationRange: [-45, 45],
      rotationStep: 15,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function () {
          const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#23a6d5', '#23d5ab']
          return colors[Math.floor(Math.random() * colors.length)]
        }
      },
      data: chartData?.words || []
    }]
  }

  const sentimentPieOption = {
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
      label: { show: true, color: '#fff' },
      data: chartData?.pie_data || []
    }]
  }

  const sentimentLineOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: chartData?.timeline?.map(t => t.line) || [],
      axisLabel: { color: '#fff' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#fff' }
    },
    series: [{
      type: 'line',
      smooth: true,
      data: chartData?.timeline?.map(t => t.emotion_value) || [],
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

  const posBarOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: chartData ? Object.keys(chartData.pos_counts).slice(0, 15) : [],
      axisLabel: { color: '#fff', rotate: 45 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#fff' } },
    series: [{
      type: 'bar',
      data: chartData ? Object.values(chartData.pos_counts).slice(0, 15) : [],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ]
        }
      },
      barWidth: '60%'
    }]
  }

  const characterBarOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: chartData?.dialogue_counts?.map(d => d.character) || [],
      axisLabel: { color: '#fff', rotate: 45 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#fff' } },
    series: [{
      type: 'bar',
      data: chartData?.dialogue_counts?.map(d => d.count) || [],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#10b981' },
            { offset: 1, color: '#059669' }
          ]
        }
      },
      barWidth: '60%'
    }]
  }

  const renderChart = () => {
    if (!chartData) return null

    switch (chartType) {
      case 'wordcloud':
        return (
          <ReactECharts
            option={wordCloudOption}
            style={{ height: '600px' }}
            opts={{ renderer: 'canvas' }}
          />
        )
      case 'sentiment':
        return (
          <div className="space-y-6">
            <ReactECharts
              option={sentimentPieOption}
              style={{ height: '400px' }}
              opts={{ renderer: 'canvas' }}
            />
            <ReactECharts
              option={sentimentLineOption}
              style={{ height: '300px' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        )
      case 'character':
        return (
          <ReactECharts
            option={characterBarOption}
            style={{ height: '500px' }}
            opts={{ renderer: 'canvas' }}
          />
        )
      case 'pos':
        return (
          <ReactECharts
            option={posBarOption}
            style={{ height: '500px' }}
            opts={{ renderer: 'canvas' }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Data Visualization</h1>
          <p className="text-gray-400">Interactive charts and data exploration</p>
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

            <h3 className="text-lg font-semibold text-white mb-3">Chart Types</h3>
            <div className="space-y-2">
              <button
                onClick={() => loadChartData('wordcloud')}
                disabled={!selectedFile || loading}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                ☁️ Word Cloud
              </button>
              <button
                onClick={() => loadChartData('sentiment')}
                disabled={!selectedFile || loading}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                💡 Sentiment Analysis
              </button>
              <button
                onClick={() => loadChartData('character')}
                disabled={!selectedFile || loading}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                👥 Character Stats
              </button>
              <button
                onClick={() => loadChartData('pos')}
                disabled={!selectedFile || loading}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                📊 POS Distribution
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="glass-card p-6 fade-in">
              <h2 className="text-xl font-bold text-white mb-4 capitalize">
                {chartType === 'wordcloud' ? 'Word Cloud' : 
                 chartType === 'sentiment' ? 'Sentiment Analysis' :
                 chartType === 'character' ? 'Character Statistics' :
                 'Part-of-Speech Distribution'}
              </h2>
              
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
              ) : chartData ? (
                renderChart()
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-gray-400">Select a chart type to visualize data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Visualization
