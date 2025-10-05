import { useState } from 'react'
import axios from 'axios'
import FileUpload from '../components/FileUpload'
import ImagePreview from '../components/ImagePreview'
import LoadingSpinner from '../components/LoadingSpinner'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import ModelDropdown from '../components/ModelDropdown'
import FullscreenViewer from '../components/FullscreenViewer'
import { Settings, Image as ImageIcon, AlertCircle, CheckCircle, Download, Zap, Maximize2, Expand, Satellite, Upload, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Tooltip from '../components/Tooltip'
import { useTheme } from '../contexts/ThemeContext'

const DustStormDetection = () => {
  const { isDark } = useTheme()
  const [selectedImages, setSelectedImages] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedModel, setSelectedModel] = useState('best.pt')
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('slider') // 'slider' or 'sidebyside'
  const [showFullscreenViewer, setShowFullscreenViewer] = useState(false)
  const [fullscreenStartIndex, setFullscreenStartIndex] = useState(0)

  const models = {
    'best.pt': 'Best Model',
    'last.pt': 'Last Model'
  }

  const handleImageSelect = (files) => {
    setSelectedImages(Array.isArray(files) ? files : [files])
    setResults([])
    setError(null)
    setUploadProgress(0)
  }

  const handleDetect = async () => {
    if (selectedImages.length === 0) {
      setError('Please select at least one image')
      return
    }

    setLoading(true)
    setError(null)
    setUploadProgress(0)
    const newResults = []

    try {
      const totalImages = selectedImages.length
      for (let i = 0; i < totalImages; i++) {
        const image = selectedImages[i]
        const formData = new FormData()
        formData.append('image', image)
        formData.append('model', selectedModel)

        const response = await axios.post('http://localhost:8000/api/detect', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              ((i + progressEvent.loaded / progressEvent.total) / totalImages) * 100
            )
            setUploadProgress(percentCompleted)
          },
        })

        newResults.push({
          originalImage: URL.createObjectURL(image),
          resultImage: `data:image/png;base64,${response.data.image}`,
          detections: response.data.detections,
          filename: image.name,
        })
      }

      setResults(newResults)
      setUploadProgress(100)
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during detection')
      console.error('Detection error:', err)
    } finally {
      setLoading(false)
    }
  }

  const downloadAllResults = () => {
    results.forEach((result, index) => {
      const link = document.createElement('a')
      link.href = result.resultImage
      link.download = `detection-result-${index + 1}.png`
      link.click()
    })
  }

  const openFullscreenViewer = (startIndex = 0) => {
    setFullscreenStartIndex(startIndex)
    setShowFullscreenViewer(true)
    document.body.style.overflow = 'hidden'
  }

  const closeFullscreenViewer = () => {
    setShowFullscreenViewer(false)
    document.body.style.overflow = 'auto'
  }

  const totalDetections = results.reduce((sum, r) => sum + r.detections.length, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="card">
        <h1 className="text-4xl font-bold text-theme-primary mb-2 flex items-center">
          <Zap className="h-10 w-10 mr-3 text-mars-500" />
          Dust Storm Detection
        </h1>
        <p className="text-theme-muted">Upload satellite images for AI-powered dust storm analysis</p>
      </div>

      {/* Controls Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Model Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center text-theme-primary">
            <Settings className="h-5 w-5 mr-2 text-mars-500" />
            Model Selection
          </h2>
          <div className="relative">
            <label className="block text-sm font-medium mb-3 text-theme-secondary flex items-center">
              <span className="mr-2">Choose Model</span>
              <span className="text-xs text-theme-muted bg-mars-500/20 px-2 py-0.5 rounded-full border border-mars-500/30">
                YOLOv8
              </span>
            </label>
            <ModelDropdown
              value={selectedModel}
              onChange={setSelectedModel}
              models={models}
            />
            {/* Model info badges */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-theme-muted">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Model Loaded</span>
              </div>
              <div className="text-theme-muted bg-black/30 px-2 py-1 rounded border border-white/10">
                {selectedModel === 'best.pt' ? 'Optimized Performance' : 'Latest Training'}
              </div>
            </div>
          </div>

          {/* Detect Button */}
          {selectedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 space-y-3"
            >
              <button
                onClick={handleDetect}
                disabled={loading}
                className="w-full bg-gradient-to-r from-mars-600 via-orange-600 to-mars-700 hover:from-mars-700 hover:via-orange-700 hover:to-mars-800 disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-mars-500/50 transform hover:scale-105 disabled:transform-none relative overflow-hidden"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Detecting...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Detect Dust Storms ({selectedImages.length} image{selectedImages.length > 1 ? 's' : ''})
                  </>
                )}
              </button>
              
              {/* Upload Progress Bar */}
              <AnimatePresence>
                {loading && uploadProgress > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5 text-theme-muted">
                      <span>Processing images...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden bg-black/40">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-gradient-to-r from-mars-500 via-orange-500 to-red-500 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* Image Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card h-full"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center text-theme-primary">
            <ImageIcon className="h-5 w-5 mr-2 text-mars-500" />
            Upload Satellite Images
          </h2>
          
          <div className="min-h-[280px] flex flex-col">
            {selectedImages.length === 0 ? (
              <FileUpload
                onFileSelect={handleImageSelect}
                accept=".jpg,.jpeg,.png"
                multiple={true}
                label="Choose satellite images"
              />
            ) : (
              <div className="space-y-3 flex-1">
                {/* Display selected images */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {selectedImages.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/10"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <ImageIcon className="h-5 w-5 text-mars-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-theme-primary truncate">{image.name}</p>
                          <p className="text-xs text-theme-muted">{(image.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Summary and Clear button */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                  <div className="text-sm text-theme-muted">
                    <p className="font-medium">{selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected</p>
                    <p className="text-xs">Total size: {(selectedImages.reduce((sum, img) => sum + img.size, 0) / 1024).toFixed(2)} KB</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedImages([])
                      setResults([])
                      setError(null)
                      setUploadProgress(0)
                    }}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 hover:border-red-500/70 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 text-sm font-medium transform hover:scale-105"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card bg-red-900/20 border-red-500/50"
              >
            <div className="flex items-center space-x-3 text-red-400">
              <AlertCircle className="h-6 w-6 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && <LoadingSpinner message="Analyzing satellite imagery..." />}

      {/* Results Summary */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-4 gap-4"
          >
            <div className="card">
              <h3 className="text-sm font-medium text-blue-300 mb-1">Images Analyzed</h3>
              <p className="text-3xl font-bold text-white">{results.length}</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-green-300 mb-1">Total Detections</h3>
              <p className="text-3xl font-bold text-white">{totalDetections}</p>
            </div>
            <div className="card">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openFullscreenViewer(0)}
                className="w-full h-full flex flex-col items-center justify-center text-mars-400 hover:text-mars-300"
              >
                <Expand className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Fullscreen View</span>
              </motion.button>
            </div>
            <div className="card">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadAllResults}
                className="w-full h-full flex flex-col items-center justify-center text-purple-300 hover:text-purple-200"
              >
                <Download className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Download All</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detection Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <div className="space-y-8">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center bg-mars-500/20 text-mars-400 rounded-full mr-3 font-bold">
                      {index + 1}
                    </span>
                    {result.filename}
                  </h3>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className={`px-4 py-2 rounded-full font-semibold border ${
                      result.detections.length > 0
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {result.detections.length} detection{result.detections.length !== 1 ? 's' : ''}
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex items-center space-x-2 rounded-lg p-1 bg-black/30 border border-white/10">
                      <button
                        onClick={() => setViewMode('slider')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          viewMode === 'slider'
                            ? 'bg-mars-600 text-white'
                            : isDark
                              ? 'text-gray-400 hover:text-white'
                              : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Maximize2 className="h-4 w-4 inline mr-1" />
                        Comparison Slider
                      </button>
                      <button
                        onClick={() => setViewMode('sidebyside')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          viewMode === 'sidebyside'
                            ? 'bg-mars-600 text-white'
                            : isDark
                              ? 'text-gray-400 hover:text-white'
                              : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <ImageIcon className="h-4 w-4 inline mr-1" />
                        Side by Side
                      </button>
                    </div>

                    <button
                      onClick={() => openFullscreenViewer(index)}
                      className="p-2 bg-mars-600/20 hover:bg-mars-600/30 text-mars-400 hover:text-mars-300 rounded-lg border border-mars-500/30 hover:border-mars-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                      <Expand className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* View Mode: Slider */}
                {viewMode === 'slider' && (
                  <div className="mt-6">
                    <BeforeAfterSlider
                      beforeImage={result.originalImage}
                      afterImage={result.resultImage}
                      beforeLabel="Original Image"
                      afterLabel="Detected Dust Storms"
                    />
                  </div>
                )}
                
                {/* View Mode: Side by Side */}
                {viewMode === 'sidebyside' && (
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className={`text-lg font-semibold mb-3 flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="w-1 h-5 bg-blue-500 rounded-full mr-2" />
                      Original Image
                    </h4>
                      <ImagePreview
                        src={result.originalImage}
                        alt={`Original ${result.filename}`}
                        showDetections={false}
                      />
                    </div>
                    
                  <div>
                    <h4 className={`text-lg font-semibold mb-3 flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="w-1 h-5 bg-mars-500 rounded-full mr-2" />
                      Detection Result
                    </h4>
                      <ImagePreview
                        src={result.resultImage}
                        alt={`Detected ${result.filename}`}
                        detections={result.detections}
                      />
                    </div>
                  </div>
                )}

                {result.detections.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 card bg-yellow-900/20 border-yellow-700/50"
                  >
                    <p className="text-yellow-400 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      No dust storms detected in this image.
                    </p>
                  </motion.div>
                )}

                {result.detections.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 card bg-green-900/20 border-green-700/50"
                  >
                    <p className="text-green-400 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Successfully detected {result.detections.length} dust storm{result.detections.length > 1 ? 's' : ''}!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && results.length === 0 && selectedImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="card relative overflow-hidden"
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-mars-500/5 via-transparent to-blue-500/5 animate-pulse" />
            
            {/* Floating Particles Effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-mars-400/20 rounded-full"
                  animate={{
                    x: [0, Math.random() * 100 - 50, 0],
                    y: [0, Math.random() * 100 - 50, 0],
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 text-center py-16 px-8">
              {/* Icon with Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
                className="relative inline-block mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-mars-500 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-br from-mars-500/20 to-blue-500/20 p-6 rounded-full border-2 border-mars-500/30">
                  <Satellite className="h-16 w-16 text-mars-400" />
                </div>
              </motion.div>

              {/* Title with Gradient */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-mars-400 via-orange-400 to-blue-400 bg-clip-text text-transparent"
              >
                Ready to Detect
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className={`text-lg mb-8 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Upload satellite images above to begin dust storm detection using our YOLOv8 model.
              </motion.p>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap gap-3 justify-center"
              >
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-mars-500/10 border border-mars-500/30">
                  <Sparkles className="h-4 w-4 text-mars-400" />
                  <span className="text-sm text-mars-300 font-medium">YOLOv8-Powered</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300 font-medium">Real-time Analysis</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
                  <Upload className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-300 font-medium">Multi-Image Support</span>
                </div>
              </motion.div>

              {/* Animated Arrow Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{ delay: 1.3, duration: 2, repeat: Infinity }}
                className="mt-8"
              >
                <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  ↑ Start by uploading images ↑
                </div>
              </motion.div>
            </div>
          </motion.div>
      )}

      {/* Fullscreen Viewer */}
      <AnimatePresence>
        {showFullscreenViewer && results.length > 0 && (
          <FullscreenViewer
            results={results}
            initialIndex={fullscreenStartIndex}
            onClose={closeFullscreenViewer}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default DustStormDetection
