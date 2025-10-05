import { motion } from 'framer-motion'
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const RadarChart = ({ data, title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-theme-primary flex items-center">
          {title}
        </h3>
        {subtitle && <p className="text-sm text-theme-muted mt-1">{subtitle}</p>}
      </div>
      <ResponsiveContainer width="100%" height={400}>
          <RechartsRadar data={data}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 1]} 
              tick={{ fill: '#9CA3AF' }}
            />
            <Radar
              name="Performance"
              dataKey="value"
              stroke="#ee5f1f"
              fill="#ee5f1f"
              fillOpacity={0.5}
              strokeWidth={2}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              formatter={(value) => (value * 100).toFixed(2) + '%'}
            />
            <Legend />
          </RechartsRadar>
        </ResponsiveContainer>
    </motion.div>
  )
}

export default RadarChart

