import { useState } from 'react'
import { ZoomIn, ZoomOut, Download, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Tooltip from './Tooltip'

const ImagePreview = ({ src, alt, detections = [], showDetections = true, compactMode = false }) => {
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = alt || 'dust-storm-detection.png'
    link.click()
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400'
    if (confidence >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getConfidenceBadgeColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500/20 border-green-500/30'
    if (confidence >= 60) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-orange-500/20 border-orange-500/30'
  }

  return (
    <div className={`relative ${compactMode ? 'h-full' : ''}`}>
      {/* Toolbar */}
      <div className="absolute top-3 right-3 flex space-x-2 z-20">
        <Tooltip content="Zoom In">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoom(Math.min(zoom + 0.25, 3))}
            className="p-2 bg-gray-900/90 backdrop-blur-sm hover:bg-gray-800 rounded-lg transition-all border border-gray-700 shadow-lg"
          >
            <ZoomIn className="h-4 w-4 text-white" />
          </motion.button>
        </Tooltip>
        <Tooltip content="Zoom Out">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoom(Math.max(zoom - 0.25, 0.5))}
            className="p-2 bg-gray-900/90 backdrop-blur-sm hover:bg-gray-800 rounded-lg transition-all border border-gray-700 shadow-lg"
          >
            <ZoomOut className="h-4 w-4 text-white" />
          </motion.button>
        </Tooltip>
        <Tooltip content="Fullscreen">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-gray-900/90 backdrop-blur-sm hover:bg-gray-800 rounded-lg transition-all border border-gray-700 shadow-lg"
          >
            <Maximize2 className="h-4 w-4 text-white" />
          </motion.button>
        </Tooltip>
        <Tooltip content="Download">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDownload}
            className="p-2 bg-mars-600/90 backdrop-blur-sm hover:bg-mars-700 rounded-lg transition-all border border-mars-500 shadow-lg"
          >
            <Download className="h-4 w-4 text-white" />
          </motion.button>
        </Tooltip>
      </div>
      
      {/* Image Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-auto h-full rounded-xl bg-gray-900/50 border border-gray-700 shadow-2xl flex items-center justify-center"
      >
        <motion.img
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain transition-transform duration-300"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        />
      </motion.div>

      {/* Zoom indicator */}
      {zoom !== 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-3 left-3 px-3 py-1 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-full border border-gray-700"
        >
          {Math.round(zoom * 100)}%
        </motion.div>
      )}
      
      {/* Detection Results */}
      {!compactMode && showDetections && detections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 space-y-3"
        >
          <h3 className="text-lg font-bold text-white flex items-center">
            <div className="w-1 h-5 bg-mars-500 rounded-full mr-2" />
            Detections ({detections.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {detections.map((detection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-mars-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-300">
                    Detection #{index + 1}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getConfidenceBadgeColor(detection.confidence)}`}>
                    <span className={getConfidenceColor(detection.confidence)}>
                      {detection.confidence}%
                    </span>
                  </span>
                </div>
                
                {/* Confidence Progress Bar */}
                <div className="mt-2 mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Confidence</span>
                    <span>{detection.confidence}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${detection.confidence}%` }}
                      transition={{ duration: 0.8, delay: 0.2 * index }}
                      className={`h-full ${
                        detection.confidence >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                        detection.confidence >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-orange-500 to-orange-400'
                      }`}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-mono">
                  Box: [{detection.box.join(', ')}]
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImagePreview

