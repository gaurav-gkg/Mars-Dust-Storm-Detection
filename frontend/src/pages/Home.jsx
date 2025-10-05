import { Link } from 'react-router-dom'
import { Satellite, BarChart3, Clock, ArrowRight, Sparkles, Zap, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import TypingText from '../components/TypingText'
import { useTheme } from '../contexts/ThemeContext'
import { useBackground } from '../contexts/BackgroundContext'

const Home = () => {
  const { isDark } = useTheme()
  const { enableDitherBg } = useBackground()
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  }

  const navCards = [
    {
      path: '/detection',
      icon: Satellite,
      title: 'Dust Storm Detection',
      description: 'Upload satellite images to detect dust storms using our trained YOLOv8 model. Get real-time predictions with confidence scores and bounding boxes.',
      gradient: 'from-blue-600/20 to-blue-900/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
    },
    {
      path: '/visualization',
      icon: BarChart3,
      title: 'Results Visualization',
      description: 'Analyze training results and model performance metrics. Visualize precision, recall, mAP, and loss metrics with interactive charts and correlation matrices.',
      gradient: 'from-purple-600/20 to-purple-900/20',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
    {
      path: '/inference',
      icon: Clock,
      title: 'Inference Time',
      description: 'Test model inference speed with your own images. Compare performance between different models and measure real-time FPS for deployment planning.',
      gradient: 'from-green-600/20 to-green-900/20',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 relative"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center space-x-2 bg-mars-500/10 border border-mars-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-mars-400" />
            <span className="text-sm text-mars-300 font-medium">Powered by YOLOv8</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-mars-400 via-orange-400 to-red-500 bg-clip-text text-transparent animate-gradient">
              Mars Dust Storm
            </span>
            <br />
            <span className={`${isDark ? 'text-white' : 'text-gray-900'} drop-shadow-lg`}>Detection System</span>
          </h1>
          
          <div className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <TypingText
              text="Advanced AI-powered detection system for identifying dust storms in Martian satellite imagery"
              speed={50}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            <Link to="/detection">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center space-x-2"
              >
                <Satellite className="h-5 w-5" />
                <span>Start Detection</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
            <Link to="/visualization">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center space-x-2"
              >
                <BarChart3 className="h-5 w-5" />
                <span>View Analytics</span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Navigation Cards with 3D Effect */}
      <div className="grid md:grid-cols-3 gap-8">
        {navCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.path}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <Link to={card.path} className="block group h-full">
                <div className="card h-full">
                  <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="relative"
                      >
                      <Icon className={`h-14 w-14 ${card.iconColor}`} />
                    </motion.div>
                    <ArrowRight className={`h-6 w-6 group-hover:text-mars-400 group-hover:translate-x-2 transition-all duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                  <h2 className={`text-2xl font-bold mb-3 group-hover:text-mars-300 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {card.title}
                  </h2>
                  <p className={`group-hover:text-gray-300 transition-colors leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {card.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="card"
      >
        <h2 className={`text-3xl font-bold mb-6 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Sparkles className="h-8 w-8 text-mars-500 mr-3" />
          About This Project
        </h2>
        <div className="max-w-none">
          <p className={`mb-6 leading-relaxed text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            This project harnesses YOLOv8 to identify dust storms in Mars satellite images, leveraging 
            open-source datasets from NASA Space hosted on Harvard Dataverse. The system provides a comprehensive suite of tools 
            for detection, analysis, and performance monitoring.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-mars-500 rounded-full mt-2" />
              <div>
                <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Real-time Detection</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Instant dust storm identification with confidence scoring</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Interactive Visualization</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Dynamic charts and training metrics analysis</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Performance Testing</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Inference time measurement with FPS metrics</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Multi-Format Support</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>JPG, PNG, and JPEG image compatibility</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  )
}

export default Home

