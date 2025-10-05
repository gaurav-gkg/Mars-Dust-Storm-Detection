import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { motion } from 'framer-motion'
import { ArrowLeftRight } from 'lucide-react'

const BeforeAfterSlider = ({ beforeImage, afterImage, beforeLabel = 'Original', afterLabel = 'Detection Result', fullHeight = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${fullHeight ? 'h-full flex flex-col' : ''}`}
    >
      <div className="mb-4 flex items-center justify-between text-sm font-medium text-gray-300 flex-shrink-0">
        <span className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
          {beforeLabel}
        </span>
        <ArrowLeftRight className="h-5 w-5 text-mars-500 animate-pulse" />
        <span className="flex items-center">
          <div className="w-3 h-3 bg-mars-500 rounded-full mr-2" />
          {afterLabel}
        </span>
      </div>
      <div className={`rounded-xl overflow-hidden border-2 border-gray-700 shadow-2xl hover:border-mars-500/30 transition-all ${fullHeight ? 'flex-1' : ''}`}>
        <ReactCompareSlider
          itemOne={<ReactCompareSliderImage src={beforeImage} alt={beforeLabel} style={{ objectFit: 'contain' }} />}
          itemTwo={<ReactCompareSliderImage src={afterImage} alt={afterLabel} style={{ objectFit: 'contain' }} />}
          position={50}
          style={{
            width: '100%',
            height: fullHeight ? '100%' : 'auto',
          }}
          handle={
            <div className="w-1 h-full bg-gradient-to-b from-transparent via-mars-500 to-transparent relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-mars-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                <ArrowLeftRight className="h-5 w-5 text-white" />
              </div>
            </div>
          }
        />
      </div>
      <div className="mt-3 text-center text-xs text-gray-500 flex-shrink-0">
        Drag the slider to compare original and detected images
      </div>
    </motion.div>
  )
}

export default BeforeAfterSlider

