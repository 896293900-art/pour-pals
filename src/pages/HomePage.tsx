import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAppStore } from '@/lib/store'
import CONFIG from '@/lib/config'
import type { CheckIn } from '@/lib/store'

// ---- Tree display ----
function TreeDisplay() {
  const getStreak = useAppStore(s => s.getStreak)
  const streak = getStreak()
  const stages = CONFIG.tree.stages
  let current = stages[0]
  for (const s of stages) { if (streak >= s.days) current = s }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-5xl ${streak > 0 ? 'animate-breathe' : ''}`}>{current.emoji}</span>
      <span className="text-xs font-bold text-text-light">{current.label}</span>
      {streak > 0 && <span className="text-[10px] text-text-muted">已连续浇水 {streak} 天</span>}
    </div>
  )
}

// ---- Water check-in ----
function WaterCheckIn() {
  const [selectedAmount, setSelectedAmount] = useState(2)
  const [animating, setAnimating] = useState(false)
  const [showSlogan, setShowSlogan] = useState<string | null>(null)
  const [rippleKey, setRippleKey] = useState(0)
  const addCheckIn = useAppStore(s => s.addCheckIn)
  const getTodayWaterTotal = useAppStore(s => s.getTodayWaterTotal)

  const handleDrink = async () => {
    if (animating) return
    setAnimating(true)
    setRippleKey(k => k + 1)
    const amount = CONFIG.water.amounts[selectedAmount]
    const checkIn = await addCheckIn('water', '喝水', amount.label, amount.ml)
    setShowSlogan(checkIn.slogan)
    setTimeout(() => setAnimating(false), 800)
    setTimeout(() => setShowSlogan(null), 2500)
  }

  const total = getTodayWaterTotal()
  const progress = Math.min(total / CONFIG.water.dailyGoal, 1)

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-cream-deep)" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-mint)" strokeWidth="8"
              strokeLinecap="round" strokeDasharray={`${progress * 264} 264`}
              className="transition-all duration-700 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-mint-dark">{total}</span>
            <span className="text-[10px] text-text-muted">/ {CONFIG.water.dailyGoal}ml</span>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-1">
          {progress >= 1 ? '🎉 今日目标达成！' : `还差 ${CONFIG.water.dailyGoal - total}ml`}
        </p>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {CONFIG.water.amounts.map((a, i) => (
          <button key={i} onClick={() => setSelectedAmount(i)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200
              ${selectedAmount === i ? 'bg-mint text-white shadow-md shadow-mint/30 scale-105' : 'bg-white/70 text-text-light hover:bg-white/90'}`}>
            {a.icon} {a.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center relative">
        {animating && <div key={rippleKey} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-mint/30 animate-ripple" />
        </div>}
        <button onClick={handleDrink} disabled={animating}
          className={`w-24 h-24 rounded-full bg-gradient-to-br from-mint to-mint-dark
            text-white text-4xl shadow-xl shadow-mint/30 hover:scale-110 active:scale-95
            transition-all duration-200 ${animating ? 'animate-wiggle' : 'hover:shadow-2xl'}`}>
          💦
        </button>
        <p className="text-sm font-bold text-text-light mt-2">浇一下</p>
      </div>

      {showSlogan && (
        <div className="text-center animate-slogan-pop">
          <p className="text-sm font-bold text-mint-dark bg-mint-light/40 rounded-2xl px-4 py-2 inline-block">{showSlogan}</p>
        </div>
      )}
    </div>
  )
}

// ---- Check-in item ----
function CheckInItem({ checkIn }: { checkIn: CheckIn }) {
  const time = new Date(checkIn.timestamp)
  const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`
  const activityEmoji = checkIn.type === 'water' ? '💦' : (CONFIG.activities.find(a => a.label === checkIn.content)?.emoji || '📍')

  return (
    <div className="flex items-start gap-3 animate-fade-in-up">
      <div className="flex flex-col items-center">
        <span className="text-xl">{activityEmoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text">{checkIn.name}</span>
          <span className="text-xs text-text-muted">{timeStr}</span>
        </div>
        <p className="text-sm font-bold text-text">{checkIn.content}</p>
        <p className="text-xs text-text-light italic">{checkIn.abstract}</p>
        {checkIn.type === 'water' && checkIn.amount_ml > 0 && (
          <p className="text-[10px] text-mint">{checkIn.amount_ml}ml</p>
        )}
      </div>
    </div>
  )
}

// ---- Fire warning ----
function FireWarning() {
  const [warning, setWarning] = useState<string | null>(null)
  const getFireWarning = useAppStore(s => s.getFireWarning)
  useEffect(() => {
    const w = getFireWarning(); setWarning(w)
    const interval = setInterval(() => setWarning(getFireWarning()), 60000)
    return () => clearInterval(interval)
  }, [getFireWarning])
  if (!warning) return null
  return (
    <div className="bg-gradient-to-r from-peach/20 to-coral/20 rounded-2xl px-4 py-3 text-center animate-fade-in-up">
      <p className="text-sm font-bold text-peach-deep">{warning}</p>
    </div>
  )
}

// ---- Streak badge ----
function StreakBadge() {
  const getStreak = useAppStore(s => s.getStreak)
  const streak = getStreak()
  if (streak === 0) return null
  return (
    <div className="flex items-center gap-1.5 bg-coral/10 rounded-full px-3 py-1">
      <span className="text-lg">🔥</span>
      <span className="text-sm font-black text-coral">{streak}</span>
      <span className="text-[10px] text-text-muted">天浇树</span>
    </div>
  )
}

// ---- Room quick entry ----
function RoomEntry() {
  const room = useAppStore(s => s.room)
  const roomLeaderboard = useAppStore(s => s.roomLeaderboard)
  if (!room) return null

  const top = roomLeaderboard[0]
  return (
    <Link to="/room" className="block">
      <div className="glass-card p-3 flex items-center gap-3 hover:scale-[1.02] transition-transform">
        <span className="text-2xl">💦</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text truncate">{room.name}</p>
          <p className="text-[10px] text-text-muted">{roomLeaderboard.length} 人 · {room.code}</p>
        </div>
        {top && <span className="text-[10px] text-peach font-bold">局长: {top.name}</span>}
        <span className="text-text-muted text-sm">→</span>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const { myName, setMyName, room, roomCheckIns, getTodayWaterTotal } = useAppStore()
  const [nameInput, setNameInput] = useState('')
  const [tab, setTab] = useState<'water' | 'feed'>('water')
  const [showNameModal, setShowNameModal] = useState(!myName)

  const todayMyWater = getTodayWaterTotal()

  const handleNameSubmit = async () => {
    if (nameInput.trim()) {
      await setMyName(nameInput.trim())
      setShowNameModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream pb-24 relative overflow-hidden">
      <div className="blob-mint" style={{ top: '-80px', right: '-60px' }} />
      <div className="blob-peach" style={{ top: '20%', left: '-50px' }} />
      <div className="blob-lavender" style={{ bottom: '10%', right: '-40px' }} />

      <div className="absolute top-[8%] right-[10%] text-2xl animate-float opacity-50">🌿</div>
      <div className="absolute top-[15%] left-[6%] text-xl animate-float-delay opacity-40">🍃</div>
      <div className="absolute bottom-[30%] right-[5%] text-xl animate-float-slow opacity-30">☁️</div>

      {showNameModal && (
        <div className="fixed inset-0 bg-text/30 z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-xs w-full space-y-4 animate-slogan-pop">
            <h2 className="text-xl font-bold text-center" style={{ fontFamily: 'var(--font-display)' }}>先起个名字吧 ✨</h2>
            <input value={nameInput} onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
              placeholder="你的昵称" maxLength={20}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-cream-deep bg-white/80 focus:border-mint focus:outline-none text-sm" autoFocus />
            <button onClick={handleNameSubmit}
              className="w-full py-2.5 bg-mint text-white font-bold rounded-xl hover:bg-mint-dark active:scale-95 transition-all shadow-md shadow-mint/20">
              好了，开始浇水 🌱
            </button>
          </div>
        </div>
      )}

      <header className="relative z-10 pt-12 pb-6 px-6 text-center">
        <h1 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-display)' }}>
          {CONFIG.appEmoji} {CONFIG.appName}
        </h1>
        <p className="text-xs text-text-muted mt-1">{myName ? `你好呀，${myName}` : CONFIG.appSubtitle}</p>
        <div className="flex items-center justify-center gap-3 mt-3"><StreakBadge /></div>
      </header>

      <div className="px-6 mb-4 relative z-10"><TreeDisplay /></div>
      <div className="px-6 mb-4 relative z-10"><FireWarning /></div>

      {/* Room quick entry */}
      <div className="px-6 mb-4 relative z-10"><RoomEntry /></div>

      <div className="px-6 mb-4 relative z-10">
        <div className="flex bg-white/50 rounded-2xl p-1 gap-1">
          <button onClick={() => setTab('water')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'water' ? 'bg-mint text-white shadow-md' : 'text-text-light'}`}>
            💦 浇树
          </button>
          <button onClick={() => setTab('feed')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'feed' ? 'bg-peach text-white shadow-md' : 'text-text-light'}`}>
            📍 报备动态
          </button>
        </div>
      </div>

      <div className="px-6 relative z-10">
        {tab === 'water' ? (
          <WaterCheckIn />
        ) : (
          <div className="space-y-3">
            {roomCheckIns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-2 animate-float">🌙</p>
                <p className="text-sm text-text-muted">{room ? '圈里今天还没有动态' : '今天还没有动态'}</p>
                <Link to="/activity">
                  <button className="mt-3 px-4 py-2 bg-peach/20 text-peach-deep text-sm font-bold rounded-xl hover:bg-peach/30 transition-all">
                    去报备一下 →
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {roomCheckIns.map(c => <CheckInItem key={c.id} checkIn={c} />)}
              </div>
            )}
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-cream-deep z-40">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-0.5 text-mint"><span className="text-xl">💦</span><span className="text-[10px] font-bold">浇水</span></Link>
          <Link to="/activity" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-peach"><span className="text-xl">📍</span><span className="text-[10px] font-bold">报备</span></Link>
          <Link to="/room" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-lavender"><span className="text-xl">💦</span><span className="text-[10px] font-bold">圈子</span></Link>
          <Link to="/leaderboard" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-coral"><span className="text-xl">🏆</span><span className="text-[10px] font-bold">排行</span></Link>
          <Link to="/awards" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-peach-deep"><span className="text-xl">🏅</span><span className="text-[10px] font-bold">奖状</span></Link>
        </div>
      </nav>
    </div>
  )
}
