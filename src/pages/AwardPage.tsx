import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAppStore } from '@/lib/store'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import CONFIG from '@/lib/config'
import type { Award } from '@/lib/store'

// ---- Award certificate component ----
function CertificateCard({ award }: { award: Award }) {
  const cert = CONFIG.awards.certificate
  return (
    <div className="bg-gradient-to-br from-cream to-peach/5 rounded-2xl p-5 border-2 border-peach/20
      shadow-md relative overflow-hidden">
      {/* Stamp corner */}
      <div className="absolute top-3 right-3 text-3xl opacity-80 rotate-[-12deg]">{award.emoji}</div>

      <div className="space-y-2.5 text-center">
        <p className="text-[10px] text-text-muted tracking-widest">{cert.header}</p>
        <div className="border-t border-dashed border-peach/30 mx-auto w-3/4" />
        <p className="text-xs text-text-light">{cert.body.replace('{name}', award.name)}</p>
        <p className="text-xl font-black text-peach-deep" style={{ fontFamily: 'var(--font-display)' }}>
          {award.title}
        </p>
        <p className="text-[10px] text-text-muted italic">{award.desc}</p>
        <div className="border-t border-dashed border-peach/30 mx-auto w-3/4" />
        <p className="text-[10px] text-text-muted">{cert.footer}</p>
        <div className="inline-block bg-peach/10 rounded-lg px-3 py-1">
          <p className="text-[9px] font-bold text-peach/70">🎖 {cert.stamp} · {award.date}</p>
        </div>
      </div>
    </div>
  )
}

export default function AwardPage() {
  const { room, myAwards } = useAppStore()
  const [roomAwards, setRoomAwards] = useState<Award[]>([])

  // Listen to room awards
  useEffect(() => {
    if (!room) return
    const awardsRef = collection(db, 'rooms', room.id, 'awards')
    const q = query(awardsRef, orderBy('date', 'desc'), orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const awards = snap.docs.map(d => ({ id: d.id, ...d.data() } as Award))
      setRoomAwards(awards)
    })
    return unsub
  }, [room])

  const myUid = useAppStore(s => s.uid)
  const myRoomAwards = roomAwards.filter(a => a.uid === myUid)
  const otherAwards = roomAwards.filter(a => a.uid !== myUid).slice(0, 10)

  return (
    <div className="min-h-screen bg-cream pb-24 relative overflow-hidden">
      <div className="blob-peach" style={{ top: '-50px', left: '-30px' }} />
      <div className="blob-lavender" style={{ bottom: '20%', right: '-40px' }} />

      <header className="relative z-10 pt-12 pb-4 px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-lg">←</Link>
          <h1 className="text-xl font-bold text-text" style={{ fontFamily: 'var(--font-display)' }}>
            🏅 荣誉奖状
          </h1>
        </div>
        <p className="text-xs text-text-muted mt-1">浇水委员会出品</p>
      </header>

      <div className="px-6 space-y-6 relative z-10">
        {!room ? (
          <div className="text-center py-12">
            <span className="text-5xl animate-float">🏅</span>
            <p className="text-sm text-text-muted mt-2">加入浇水圈后才能拿奖状</p>
            <Link to="/room" className="inline-block mt-3 px-4 py-2 bg-mint text-white text-sm font-bold rounded-xl">
              去建/加圈 →
            </Link>
          </div>
        ) : (
          <>
            {/* My awards */}
            <div>
              <p className="text-sm font-bold text-text mb-3">🎖 我的奖状 {(myRoomAwards.length > 0 || myAwards.length > 0) ? `(${Math.max(myRoomAwards.length, myAwards.length)})` : ''}</p>
              {(myRoomAwards.length > 0 || myAwards.length > 0) ? (
                <div className="space-y-3">
                  {/* Merge and deduplicate */}
                  {[...myAwards, ...myRoomAwards].filter((a, i, arr) => arr.findIndex(x => x.id === a.id) === i).slice(0, 8).map(a => (
                    <CertificateCard key={a.id} award={a} />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-5 text-center">
                  <span className="text-4xl">🌱</span>
                  <p className="text-xs text-text-muted mt-2">还没有奖状，多喝水就能拿到</p>
                  <p className="text-[10px] text-text-muted">第一名当日自动获封「水利局局长」👔</p>
                </div>
              )}
            </div>

            {/* Others' awards */}
            {otherAwards.length > 0 && (
              <div>
                <p className="text-sm font-bold text-text mb-3">🎉 圈友获奖</p>
                <div className="space-y-2">
                  {otherAwards.slice(0, 5).map(a => (
                    <div key={a.id} className="bg-white/60 rounded-xl px-3 py-2 flex items-center gap-3">
                      <span className="text-xl">{a.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-text">{a.name} · {a.title}</p>
                        <p className="text-[10px] text-text-muted">{a.desc}</p>
                      </div>
                      <span className="text-[10px] text-text-muted">{a.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All achievable awards */}
            <div>
              <p className="text-sm font-bold text-text mb-3">📋 可解锁奖状</p>
              <div className="space-y-2">
                {CONFIG.awards.special.map(a => (
                  <div key={a.id} className="glass-card p-3 flex items-center gap-3">
                    <span className="text-2xl">{a.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-text">{a.title}</p>
                      <p className="text-[10px] text-text-muted">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-cream-deep z-40">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-mint"><span className="text-xl">💦</span><span className="text-[10px] font-bold">浇水</span></Link>
          <Link to="/activity" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-peach"><span className="text-xl">📍</span><span className="text-[10px] font-bold">报备</span></Link>
          <Link to="/room" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-lavender"><span className="text-xl">💦</span><span className="text-[10px] font-bold">圈子</span></Link>
          <Link to="/leaderboard" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-coral"><span className="text-xl">🏆</span><span className="text-[10px] font-bold">排行</span></Link>
          <Link to="/awards" className="flex flex-col items-center gap-0.5 text-peach-deep"><span className="text-xl">🏅</span><span className="text-[10px] font-bold">奖状</span></Link>
        </div>
      </nav>
    </div>
  )
}
