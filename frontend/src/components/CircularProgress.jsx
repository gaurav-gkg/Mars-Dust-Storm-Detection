import { motion } from 'framer-motion'

const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = '#ee5f1f', label, subLabel }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(238, 95, 31, 0.5))' }}
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-theme-primary">
              {percentage.toFixed(1)}%
            </div>
          </motion.div>
        </div>
      </div>
      {label && (
        <div className="mt-3 text-center">
          <div className="text-sm font-semibold text-theme-secondary">{label}</div>
          {subLabel && <div className="text-xs text-theme-muted">{subLabel}</div>}
        </div>
      )}
    </div>
  )
}

export default CircularProgress


