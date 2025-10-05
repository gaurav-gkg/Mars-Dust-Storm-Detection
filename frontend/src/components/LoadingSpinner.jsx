import { motion } from 'framer-motion'

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-gray-700/50 border-t-mars-500 rounded-full shadow-lg shadow-mars-500/30"
        />
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 border-4 border-gray-700/50 border-t-orange-500 rounded-full shadow-lg shadow-orange-500/30"
        />
        {/* Center pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-7 bg-gradient-to-br from-mars-500 to-orange-500 rounded-full blur-sm"
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-gray-300 font-medium"
      >
        {message}
      </motion.p>
      <motion.div
        animate={{ width: ['0%', '100%', '0%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-4 h-1 bg-gradient-to-r from-transparent via-mars-500 via-orange-500 to-transparent rounded-full shadow-lg shadow-mars-500/30"
        style={{ width: '200px' }}
      />
    </div>
  )
}

export default LoadingSpinner

