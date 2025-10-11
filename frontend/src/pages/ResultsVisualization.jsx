import { useState, useEffect } from 'react'
import { 
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { Table, Filter, BarChart3, Award, TrendingUp } from 'lucide-react'
import CircularProgress from '../components/CircularProgress'
import RadarChart from '../components/RadarChart'
import MetricTooltip from '../components/MetricTooltip'
import { motion } from 'framer-motion'

const ResultsVisualization = () => {
  const [data, setData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [selectedColumns, setSelectedColumns] = useState([])
  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState('')
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)

  const loadCSV = async () => {
    setLoading(true)
    try {
      // Fetch CSV as static file from frontend public directory
      const response = await fetch('/CSVs/training_logs.csv')
      if (!response.ok) {
        throw new Error('Failed to fetch CSV data')
      }
      
      const csvText = await response.text()
      
      // Parse CSV manually
      const lines = csvText.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      const parsedData = lines.slice(1).map(line => {
        const values = line.split(',')
        const row = {}
        headers.forEach((header, index) => {
          const value = values[index]?.trim()
          // Try to parse as number, otherwise keep as string
          row[header] = !isNaN(value) && value !== '' ? parseFloat(value) : value
        })
        return row
      })
      
      setData(parsedData)
      setFilteredData(parsedData)
      
      if (headers.length > 0) {
        setXAxis(headers[0])
        setYAxis(headers[1] || headers[0])
      }
      
    } catch (error) {
      console.error('Error loading CSV:', error)
      alert(`Failed to load CSV file: ${error.message}. Make sure the training_logs.csv file exists in the public/CSVs folder.`)
    } finally {
      setLoading(false)
    }
  }

  // Preload training_logs on component mount
  useEffect(() => {
    loadCSV()
  }, [])

  const handleFilter = (column, values) => {
    const newFilters = { ...filters, [column]: values }
    setFilters(newFilters)
    
    let filtered = data
    Object.entries(newFilters).forEach(([col, vals]) => {
      if (vals.length > 0) {
        filtered = filtered.filter(row => vals.includes(row[col]))
      }
    })
    setFilteredData(filtered)
  }

  const getNumericColumns = () => {
    if (!data || data.length === 0) return []
    return Object.keys(data[0]).filter(key => typeof data[0][key] === 'number')
  }

  const getAllColumns = () => {
    if (!data || data.length === 0) return []
    return Object.keys(data[0])
  }

  const getUniqueValues = (column) => {
    if (!data) return []
    return [...new Set(data.map(row => row[column]))]
  }

  const getStats = (column) => {
    if (!data) return {}
    const values = data.map(d => d[column]).filter(v => typeof v === 'number')
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const sorted = [...values].sort((a, b) => a - b)
    return {
      mean: mean.toFixed(2),
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
      median: sorted[Math.floor(sorted.length / 2)].toFixed(2)
    }
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mars-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading CSV data...</p>
        </div>
      </div>
    )
  }

  const numericCols = getNumericColumns()
  const allCols = getAllColumns()
  
  // Find metrics columns - look for precision, recall, mAP with various naming patterns
  const precisionCols = allCols.filter(col => col.toLowerCase().includes('precision'))
  const recallCols = allCols.filter(col => col.toLowerCase().includes('recall'))
  const mapCols = allCols.filter(col => col.toLowerCase().includes('map'))
  const metrics = [...precisionCols, ...recallCols, ...mapCols]
  
  const lossCols = allCols.filter(col => col.toLowerCase().includes('loss'))
  const hasEpoch = allCols.includes('epoch')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-theme-primary mb-2">Training Results</h1>
            <p className="text-theme-muted">Analyze model performance and metrics</p>
          </div>
          
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mars-500"></div>
          )}
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-300 dark:text-blue-300 light:text-blue-700">Total Epochs</h3>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-theme-primary">{data.length}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-300 dark:text-green-300 light:text-green-700">Metrics Tracked</h3>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Table className="h-4 w-4 text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-theme-primary">{allCols.length}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-300 dark:text-purple-300 light:text-purple-700">Performance Metrics</h3>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-theme-primary">{metrics.length}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-orange-300 dark:text-orange-300 light:text-orange-700">Loss Functions</h3>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Filter className="h-4 w-4 text-orange-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-theme-primary">{lossCols.length}</p>
        </div>
      </div>

      {/* Best Performance Summary with Circular Progress */}
      {metrics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-2xl font-bold text-theme-primary mb-6 flex items-center">
            <Award className="h-8 w-8 text-green-500 mr-3" />
            Best Performance Achieved
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {metrics.slice(0, 3).map((col, idx) => {
              // Get the best (maximum) value for this metric
              const values = filteredData.map(d => d[col]).filter(v => typeof v === 'number')
              const bestValue = values.length > 0 ? Math.max(...values) : 0
              
              // Convert decimal to percentage (0.9134 -> 91.34%)
              const percentage = Math.min(bestValue * 100, 100)
              const colors = ['#10B981', '#3B82F6', '#F59E0B']
              
              // Clean metric names
              const cleanName = col
                .replace('metrics/precision(B)', 'Precision')
                .replace('metrics/recall(B)', 'Recall')
                .replace('metrics/mAP50(B)', 'mAP50')
              
              return (
                <motion.div
                  key={col}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card-tooltip-safe"
                >
                  <div className="flex items-center justify-center mb-3">
                    <p className="text-sm text-theme-muted uppercase tracking-wider font-semibold">{cleanName}</p>
                    <MetricTooltip metric={col} />
                  </div>
                  <div className="flex justify-center">
                    <CircularProgress
                      percentage={percentage}
                      size={140}
                      strokeWidth={10}
                      color={colors[idx % 3]}
                      label=""
                      subLabel=""
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Radar Chart for Multi-Metric Comparison */}
      {metrics.length >= 3 && filteredData.length > 0 && (
        <RadarChart
          data={metrics.slice(0, 6).map(metric => {
            // Clean metric names for display
            const cleanName = metric
              .replace('metrics/precision(B)', 'Precision')
              .replace('metrics/recall(B)', 'Recall')
              .replace('metrics/mAP50(B)', 'mAP50')
              .replace('metrics/mAP50-95(B)', 'mAP50-95')
            
            // Get the best (maximum) value for this metric
            const values = filteredData.map(d => d[metric]).filter(v => typeof v === 'number')
            const bestValue = values.length > 0 ? Math.max(...values) : 0
            
            return {
              metric: cleanName,
              value: bestValue
            }
          })}
          title="Best Performance Radar"
          subtitle="Multi-dimensional view of best achieved metrics"
        />
      )}



      {metrics.length > 0 && hasEpoch && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-theme-primary flex items-center">
              Model Performance Metrics
            </h3>
            <div className="text-sm text-theme-muted">Over {data.length} epochs</div>
          </div>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="epoch" 
                stroke="#9CA3AF" 
                label={{ value: 'Epoch', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF" 
                label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {metrics.slice(0, 6).map((metric, i) => (
                <Line 
                  key={metric} 
                  type="monotone" 
                  dataKey={metric} 
                  stroke={['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][i % 6]} 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {lossCols.length > 0 && hasEpoch && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-theme-primary flex items-center">
              Training Loss Convergence
            </h3>
            <div className="text-sm text-theme-muted">Lower is better</div>
          </div>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="epoch" 
                stroke="#9CA3AF" 
                label={{ value: 'Epoch', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF" 
                label={{ value: 'Loss', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {lossCols.slice(0, 6).map((loss, i) => (
                <Line 
                  key={loss} 
                  type="monotone" 
                  dataKey={loss} 
                  stroke={['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'][i % 6]} 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-6 flex flex-wrap justify-center gap-8 text-theme-secondary">
            {lossCols.slice(0, 3).map(loss => {
              const finalValue = filteredData[filteredData.length - 1]?.[loss]
              return (
                <div key={loss} className="text-center">
                  <span className="text-theme-muted uppercase tracking-wider">{loss}: </span>
                  <span className="font-bold text-red-400">
                    {typeof finalValue === 'number' ? finalValue.toFixed(4) : 'N/A'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}

export default ResultsVisualization

