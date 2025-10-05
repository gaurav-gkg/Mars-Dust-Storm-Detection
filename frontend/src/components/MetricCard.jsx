import { motion } from 'framer-motion'

const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend, delay = 0 }) => {
  const colorClasses = {
    blue: 'from-blue-900/40 to-blue-800/20 border-blue-500/30 text-blue-400',
    green: 'from-green-900/40 to-green-800/20 border-green-500/30 text-green-400',
    yellow: 'from-yellow-900/40 to-yellow-800/20 border-yellow-500/30 text-yellow-400',
    red: 'from-red-900/40 to-red-800/20 border-red-500/30 text-red-400',
    purple: 'from-purple-900/40 to-purple-800/20 border-purple-500/30 text-purple-400',
    orange: 'from-orange-900/40 to-orange-800/20 border-orange-500/30 text-orange-400',
  }

  const iconBgClasses = {
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    yellow: 'bg-yellow-500/20',
    red: 'bg-red-500/20',
    purple: 'bg-purple-500/20',
    orange: 'bg-orange-500/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5 shadow-xl backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        {Icon && (
          <div className={`p-2 ${iconBgClasses[color]} rounded-lg`}>
            <Icon className={`h-4 w-4 ${colorClasses[color].split(' ')[3]}`} />
          </div>
        )}
      </div>
      <motion.p
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.2 }}
        className="text-3xl font-bold text-white"
      >
        {value}
      </motion.p>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      )}
      {trend && (
        <div className={`text-xs mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '+' : '-'} {Math.abs(trend)}%
        </div>
      )}
    </motion.div>
  )
}

export default MetricCard


