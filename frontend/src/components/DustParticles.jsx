import { useEffect, useState } from 'react'

const DustParticles = ({ count = 30 }) => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 20,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.5 + 0.3,
    }))
    setParticles(newParticles)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-mars-500/40 blur-sm"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `dust ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  )
}

export default DustParticles


