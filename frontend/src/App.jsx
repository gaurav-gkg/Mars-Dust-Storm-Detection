import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DustStormDetection from './pages/DustStormDetection'
import ResultsVisualization from './pages/ResultsVisualization'
import InferenceTime from './pages/InferenceTime'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detection" element={<DustStormDetection />} />
          <Route path="/visualization" element={<ResultsVisualization />} />
          <Route path="/inference" element={<InferenceTime />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

