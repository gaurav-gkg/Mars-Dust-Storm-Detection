import { HelpCircle } from 'lucide-react'
import Tooltip from './Tooltip'

const MetricTooltip = ({ metric }) => {
  const explanations = {
    precision: 'Accuracy of positive predictions. Fewer false positives.',
    recall: 'Finds all positive instances. Fewer false negatives.',
    mAP: 'Average precision across all classes.',
    'mAP50': 'Mean average precision at 50% IoU threshold.',
    'mAP50-95': 'Average mAP across IoU thresholds 0.5-0.95.',
    loss: 'Model prediction error. Lower = better.',
    fps: 'Images processed per second.',
    'inference_time': 'Time to process one image.',
  }

  // Find matching explanation
  const metricKey = Object.keys(explanations).find(key => 
    metric.toLowerCase().includes(key.toLowerCase())
  )
  const explanation = metricKey ? explanations[metricKey] : 'Performance metric for model evaluation.'

  return (
    <Tooltip content={explanation} position="bottom">
      <HelpCircle className="h-4 w-4 text-gray-500 hover:text-mars-400 cursor-help inline ml-1" />
    </Tooltip>
  )
}

export default MetricTooltip

