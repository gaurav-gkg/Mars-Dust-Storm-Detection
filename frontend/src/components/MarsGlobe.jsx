import { motion } from 'framer-motion'

const MarsGlobe = () => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Main Mars sphere */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-br from-mars-300 via-mars-500 to-mars-800 shadow-2xl"
        style={{
          boxShadow: '0 0 120px rgba(238, 95, 31, 1.0), inset -20px -20px 40px rgba(0, 0, 0, 0.4), 0 0 180px rgba(238, 95, 31, 0.8)',
        }}
      >
        {/* Surface details */}
        <div className="absolute inset-0 rounded-full overflow-hidden opacity-70">
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-mars-900 rounded-full blur-sm" />
          <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-red-900 rounded-full blur-sm" />
          <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-mars-800 rounded-full blur-md" />
          <div className="absolute top-2/3 right-1/3 w-10 h-10 bg-orange-800 rounded-full blur-sm" />
          <div className="absolute top-1/3 right-1/2 w-6 h-6 bg-red-800 rounded-full blur-sm" />
        </div>
      </motion.div>

      {/* Glow effect */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.7, 1.0, 0.7],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-mars-400 blur-3xl -z-10"
        style={{
          filter: 'blur(80px)',
        }}
      />

      {/* Orbiting particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.5,
          }}
          className="absolute inset-0"
        >
          <div 
            className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-lg"
            style={{ 
              top: '50%', 
              left: '100%',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)'
            }}
          />
        </motion.div>
      ))}

      {/* Atmosphere */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 200, 150, 0.3), rgba(255, 150, 100, 0.1) 50%, transparent 70%)',
        }}
      />
    </div>
  )
}

export default MarsGlobe

