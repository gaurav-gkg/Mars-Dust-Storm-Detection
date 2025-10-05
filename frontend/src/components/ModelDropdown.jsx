import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Zap, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ModelDropdown = ({ value, onChange, models }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  const modelDescriptions = {
    'best.pt': 'Optimized Performance',
    'last.pt': 'Latest Training'
  }

  const modelLabels = {
    'best.pt': 'Best Model',
    'last.pt': 'Last Model'
  }

  const selectedModel = models[value] || value

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full appearance-none bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm text-theme-primary rounded-xl pl-6 pr-14 py-4 border-2 border-white/10 hover:border-mars-500/60 focus:border-mars-500 focus:ring-2 focus:ring-mars-500/20 transition-all duration-200 shadow-xl hover:shadow-xl hover:shadow-mars-500/10 cursor-pointer font-semibold text-base text-left relative overflow-hidden group"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(238,95,31,0.05) 100%)'
        }}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center h-full">
          <span className="leading-none">{selectedModel}</span>
        </div>
        
        {/* Dropdown Arrow */}
        <div className="absolute right-5 top-0 bottom-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center"
          >
            <ChevronDown className="w-5 h-5 text-mars-500 group-hover:text-mars-400 transition-colors" strokeWidth={2.5} />
          </motion.div>
        </div>

        {/* Animated border glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-mars-500/0 via-mars-500/30 to-mars-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-sm -z-10"></div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 backdrop-blur-xl bg-gradient-to-br from-black/90 via-black/80 to-black/90 border-2 border-white/20 rounded-xl shadow-2xl overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(238,95,31,0.1) 100%)'
            }}
          >
            {/* Glow effect at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mars-500 to-transparent opacity-50"></div>
            
            {Object.entries(models).map(([key, name], index) => {
              const isSelected = key === value
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onChange(key)
                    setIsOpen(false)
                  }}
                  className={`w-full px-6 py-3 text-left transition-all duration-200 relative group ${
                    isSelected
                      ? 'bg-gradient-to-r from-mars-600/40 via-orange-600/30 to-mars-600/40 text-white'
                      : 'text-gray-300 hover:bg-gradient-to-r hover:from-mars-600/20 hover:via-orange-600/10 hover:to-mars-600/20 hover:text-white'
                  } ${index > 0 ? 'border-t border-white/10' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-semibold text-sm leading-tight">{modelLabels[key]}</div>
                        <div className="text-xs text-gray-400 mt-0.5 leading-tight">
                          {modelDescriptions[key]}
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-mars-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-mars-500/0 via-mars-500/10 to-mars-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </button>
              )
            })}

            {/* Bottom glow effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mars-500 to-transparent opacity-50"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ModelDropdown

