import { Routes, Route } from 'react-router'
import HomePage from '@/pages/HomePage'
import ActivityPage from '@/pages/ActivityPage'
import RoomPage from '@/pages/RoomPage'
import LeaderboardPage from '@/pages/LeaderboardPage'
import HistoryPage from '@/pages/HistoryPage'
import AwardPage from '@/pages/AwardPage'

function App() {
  return (
    <div className="min-h-screen bg-cream relative">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/room/:code" element={<RoomPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/awards" element={<AwardPage />} />
      </Routes>
    </div>
  )
}

export default App
