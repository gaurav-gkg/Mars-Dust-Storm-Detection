import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const AnimatedCounter = ({ value, duration = 1000, decimals = 0, suffix = '', prefix = '', className = '' }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    let animationFrame

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(value * easeOutQuart)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return (
    <motion.span
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {prefix}{count.toFixed(decimals)}{suffix}
    </motion.span>
  )
}

export default AnimatedCounter

