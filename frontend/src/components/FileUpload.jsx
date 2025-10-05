import { Upload, X, FileImage, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FileUpload = ({ onFileSelect, accept, multiple = false, label }) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setSelectedFiles(files)
      onFileSelect(multiple ? files : files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files)
      setSelectedFiles(files)
      onFileSelect(multiple ? files : files[0])
    }
  }

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFileSelect(multiple ? newFiles : null)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="w-full">
      <motion.div
        animate={{
          borderColor: dragActive ? 'rgb(238, 95, 31)' : 'rgb(75, 85, 99)',
          backgroundColor: dragActive ? 'rgba(238, 95, 31, 0.1)' : 'transparent',
        }}
        className={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-300 ${
          dragActive ? 'scale-[1.02]' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
        />
        <motion.div
          animate={{
            scale: dragActive ? 1.1 : 1,
          }}
          className="text-center pointer-events-none"
        >
          <motion.div
            animate={{
              y: dragActive ? -10 : 0,
            }}
            className="mx-auto w-16 h-16 mb-4 relative"
          >
            <Upload className={`w-full h-full ${dragActive ? 'text-mars-500' : 'text-gray-400'} transition-colors`} />
            {dragActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 border-2 border-mars-500 rounded-full"
              />
            )}
          </motion.div>
          <p className={`text-lg font-medium mb-2 ${dragActive ? 'text-mars-400' : 'text-gray-300'} transition-colors`}>
            {dragActive ? 'Drop files here!' : (label || 'Drag & drop files here')}
          </p>
          <p className="text-sm text-gray-500 mb-2">or click to browse</p>
          <p className="text-xs text-gray-600">
            {accept || 'All file types accepted'}
          </p>
        </motion.div>
      </motion.div>
      
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {selectedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-mars-500/30 transition-all group"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="p-2 bg-mars-500/20 rounded-lg">
                    <FileImage className="h-5 w-5 text-mars-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFile(index)}
                  className="ml-3 p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FileUpload

