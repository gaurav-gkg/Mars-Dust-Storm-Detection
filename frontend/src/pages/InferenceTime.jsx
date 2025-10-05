import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import AnimatedCounter from '../components/AnimatedCounter'
import CircularProgress from '../components/CircularProgress'
import MetricTooltip from '../components/MetricTooltip'
import ModelDropdown from '../components/ModelDropdown'
import { Clock, Zap, Image as ImageIcon, Download, BarChart3, TrendingUp, Target } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTheme } from '../contexts/ThemeContext'

const InferenceTime = () => {
  const { isDark } = useTheme()
  const [selectedImages, setSelectedImages] = useState([])
  const [selectedModel, setSelectedModel] = useState('best.pt')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageResults, setImageResults] = useState([])
  const [averageTime, setAverageTime] = useState(null)

  const models = {
    'best.pt': 'Best Model',
    'last.pt': 'Last Model'
  }

  const handleImageSelect = (files) => {
    const fileArray = Array.isArray(files) ? files : [files]
    setSelectedImages(fileArray)
    setError(null)
    setImageResults([])
    setAverageTime(null)
  }

  const runInferenceTest = async () => {
    if (selectedImages.length === 0) {
      setError('Please select at least one image')
      return
    }

    setLoading(true)
    setError(null)
    setImageResults([])
    setAverageTime(null)

    try {
      const results = []
      let totalTime = 0

      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i]
        
        // Get inference time
        const formData = new FormData()
        formData.append('image', image)
        formData.append('model', selectedModel)
        
        const timeResponse = await fetch('http://localhost:8000/api/inference-time', {
          method: 'POST',
          body: formData
        })

        if (!timeResponse.ok) {
          throw new Error(`Failed to process ${image.name}`)
        }

        const timeData = await timeResponse.json()
        
        // Get detection results
        const formData2 = new FormData()
        formData2.append('image', image)
        formData2.append('model', selectedModel)
        
        const detectResponse = await fetch('http://localhost:8000/api/detect', {
          method: 'POST',
          body: formData2
        })

        const detectData = await detectResponse.json()
        
        const inferenceTime = timeData.inference_time_ms
        totalTime += inferenceTime
        
        results.push({
          imageName: image.name,
          inferenceTime: inferenceTime,
          fps: (1000 / inferenceTime),
          detections: detectData.detections?.length || 0,
        })
      }

      const avgTime = totalTime / selectedImages.length
      setAverageTime(avgTime)
      setImageResults(results)
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to run inference test. Make sure the backend is running.'
      setError(errorMessage)
      console.error('Inference test error:', err)
    } finally {
      setLoading(false)
    }
  }

  const downloadResults = () => {
    const csvContent = [
      ['Image Name', 'Inference Time (ms)', 'FPS'],
      ...imageResults.map(item => [
        item.imageName,
        item.inferenceTime.toFixed(2),
        item.fps.toFixed(2)
      ]),
      ['', '', ''],
      ['Average Time', averageTime.toFixed(2), (1000 / averageTime).toFixed(2)]
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `inference-results-${models[selectedModel]}.csv`
    link.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-theme-primary mb-2 flex items-center">
              <Clock className="h-10 w-10 mr-3 text-mars-500" />
              Inference Time Testing
            </h1>
            <p className="text-theme-muted">Measure model performance and real-time FPS on multiple images</p>
          </div>
          {imageResults.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadResults}
              className="bg-mars-600 hover:bg-mars-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Download CSV</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Average Time Display */}
      <AnimatePresence>
        {averageTime !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-purple-300 dark:text-purple-300 light:text-purple-700 mb-2">Average Inference Time</h3>
                <p className="text-5xl font-bold text-theme-primary">
                  <AnimatedCounter value={averageTime} decimals={2} />
                  <span className="text-2xl ml-2 text-theme-muted">ms</span>
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-purple-300 dark:text-purple-300 light:text-purple-700 mb-2">Average FPS</h3>
                <p className="text-5xl font-bold text-theme-primary">
                  <AnimatedCounter value={1000 / averageTime} decimals={2} />
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-purple-300 dark:text-purple-300 light:text-purple-700 mb-2">Images Processed</h3>
                <p className="text-5xl font-bold text-theme-primary">{imageResults.length}</p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-purple-300 dark:text-purple-300 light:text-purple-700 mb-2">Model Used</h3>
                <p className="text-3xl font-bold text-theme-primary">{models[selectedModel]}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Model Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center text-theme-primary">
            <Zap className="h-5 w-5 mr-2 text-mars-500" />
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

          {/* Run Test Button - Moved inside Model Selection */}
          {selectedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <button
                onClick={runInferenceTest}
                disabled={loading}
                className="w-full bg-gradient-to-r from-mars-600 via-orange-600 to-mars-700 hover:from-mars-700 hover:via-orange-700 hover:to-mars-800 disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-mars-500/50 transform hover:scale-105 disabled:transform-none relative overflow-hidden"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Images...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Run Inference Test ({selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''})
                  </>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Image Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center text-theme-primary">
            <ImageIcon className="h-5 w-5 mr-2 text-mars-500" />
            Upload Test Images
          </h2>
          
          {selectedImages.length === 0 ? (
            <FileUpload
              onFileSelect={handleImageSelect}
              accept="image/*"
              multiple={true}
              label="Choose PNG/JPG images to test"
            />
          ) : (
            <div className="space-y-3">
              {/* Display selected images */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100/50 rounded-lg p-3 border border-gray-700/50 dark:border-gray-700/50 light:border-gray-300/50"
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
              <div className="flex items-center justify-between pt-3 border-t border-gray-700/50 dark:border-gray-700/50 light:border-gray-300/50">
                <div className="text-sm text-theme-muted">
                  <p className="font-medium">{selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected</p>
                  <p className="text-xs">Total size: {(selectedImages.reduce((sum, img) => sum + img.size, 0) / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedImages([])
                    setImageResults([])
                    setAverageTime(null)
                    setError(null)
                  }}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 rounded-lg transition-all text-sm font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Per-Image Results Table */}
      <AnimatePresence>
        {imageResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-theme-primary flex items-center">
                <ImageIcon className="h-7 w-7 text-mars-500 mr-3" />
                Per-Image Results
              </h3>
              <div className="text-sm text-theme-muted">{imageResults.length} image{imageResults.length > 1 ? 's' : ''} processed</div>
            </div>
            
            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700 dark:border-gray-700 light:border-gray-300">
                    <th className="pb-3 text-theme-muted font-semibold">#</th>
                    <th className="pb-3 text-theme-muted font-semibold">Image Name</th>
                    <th className="pb-3 text-theme-muted font-semibold text-right">Inference Time</th>
                    <th className="pb-3 text-theme-muted font-semibold text-right">FPS</th>
                  </tr>
                </thead>
                <tbody>
                  {imageResults.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-800 dark:border-gray-800 light:border-gray-200 hover:bg-gray-800/30"
                    >
                      <td className="py-3 text-theme-muted font-medium">{index + 1}</td>
                      <td className="py-3 text-theme-primary font-medium truncate max-w-xs">{item.imageName}</td>
                      <td className="py-3 text-mars-400 font-bold text-right">{item.inferenceTime.toFixed(2)} ms</td>
                      <td className="py-3 text-green-400 font-bold text-right">{item.fps.toFixed(2)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bar Chart Visualization */}
            {imageResults.length > 1 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-theme-primary">Inference Time Comparison</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={imageResults}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="imageName" 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                        label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="inferenceTime" fill="#ee5f1f" name="Inference Time (ms)" />
                    </BarChart>
                  </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-900/20 border-2 border-red-500/30 rounded-xl p-4"
          >
            <p className="text-red-400 font-medium flex items-center">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

export default InferenceTime

