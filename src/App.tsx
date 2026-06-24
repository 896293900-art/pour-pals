import { Routes, Route } from 'react-router'
import HomePage from '@/pages/HomePage'
import ActivityPage from '@/pages/ActivityPage'
import PairPage from '@/pages/PairPage'
import HistoryPage from '@/pages/HistoryPage'

function App() {
  return (
    <div className="min-h-screen bg-cream relative">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/pair" element={<PairPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </div>
  )
}

export default App
