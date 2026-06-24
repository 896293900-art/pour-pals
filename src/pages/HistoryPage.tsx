import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { useAppStore } from '@/lib/store'
import CONFIG from '@/lib/config'
import type { CheckIn } from '@/lib/store'

function getDayLabel(date: Date): string {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
  const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
  if (dateStr === todayStr) return '今天'
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yStr = `${yesterday.getFullYear()}-${yesterday.getMonth()+1}-${yesterday.getDate()}`
  if (dateStr === yStr) return '昨天'
  return `${date.getMonth()+1}/${date.getDate()}`
}

function getDateStr(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function HistoryPage() {
  const { checkIns, removeCheckIn, exportMyData, getStreak } = useAppStore()
  const [showExport, setShowExport] = useState(false)
  const [filter, setFilter] = useState<'all' | 'water' | 'activity'>('all')

  const streak = getStreak()

  const filtered = useMemo(() => {
    if (filter === 'all') return checkIns
    return checkIns.filter(c => c.type === filter)
  }, [checkIns, filter])

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, CheckIn[]>()
    for (const c of filtered) {
      const key = getDateStr(c.timestamp)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(c)
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  // Stats
  const totalWater = checkIns.filter(c => c.type === 'water').reduce((s, c) => s + c.amount_ml, 0)
  const totalCheckIns = checkIns.length
  const totalDays = new Set(checkIns.map(c => getDateStr(c.timestamp))).size

  return (
    <div className="min-h-screen bg-cream pb-24 relative overflow-hidden">
      <div className="blob-mint" style={{ top: '-60px', left: '-40px' }} />
      <div className="blob-peach" style={{ bottom: '20%', right: '-30px' }} />

      <header className="relative z-10 pt-12 pb-4 px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-lg">←</Link>
          <h1 className="text-xl font-bold text-text" style={{ fontFamily: 'var(--font-display)' }}>
            📊 历史记录
          </h1>
        </div>
      </header>

      {/* Stats cards */}
      <div className="px-6 mb-5 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3 text-center">
            <span className="text-2xl">🌳</span>
            <p className="text-xl font-black text-coral">{streak}</p>
            <p className="text-[10px] text-text-muted">天浇树</p>
          </div>
          <div className="glass-card p-3 text-center">
            <span className="text-2xl">💦</span>
            <p className="text-xl font-black text-mint-dark">{(totalWater / 1000).toFixed(1)}L</p>
            <p className="text-[10px] text-text-muted">累计浇树</p>
          </div>
          <div className="glass-card p-3 text-center">
            <span className="text-2xl">📍</span>
            <p className="text-xl font-black text-peach-deep">{totalCheckIns}</p>
            <p className="text-[10px] text-text-muted">次打卡</p>
          </div>
        </div>
        <p className="text-[10px] text-text-muted text-center mt-2">跨越.*天的浇树记录</p>
      </div>

      {/* Filter */}
      <div className="px-6 mb-3 relative z-10">
        <div className="flex gap-2">
          {(['all', 'water', 'activity'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                ${filter === f ? 'bg-mint text-white shadow-md' : 'bg-white/60 text-text-light'}`}>
              {f === 'all' ? '📋 全部' : f === 'water' ? '💦 喝水' : '📍 报备'}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 space-y-5 relative z-10">
        {grouped.map(([dateKey, items]) => (
          <div key={dateKey}>
            <h3 className="text-xs font-bold text-text-muted mb-2">
              {getDayLabel(new Date(dateKey + 'T12:00:00'))}
              <span className="ml-2 text-text-muted/50">{dateKey}</span>
            </h3>
            <div className="space-y-2">
              {items.map(c => {
                const time = new Date(c.timestamp)
                const timeStr = `${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`
                const activityEmoji = c.type === 'water' ? '💦' : (CONFIG.activities.find(a => a.label === c.content)?.emoji || '📍')
                return (
                  <div key={c.id} className="flex items-center gap-3 bg-white/60 rounded-xl px-3 py-2 group">
                    <span className="text-lg">{activityEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text">{c.content}</span>
                        <span className="text-[10px] text-text-muted">{timeStr}</span>
                      </div>
                      <p className="text-[11px] text-text-light italic truncate">{c.abstract}</p>
                      {c.type === 'water' && c.amount_ml > 0 && (
                        <span className="text-[10px] text-mint">{c.amount_ml}ml</span>
                      )}
                    </div>
                    <button onClick={() => removeCheckIn(c.id)}
                      className="opacity-0 group-hover:opacity-100 text-text-muted/40
                        hover:text-coral text-xs transition-opacity">
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {grouped.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-2 animate-float">🌊</p>
            <p className="text-sm text-text-muted">还没有记录，去打卡吧</p>
          </div>
        )}
      </div>

      {/* Export */}
      <div className="px-6 mt-6 relative z-10">
        <button onClick={() => setShowExport(!showExport)}
          className="text-xs text-text-muted hover:text-text transition-colors">
          📤 {showExport ? '收起导出' : '导出/备份数据'}
        </button>
        {showExport && (
          <div className="mt-2 glass-card p-4 space-y-3">
            <textarea
              readOnly
              value={exportMyData()}
              rows={4}
              className="w-full px-3 py-2 rounded-xl border-2 border-cream-deep bg-white/80
                text-xs font-mono"
              onClick={e => (e.target as HTMLTextAreaElement).select()}
            />
            <button onClick={() => navigator.clipboard.writeText(exportMyData())}
              className="px-4 py-2 bg-mint/20 text-mint-dark text-xs font-bold rounded-xl
                hover:bg-mint/30 transition-all">
              📋 复制到剪贴板
            </button>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-cream-deep z-40">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-mint transition-colors">
            <span className="text-xl">💦</span>
            <span className="text-[10px] font-bold">浇水</span>
          </Link>
          <Link to="/activity" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-peach transition-colors">
            <span className="text-xl">📍</span>
            <span className="text-[10px] font-bold">报备</span>
          </Link>
          <Link to="/pair" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-lavender transition-colors">
            <span className="text-xl">💕</span>
            <span className="text-[10px] font-bold">配对</span>
          </Link>
          <Link to="/history" className="flex flex-col items-center gap-0.5 text-text">
            <span className="text-xl">📊</span>
            <span className="text-[10px] font-bold">历史</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
