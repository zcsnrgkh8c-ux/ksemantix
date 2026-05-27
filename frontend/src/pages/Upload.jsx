import React, { useState, useRef } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Upload = () => {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)

    try {
      const response = await api.post('/corpus/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('File uploaded successfully!')
      setFile(null)
      setTitle('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    const icons = {
      srt: '📄',
      txt: '📝',
      json: '📋'
    }
    return icons[ext] || '📁'
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Corpus Collection</h1>
          <p className="text-gray-400">Upload Korean subtitle files for analysis</p>
        </div>

        <div className="glass-card p-8 mb-6 fade-in">
          <h2 className="text-xl font-bold text-white mb-6">Upload New File</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                File Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg"
                placeholder="Enter file title"
              />
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                dragOver
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-600 hover:border-primary-500'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <div>
                  <div className="text-6xl mb-4">{getFileIcon(file.name)}</div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Size: {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className="mt-4 text-red-400 hover:text-red-300"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4 opacity-50">📁</div>
                  <p className="text-white font-medium">
                    Drag and drop your file here
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    or click to browse
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".srt,.txt,.json"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="mt-6 inline-block glass-button cursor-pointer"
              >
                {file ? 'Change File' : 'Select File'}
              </label>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Supported formats:</span>
              <span className="px-2 py-1 bg-gray-700 rounded">.srt</span>
              <span className="px-2 py-1 bg-gray-700 rounded">.txt</span>
              <span className="px-2 py-1 bg-gray-700 rounded">.json</span>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full glass-button py-4 disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload and Parse'
              )}
            </button>
          </div>
        </div>

        <div className="glass-card p-8 fade-in">
          <h2 className="text-xl font-bold text-white mb-4">Upload Guidelines</h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex gap-4">
              <span className="text-2xl">📄</span>
              <div>
                <h3 className="font-semibold text-white">SRT Format</h3>
                <p className="text-sm">Standard subtitle format with timestamps</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">📝</span>
              <div>
                <h3 className="font-semibold text-white">TXT Format</h3>
                <p className="text-sm">Simple text format with character:dialogue structure</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="font-semibold text-white">JSON Format</h3>
                <p className="text-sm">Structured format with speaker, text, and timestamps</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload
