import { Link, useLocation } from 'react-router-dom'
import { Satellite, BarChart3, Home, Clock, Menu, X, Waves } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, Component } from 'react'
import DustParticles from './DustParticles'
import Dither from './Dither'
import MarsGlobe from './MarsGlobe'
import { useTheme } from '../contexts/ThemeContext'
import { useBackground } from '../contexts/BackgroundContext'

// Error Boundary for Dither component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dither component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Fail silently, don't show the background if there's an error
    }
    return this.props.children;
  }
}

const Layout = ({ children }) => {
  const location = useLocation()
  const { isDark } = useTheme()
  const { enableDitherBg, setEnableDitherBg } = useBackground()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: Home, tooltip: 'Return to homepage' },
    { path: '/detection', label: 'Detection', icon: Satellite, tooltip: 'Detect dust storms in images' },
    { path: '/visualization', label: 'Visualization', icon: BarChart3, tooltip: 'View training metrics' },
    { path: '/inference', label: 'Inference Time', icon: Clock, tooltip: 'Test model performance' },
  ]

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-500 ${
      enableDitherBg ? '' : (isDark ? 'bg-space-gradient' : 'bg-gradient-to-b from-blue-50 via-white to-orange-50')
    }`}>
      {/* Dither Background - Always behind everything */}
      {enableDitherBg && (
        <div className="fixed inset-0 z-0">
          <ErrorBoundary>
            <Dither
              waveColor={[0.5, 0.5, 0.5]}
              disableAnimation={false}
              enableMouseInteraction={false}
              mouseRadius={0}
              colorNum={60}
              waveAmplitude={0.3}
              waveFrequency={4}
              waveSpeed={0.05}
            />
          </ErrorBoundary>
        </div>
      )}
      
      {isDark && !enableDitherBg && (
        <>
          <DustParticles count={25} />
          {/* Mars Globe Animation - Single large centered globe */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="opacity-60 scale-150">
              <MarsGlobe />
            </div>
          </div>
        </>
      )}
      
      {/* Top Navigation Bar - Enhanced transparency */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`backdrop-blur-lg shadow-xl sticky top-0 z-50 transition-colors duration-500 ${
          isDark 
            ? 'bg-black/40 border-b border-white/10' 
            : 'bg-white/60 border-b border-gray-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                {/* Main satellite icon - stays solid */}
                <Satellite className="h-8 w-8 text-mars-500 relative z-10 transition-transform duration-700 ease-in-out group-hover:rotate-180 drop-shadow-lg" />
                
                {/* Continuous dim to glow layers */}
                <div className="absolute inset-0 h-8 w-8 text-mars-500 animate-breathe transition-transform duration-700 ease-in-out group-hover:rotate-180">
                  <Satellite className="h-8 w-8" />
                </div>
                <div className="absolute inset-0 h-8 w-8 text-orange-500 animate-breathe transition-transform duration-700 ease-in-out group-hover:rotate-180" style={{ animationDelay: '0.5s' }}>
                  <Satellite className="h-8 w-8" />
                </div>
                <div className="absolute inset-0 h-8 w-8 text-amber-400 animate-breathe transition-transform duration-700 ease-in-out group-hover:rotate-180" style={{ animationDelay: '1s' }}>
                  <Satellite className="h-8 w-8" />
                </div>
                
                {/* Outer glow ring - continuous pulse */}
                <div className="absolute inset-0 -m-4 rounded-full bg-mars-500/20 animate-breathe group-hover:bg-mars-500/40 transition-colors duration-700" style={{ animationDelay: '0.7s' }}></div>
              </div>
              <div>
                <h1 className={`text-xl font-bold tracking-tight transition-colors ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Mars Dust Storm Detection
                </h1>
                <p className={`text-xs hidden sm:block transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Powered by YOLOv8</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link key={item.path} to={item.path}>
                    <div
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-mars-600 via-orange-600 to-mars-700 text-white shadow-lg shadow-mars-500/40'
                          : isDark
                            ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-md'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </div>
                  </Link>
                )
              })}

              {/* Background Animation Toggle */}
              <button
                onClick={() => setEnableDitherBg(!enableDitherBg)}
                className={`p-2 rounded-lg transition-all duration-300 ml-2 ${
                  enableDitherBg
                    ? 'bg-mars-600/50 hover:bg-mars-700/50 text-mars-300 hover:text-mars-200 shadow-lg shadow-mars-500/30' 
                    : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-gray-300'
                }`}
              >
                <Waves className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-800/50 text-gray-300' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`fixed top-0 right-0 h-full w-64 shadow-2xl z-50 md:hidden transition-colors backdrop-blur-lg ${
                isDark 
                  ? 'bg-black/40 border-l border-white/10' 
                  : 'bg-white/60 border-l border-gray-200/50'
              }`}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-lg font-bold transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Navigation</h2>
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <X className={`h-6 w-6 transition-colors ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </button>
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <div
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-mars-600 to-mars-700 text-white'
                            : isDark
                              ? 'text-gray-300 hover:bg-gray-800'
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )
                })}
                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={() => setEnableDitherBg(!enableDitherBg)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full transition-all text-gray-300 hover:bg-gray-800"
                  >
                    <Waves className="h-5 w-5" />
                    <span>{enableDitherBg ? 'Disable Background' : 'Enable Background'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer - Enhanced transparency */}
      <footer className={`relative z-20 mt-auto backdrop-blur-lg transition-colors duration-500 ${
        isDark 
          ? 'border-t border-white/10 bg-black/40' 
          : 'border-t border-gray-200/50 bg-white/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`text-center text-sm transition-colors ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <p>© 2025 Mars Dust Storm Detection | Powered by YOLOv8 & React</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout

