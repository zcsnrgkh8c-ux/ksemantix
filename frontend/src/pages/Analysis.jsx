import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Analysis = () => {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preprocessingResults, setPreprocessingResults] = useState(null)
  const [featureResults, setFeatureResults] = useState(null)

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

  const handlePreprocess = async () => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    setLoading(true)
    try {
      const response = await api.post(`/analysis/preprocess/${selectedFile.id}`)
      setPreprocessingResults(response.data)
      toast.success('Preprocessing completed!')
    } catch (error) {
      toast.error('Preprocessing failed')
    } finally {
      setLoading(false)
    }
  }

  const handleExtractFeatures = async () => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    setLoading(true)
    try {
      const response = await api.post(`/analysis/extract-features/${selectedFile.id}`)
      setFeatureResults(response.data)
      toast.success('Feature extraction completed!')
    } catch (error) {
      toast.error('Feature extraction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Text Analysis</h1>
          <p className="text-gray-400">Preprocess and extract features from Korean text</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{file.title}</h3>
                        <p className="text-sm text-gray-400">{file.total_lines} lines</p>
                      </div>
                      <span className="text-2xl">
                        {file.file_type === 'srt' ? '📄' : file.file_type === 'json' ? '📋' : '📝'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePreprocess}
                disabled={!selectedFile || loading}
                className="w-full glass-button py-3 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Preprocess Text'}
              </button>

              <button
                onClick={handleExtractFeatures}
                disabled={!selectedFile || loading}
                className="w-full glass-button py-3 disabled:opacity-50"
              >
                {loading ? 'Extracting...' : 'Extract Features'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {preprocessingResults && (
              <div className="glass-card p-6 fade-in">
                <h2 className="text-xl font-bold text-white mb-4">
                  Preprocessing Results
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Processed Lines</p>
                    <p className="text-2xl font-bold text-primary-400">
                      {preprocessingResults.processed_count}
                    </p>
                  </div>
                </div>

                <h3 className="font-semibold text-white mb-3">Sample Results</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
                  {preprocessingResults.dialogues?.map((dialog, idx) => (
                    <div key={idx} className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Original:</span>
                          <p className="text-white mt-1">{dialog.original}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Normalized:</span>
                          <p className="text-primary-300 mt-1">{dialog.normalized}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Formality:</span>
                          <p className={dialog.is_formal ? 'text-green-400' : 'text-yellow-400'}>
                            {dialog.is_formal ? 'Formal' : 'Informal'} (Level {dialog.formality_level})
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {featureResults && (
              <div className="glass-card p-6 fade-in">
                <h2 className="text-xl font-bold text-white mb-4">
                  Feature Extraction Results
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-white mb-3">Top Words</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(featureResults.features.word_frequencies)
                        .slice(0, 20)
                        .map(([word, freq]) => (
                          <div
                            key={word}
                            className="bg-gray-800/50 p-2 rounded text-center"
                          >
                            <p className="text-sm text-white truncate">{word}</p>
                            <p className="text-xs text-primary-400">{freq}</p>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-3">Formality Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <p className="text-gray-400 text-sm">Formal Lines</p>
                        <p className="text-2xl font-bold text-green-400">
                          {featureResults.features.formality_stats.formal_count}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <p className="text-gray-400 text-sm">Informal Lines</p>
                        <p className="text-2xl font-bold text-yellow-400">
                          {featureResults.features.formality_stats.informal_count}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <p className="text-gray-400 text-sm">Avg Level</p>
                        <p className="text-2xl font-bold text-primary-400">
                          {featureResults.features.formality_stats.average_formality_level}
                        </p>
                      </div>
                    </div>
                  </div>

                  {featureResults.features.catchphrases?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-white mb-3">Catchphrases</h3>
                      <div className="flex flex-wrap gap-2">
                        {featureResults.features.catchphrases.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-accent-purple/20 text-accent-purple rounded-full text-sm"
                          >
                            {item.phrase} ({item.count})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analysis
