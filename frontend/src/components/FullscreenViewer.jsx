import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Download, Maximize2, Image as ImageIcon, Minimize2 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import BeforeAfterSlider from './BeforeAfterSlider'
import ImagePreview from './ImagePreview'

const FullscreenViewer = ({ results, initialIndex = 0, onClose }) => {
  const { isDark } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [viewMode, setViewMode] = useState('slider') // 'slider' or 'sidebyside'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // Request fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (containerRef.current && document.fullscreenEnabled) {
          await containerRef.current.requestFullscreen()
          setIsFullscreen(true)
        }
      } catch (err) {
        console.error('Error entering fullscreen:', err)
      }
    }

    enterFullscreen()

    // Cleanup: exit fullscreen on unmount
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error('Error exiting fullscreen:', err))
      }
    }
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement
      setIsFullscreen(isCurrentlyFullscreen)
      
      // If user exits fullscreen (e.g., pressing ESC), close the viewer
      if (!isCurrentlyFullscreen) {
        onClose()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [onClose])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        // Fullscreen exit is handled by fullscreenchange event
        // Just trigger onClose which will exit fullscreen in cleanup
        if (document.fullscreenElement) {
          document.exitFullscreen()
        }
      } else if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
  }

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen()
        }
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err)
    }
  }

  const downloadCurrent = () => {
    const result = results[currentIndex]
    const link = document.createElement('a')
    link.href = result.resultImage
    link.download = `detection-result-${currentIndex + 1}.png`
    link.click()
  }

  if (!results || results.length === 0) return null

  const currentResult = results[currentIndex]

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
      onClick={onClose}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full h-full bg-black overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="w-8 h-8 flex items-center justify-center bg-mars-500/20 text-mars-400 rounded-full mr-3 font-bold">
                    {currentIndex + 1}
                  </span>
                  {currentResult.filename}
                </h2>
                <div className={`px-3 py-1 rounded-full font-semibold border text-sm ${
                  currentResult.detections.length > 0
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}>
                  {currentResult.detections.length} detection{currentResult.detections.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 rounded-lg p-1 bg-black/30 border border-white/10">
                  <button
                    onClick={() => setViewMode('slider')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'slider'
                        ? 'bg-mars-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Maximize2 className="h-4 w-4 inline mr-1" />
                    Slider
                  </button>
                  <button
                    onClick={() => setViewMode('sidebyside')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'sidebyside'
                        ? 'bg-mars-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="h-4 w-4 inline mr-1" />
                    Side by Side
                  </button>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
                  title={isFullscreen ? 'Exit Fullscreen (F or ESC)' : 'Enter Fullscreen (F)'}
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>

                <button
                  onClick={downloadCurrent}
                  className="p-2 bg-mars-600/20 hover:bg-mars-600/30 text-mars-400 hover:text-mars-300 rounded-lg border border-mars-500/30 hover:border-mars-500/50 transition-all duration-300"
                >
                  <Download className="h-5 w-5" />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {results.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Content */}
          <div className="absolute inset-0 pt-20 pb-16">
            <div className="h-full w-full flex items-center justify-center px-4">
              {viewMode === 'slider' ? (
                <div className="w-full h-full flex items-center justify-center max-w-7xl">
                  <BeforeAfterSlider
                    beforeImage={currentResult.originalImage}
                    afterImage={currentResult.resultImage}
                    beforeLabel="Original Image"
                    afterLabel="Detected Dust Storms"
                    fullHeight={true}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col">
                  {/* Images Side by Side */}
                  <div className="grid grid-cols-2 gap-4 px-4 flex-shrink-0" style={{ height: '65%' }}>
                    <div className="flex flex-col h-full">
                      <h3 className="text-lg font-semibold mb-2 text-gray-300 flex items-center flex-shrink-0">
                        <div className="w-1 h-5 bg-blue-500 rounded-full mr-2" />
                        Original Image
                      </h3>
                      <div className="flex-1 min-h-0">
                        <ImagePreview
                          src={currentResult.originalImage}
                          alt={`Original ${currentResult.filename}`}
                          showDetections={false}
                          compactMode={true}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col h-full">
                      <h3 className="text-lg font-semibold mb-2 text-gray-300 flex items-center flex-shrink-0">
                        <div className="w-1 h-5 bg-mars-500 rounded-full mr-2" />
                        Detection Result
                      </h3>
                      <div className="flex-1 min-h-0">
                        <ImagePreview
                          src={currentResult.resultImage}
                          alt={`Detected ${currentResult.filename}`}
                          showDetections={false}
                          compactMode={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Detections Section - Horizontally Centered */}
                  {currentResult.detections.length > 0 && (
                    <div className="flex-1 overflow-y-auto px-4 pt-4">
                      <div className="max-w-5xl mx-auto">
                        <h3 className="text-lg font-bold text-white flex items-center justify-center mb-4">
                          <div className="w-1 h-5 bg-mars-500 rounded-full mr-2" />
                          Detections ({currentResult.detections.length})
                        </h3>
                        <div className="flex flex-wrap gap-3 justify-center">
                          {currentResult.detections.map((detection, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-mars-500/30 transition-all w-64"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-300">
                                  Detection #{index + 1}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                  detection.confidence >= 80 ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                                  detection.confidence >= 60 ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' :
                                  'bg-orange-500/20 border-orange-500/30 text-orange-400'
                                }`}>
                                  {detection.confidence}%
                                </span>
                              </div>
                              
                              {/* Confidence Progress Bar */}
                              <div className="mt-2 mb-3">
                                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                  <span>Confidence</span>
                                  <span>{detection.confidence}%</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      detection.confidence >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                                      detection.confidence >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                      'bg-gradient-to-r from-orange-500 to-orange-400'
                                    }`}
                                    style={{ width: `${detection.confidence}%` }}
                                  />
                                </div>
                              </div>

                              <p className="text-xs text-gray-500 font-mono">
                                Box: [{detection.box.join(', ')}]
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Image {currentIndex + 1} of {results.length}
              </div>
              <div className="text-sm text-gray-400">
                Arrow keys to navigate • F to toggle fullscreen • ESC to close
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default FullscreenViewer
