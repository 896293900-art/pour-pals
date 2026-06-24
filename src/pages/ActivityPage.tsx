import { useState } from 'react'
import { Link } from 'react-router'
import { useAppStore } from '@/lib/store'
import CONFIG from '@/lib/config'

export default function ActivityPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [customText, setCustomText] = useState('')
  const [showSlogan, setShowSlogan] = useState<string | null>(null)
  const [animating, setAnimating] = useState(false)
  const addCheckIn = useAppStore(s => s.addCheckIn)

  const groups = [...new Set(CONFIG.activities.map(a => a.group))]

  const handleActivity = (activity: typeof CONFIG.activities[0]) => {
    if (animating) return
    setAnimating(true)
    const checkIn = addCheckIn('activity', activity.label, activity.abstract)
    setShowSlogan(checkIn.slogan)
    setTimeout(() => setAnimating(false), 600)
    setTimeout(() => setShowSlogan(null), 2500)
  }

  const handleCustom = () => {
    if (!customText.trim() || animating) return
    setAnimating(true)
    const checkIn = addCheckIn('activity', customText.trim(), '在做一件说了也不太明白的事')
    setShowSlogan(checkIn.slogan)
    setCustomText('')
    setTimeout(() => setAnimating(false), 600)
    setTimeout(() => setShowSlogan(null), 2500)
  }

  const filteredActivities = selectedGroup
    ? CONFIG.activities.filter(a => a.group === selectedGroup)
    : CONFIG.activities

  return (
    <div className="min-h-screen bg-cream pb-24 relative overflow-hidden">
      <div className="blob-peach" style={{ top: '-40px', left: '-40px' }} />
      <div className="blob-lavender" style={{ bottom: '20%', right: '-30px' }} />

      {/* Header */}
      <header className="relative z-10 pt-12 pb-4 px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-lg">←</Link>
          <h1 className="text-xl font-bold text-text" style={{ fontFamily: 'var(--font-display)' }}>
            📍 报备一下
          </h1>
        </div>
        <p className="text-xs text-text-muted mt-1">选一个场景，或者自己写一个</p>
      </header>

      {/* Group tabs */}
      <div className="px-6 mb-4 relative z-10">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelectedGroup(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all
              ${!selectedGroup ? 'bg-mint text-white shadow-md' : 'bg-white/60 text-text-light'}`}>
            全部
          </button>
          {groups.map(g => (
            <button key={g} onClick={() => setSelectedGroup(selectedGroup === g ? null : g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                ${selectedGroup === g ? 'bg-peach text-white shadow-md' : 'bg-white/60 text-text-light'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Activity grid */}
      <div className="px-6 relative z-10">
        <div className="grid grid-cols-3 gap-2.5">
          {filteredActivities.map(a => (
            <button
              key={a.id}
              onClick={() => handleActivity(a)}
              disabled={animating}
              className="glass-card p-3 text-center hover:scale-105 active:scale-95
                transition-all duration-200 group"
            >
              <span className="text-2xl block group-hover:animate-wiggle">{a.emoji}</span>
              <span className="text-xs font-bold text-text block mt-1">{a.label}</span>
              <span className="text-[10px] text-text-muted block leading-tight mt-0.5">{a.abstract}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom input */}
      <div className="px-6 mt-6 relative z-10">
        <div className="glass-card p-4 space-y-3">
          <p className="text-xs font-bold text-text-muted">✏️ 自定义报备</p>
          <div className="flex gap-2">
            <input
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCustom()}
              placeholder="写点什么…比如「在和猫打架」"
              maxLength={50}
              className="flex-1 px-3 py-2 rounded-xl border-2 border-cream-deep bg-white/80
                focus:border-peach focus:outline-none text-sm transition-colors"
            />
            <button onClick={handleCustom} disabled={!customText.trim() || animating}
              className="px-4 py-2 bg-peach text-white font-bold rounded-xl
                hover:bg-peach-deep active:scale-95 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-peach/20">
              报！
            </button>
          </div>
        </div>
      </div>

      {/* Slogan pop */}
      {showSlogan && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-slogan-pop">
            <p className="text-base font-bold text-text bg-white/90 rounded-2xl px-5 py-3 shadow-xl">
              {showSlogan}
            </p>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-cream-deep z-40">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-mint transition-colors">
            <span className="text-xl">💧</span>
            <span className="text-[10px] font-bold">首页</span>
          </Link>
          <Link to="/activity" className="flex flex-col items-center gap-0.5 text-peach">
            <span className="text-xl">📍</span>
            <span className="text-[10px] font-bold">报备</span>
          </Link>
          <Link to="/pair" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-lavender transition-colors">
            <span className="text-xl">💕</span>
            <span className="text-[10px] font-bold">配对</span>
          </Link>
          <Link to="/history" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-text transition-colors">
            <span className="text-xl">📊</span>
            <span className="text-[10px] font-bold">历史</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
