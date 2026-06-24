import { Link } from 'react-router'
import { useAppStore } from '@/lib/store'
import CONFIG from '@/lib/config'

export default function LeaderboardPage() {
  const { room, roomLeaderboard } = useAppStore()

  if (!room) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <span className="text-5xl animate-float">🏆</span>
          <p className="text-sm text-text-muted">先加入一个浇水圈才能看排行榜</p>
          <Link to="/room" className="inline-block px-4 py-2 bg-mint text-white text-sm font-bold rounded-xl">
            去建/加圈 →
          </Link>
        </div>
      </div>
    )
  }

  // Assign daily award titles to top 3
  const dailyAwards = CONFIG.awards.daily

  return (
    <div className="min-h-screen bg-cream pb-24 relative overflow-hidden">
      <div className="blob-peach" style={{ top: '-60px', right: '-40px' }} />
      <div className="blob-lavender" style={{ bottom: '15%', left: '-40px' }} />

      <header className="relative z-10 pt-12 pb-4 px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-lg">←</Link>
          <h1 className="text-xl font-bold text-text" style={{ fontFamily: 'var(--font-display)' }}>
            🏆 今日排行榜
          </h1>
        </div>
        <p className="text-xs text-text-muted mt-1">{room.name} · 实时更新</p>
      </header>

      <div className="px-6 space-y-4 relative z-10">
        {/* Podium - top 3 */}
        {roomLeaderboard.length >= 1 && (
          <div className="glass-card p-5 space-y-4">
            {/* #1 - The局长 */}
            {roomLeaderboard[0] && (
              <div className="bg-gradient-to-r from-peach/15 to-coral/10 rounded-2xl p-4 text-center space-y-2">
                <span className="text-5xl animate-breathe">{dailyAwards[0].emoji}</span>
                <p className="text-lg font-black text-text">{roomLeaderboard[0].name}</p>
                <div className="inline-block bg-peach/20 rounded-xl px-4 py-1.5">
                  <p className="text-sm font-bold text-peach-deep">{dailyAwards[0].title}</p>
                </div>
                <p className="text-[10px] text-text-muted">{dailyAwards[0].desc}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-2xl">{roomLeaderboard[0].treeEmoji}</span>
                  <span className="text-xl font-black text-mint">{roomLeaderboard[0].todayWater}ml</span>
                </div>
              </div>
            )}

            {/* #2 and #3 */}
            <div className="grid grid-cols-2 gap-3">
              {roomLeaderboard[1] && (
                <div className="bg-lavender/10 rounded-2xl p-3 text-center space-y-1.5">
                  <span className="text-3xl">{dailyAwards[1].emoji}</span>
                  <p className="text-sm font-bold text-text">{roomLeaderboard[1].name}</p>
                  <p className="text-xs font-bold text-lavender">{dailyAwards[1].title}</p>
                  <p className="text-[10px] text-text-muted">{dailyAwards[1].desc}</p>
                  <p className="text-sm font-black text-mint">{roomLeaderboard[1].todayWater}ml</p>
                </div>
              )}
              {roomLeaderboard[2] && (
                <div className="bg-mint/10 rounded-2xl p-3 text-center space-y-1.5">
                  <span className="text-3xl">{dailyAwards[2].emoji}</span>
                  <p className="text-sm font-bold text-text">{roomLeaderboard[2].name}</p>
                  <p className="text-xs font-bold text-mint-dark">{dailyAwards[2].title}</p>
                  <p className="text-[10px] text-text-muted">{dailyAwards[2].desc}</p>
                  <p className="text-sm font-black text-mint">{roomLeaderboard[2].todayWater}ml</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full list */}
        {roomLeaderboard.length > 3 && (
          <div className="glass-card p-4 space-y-2">
            <p className="text-xs font-bold text-text-muted mb-2">完整排名</p>
            {roomLeaderboard.slice(3).map((m, i) => (
              <div key={m.uid} className="flex items-center gap-3 py-1.5">
                <span className="text-sm font-black text-text-light w-5 text-center">{i + 4}</span>
                <span className="text-base">{m.treeEmoji}</span>
                <span className="text-sm font-bold text-text flex-1">{m.name}</span>
                <span className="text-xs text-mint font-bold">{m.todayWater}ml</span>
              </div>
            ))}
          </div>
        )}

        {roomLeaderboard.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl animate-float">🌿</span>
            <p className="text-sm text-text-muted mt-2">今天还没人浇水，快来当局长！</p>
          </div>
        )}

        {/* Daily reset notice */}
        <div className="text-center">
          <p className="text-[10px] text-text-muted">排行榜每天零点重置，局长的位置等你来坐</p>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-cream-deep z-40">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-mint"><span className="text-xl">💦</span><span className="text-[10px] font-bold">浇水</span></Link>
          <Link to="/activity" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-peach"><span className="text-xl">📍</span><span className="text-[10px] font-bold">报备</span></Link>
          <Link to="/room" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-lavender"><span className="text-xl">💦</span><span className="text-[10px] font-bold">圈子</span></Link>
          <Link to="/leaderboard" className="flex flex-col items-center gap-0.5 text-coral"><span className="text-xl">🏆</span><span className="text-[10px] font-bold">排行</span></Link>
          <Link to="/awards" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-peach-deep"><span className="text-xl">🏅</span><span className="text-[10px] font-bold">奖状</span></Link>
        </div>
      </nav>
    </div>
  )
}
