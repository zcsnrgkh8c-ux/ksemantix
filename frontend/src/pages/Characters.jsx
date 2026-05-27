import React, { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Characters = () => {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [characterData, setCharacterData] = useState(null)

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
      const response = await api.post(`/analysis/semantic/${selectedFile.id}`)
      setCharacterData(response.data)
      toast.success('Character analysis completed!')
    } catch (error) {
      toast.error('Character analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const dialogueChartOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: characterData?.semantic?.character_patterns
        ? Object.keys(characterData.semantic.character_patterns)
        : [],
      axisLabel: { color: '#fff', rotate: 45 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#fff' } },
    series: [{
      type: 'bar',
      data: characterData?.semantic?.character_patterns
        ? Object.values(characterData.semantic.character_patterns).map(p => p.total_lines)
        : [],
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

  const radarOption = {
    tooltip: {},
    radar: {
      indicator: characterData?.semantic?.character_patterns
        ? Object.keys(characterData.semantic.character_patterns).slice(0, 8).map(char => ({
            name: char,
            max: 100
          }))
        : [],
      axisName: { color: '#fff' }
    },
    series: [{
      type: 'radar',
      data: [{
        value: characterData?.semantic?.character_patterns
          ? Object.values(characterData.semantic.character_patterns).slice(0, 8).map(p => 
              Math.round((p.total_lines / (Object.values(characterData.semantic.character_patterns)[0]?.total_lines || 1)) * 100)
            )
          : [],
        name: 'Character Presence',
        itemStyle: { color: '#667eea' },
        areaStyle: { color: 'rgba(102, 126, 234, 0.3)' }
      }]
    }]
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Character Analysis</h1>
          <p className="text-gray-400">Analyze character speech patterns and relationships</p>
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
              {loading ? 'Analyzing...' : 'Analyze Characters'}
            </button>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {characterData && (
              <>
                <div className="glass-card p-6 fade-in">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Dialogue Distribution by Character
                  </h2>
                  <ReactECharts
                    option={dialogueChartOption}
                    style={{ height: '400px' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </div>

                <div className="glass-card p-6 fade-in">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Character Presence Radar
                  </h2>
                  <ReactECharts
                    option={radarOption}
                    style={{ height: '400px' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </div>

                <div className="glass-card p-6 fade-in">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Character Speech Patterns
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {characterData.semantic?.character_patterns && 
                      Object.entries(characterData.semantic.character_patterns).map(([char, pattern]) => (
                        <div key={char} className="bg-gray-800/50 p-4 rounded-lg">
                          <h3 className="font-semibold text-white mb-2">{char}</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Lines:</span>
                              <span className="text-primary-400">{pattern.total_lines}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Avg Length:</span>
                              <span className="text-primary-400">
                                {Math.round(pattern.avg_length)} chars
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Formal:</span>
                              <span className="text-green-400">
                                {pattern.formality_distribution?.formal || 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Informal:</span>
                              <span className="text-yellow-400">
                                {pattern.formality_distribution?.informal || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                {characterData.semantic?.relationships && (
                  <div className="glass-card p-6 fade-in">
                    <h2 className="text-xl font-bold text-white mb-4">
                      Character Relationships
                    </h2>
                    <div className="space-y-3">
                      {Object.entries(characterData.semantic.relationships)
                        .filter(([_, rels]) => rels.length > 0)
                        .map(([char, rels]) => (
                          <div key={char} className="bg-gray-800/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-white mb-2">{char}</h3>
                            <div className="flex flex-wrap gap-2">
                              {rels.map((rel, idx) => (
                                <span
                                  key={idx}
                                  className={`px-3 py-1 rounded-full text-sm ${
                                    rel.type === 'very_close' ? 'bg-green-500/20 text-green-400' :
                                    rel.type === 'close' ? 'bg-blue-500/20 text-blue-400' :
                                    rel.type === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}
                                >
                                  {rel.character} ({Math.round(rel.similarity * 100)}%)
                                </span>
                              ))}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Characters
