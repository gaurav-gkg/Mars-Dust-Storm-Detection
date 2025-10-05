import { HelpCircle } from 'lucide-react'
import Tooltip from './Tooltip'

const MetricTooltip = ({ metric }) => {
  const explanations = {
    precision: 'Precision measures the accuracy of positive predictions. It is the ratio of correct positive predictions to the total predicted positives. High precision means fewer false positives.',
    recall: 'Recall measures the ability to find all positive instances. It is the ratio of correct positive predictions to all actual positives. High recall means fewer false negatives.',
    mAP: 'Mean Average Precision (mAP) is the average precision across all classes. It considers both precision and recall, making it a comprehensive metric for object detection.',
    'mAP50': 'mAP@0.5 measures mean average precision at IoU threshold of 0.5. A detection is considered correct if it overlaps with ground truth by at least 50%.',
    'mAP50-95': 'mAP@[0.5:0.95] is the average mAP across IoU thresholds from 0.5 to 0.95 in steps of 0.05. It provides a more stringent evaluation.',
    loss: 'Loss is a measure of how wrong the model\'s predictions are. Training aims to minimize loss. Lower loss generally indicates better model performance.',
    fps: 'Frames Per Second (FPS) measures how many images the model can process in one second. Higher FPS means faster inference and better real-time performance.',
    'inference_time': 'Inference time is the duration required to process a single image. Lower inference time enables faster predictions and better user experience.',
  }

  // Find matching explanation
  const metricKey = Object.keys(explanations).find(key => 
    metric.toLowerCase().includes(key.toLowerCase())
  )
  const explanation = metricKey ? explanations[metricKey] : 'Performance metric for model evaluation.'

  return (
    <Tooltip content={explanation} position="top">
      <HelpCircle className="h-4 w-4 text-gray-500 hover:text-mars-400 cursor-help inline ml-1" />
    </Tooltip>
  )
}

export default MetricTooltip

