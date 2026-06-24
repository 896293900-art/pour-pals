import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { useAppStore } from '@/lib/store'

export default function RoomPage() {
  const { code } = useParams<{ code?: string }>()
  const { room, myName, setMyName, createRoom, joinRoom, leaveRoom, getRoomLink, roomLeaderboard } = useAppStore()
  const [nameInput, setNameInput] = useState('')
  const [roomNameInput, setRoomNameInput] = useState('')
  const [joinCodeInput, setJoinCodeInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'creating' | 'joining' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const [showLink, setShowLink] = useState(false)

  // Auto-join if code in URL
  useEffect(() => {
    if (code && !room) {
      joinRoom(code).then(ok => {
        if (!ok) { setErrorMsg('房间不存在或已过期') }
      })
    }
  }, [code])

  const handleCreate = async () => {
    if (!myName && !nameInput.trim()) { setErrorMsg('先起个名字'); return }
    if (!myName) await setMyName(nameInput.trim())
    setStatus('creating')
    const roomCode = await createRoom(roomNameInput.trim() || '浇水圈')
    if (roomCode) {
      setStatus('done')
      setShowLink(true)
    } else {
      setStatus('error')
      setErrorMsg('创建失败，请重试')
    }
  }

  const handleJoin = async () => {
    if (!myName && !nameInput.trim()) { setErrorMsg('先起个名字'); return }
    if (!myName) await setMyName(nameInput.trim())
    setStatus('joining')
    const ok = await joinRoom(joinCodeInput.trim().toUpperCase())
    if (ok) setStatus('done')
    else { setStatus('error'); setErrorMsg('房间不存在') }
  }

  const handleCopy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  // In room — show link + leaderboard preview
  if (room) {
    return (
      <div className="min-h-screen bg-cream pb-24 relative overflow-hidden">
        <div className="blob-lavender" style={{ top: '-60px', right: '-40px' }} />
        <div className="blob-mint" style={{ bottom: '10%', left: '-40px' }} />

        <header className="relative z-10 pt-12 pb-4 px-6">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-lg">←</Link>
            <h1 className="text-xl font-bold text-text" style={{ fontFamily: 'var(--font-display)' }}>
              💦 {room.name}
            </h1>
          </div>
        </header>

        <div className="px-6 space-y-5 relative z-10">
          {/* Room info card */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-text">房间码</span>
              <span className="text-lg font-black text-mint tracking-widest">{room.code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">成员</span>
              <span className="text-sm font-bold text-text">{roomLeaderboard.length} 人</span>
            </div>
            <button onClick={() => setShowLink(!showLink)}
              className="w-full py-2 bg-mint/15 text-mint-dark text-sm font-bold rounded-xl hover:bg-mint/25 transition-all">
              {showLink ? '收起邀请链接' : '🔗 邀请朋友'}
            </button>
            {showLink && (
              <div className="space-y-2 animate-fade-in-up">
                <div className="bg-white/80 rounded-xl px-3 py-2 text-xs text-text-muted break-all">
                  {getRoomLink()}
                </div>
                <button onClick={() => handleCopy(getRoomLink())}
                  className="w-full py-2 bg-mint text-white text-sm font-bold rounded-xl hover:bg-mint-dark active:scale-95 transition-all">
                  {copied ? '✅ 已复制' : '📋 复制链接'}
                </button>
                <p className="text-[10px] text-text-muted text-center">朋友点开链接直接进，不用注册</p>
              </div>
            )}
          </div>

          {/* Mini leaderboard */}
          {roomLeaderboard.length > 0 && (
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text">🏆 今日排行榜</span>
                <Link to="/leaderboard" className="text-xs text-mint hover:text-mint-dark transition-colors">
                  查看完整 →
                </Link>
              </div>
              {roomLeaderboard.slice(0, 3).map((m, i) => (
                <div key={m.uid} className={`flex items-center gap-3 py-1.5 ${i === 0 ? 'bg-peach/10 rounded-lg px-2' : ''}`}>
                  <span className="text-lg font-black text-text-light w-6 text-center">{i + 1}</span>
                  <span className="text-lg">{m.treeEmoji}</span>
                  <span className="text-sm font-bold text-text flex-1">{m.name}</span>
                  <span className="text-xs text-mint font-bold">{m.todayWater}ml</span>
                  {i === 0 && <span className="text-[10px] text-peach font-bold">局长</span>}
                </div>
              ))}
            </div>
          )}

          {/* Awards shortcut */}
          <Link to="/awards" className="block">
            <div className="glass-card p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform">
              <span className="text-2xl">🏅</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-text">荣誉奖状</p>
                <p className="text-[10px] text-text-muted">查看你获得的虚拟奖状</p>
              </div>
              <span className="text-text-muted">→</span>
            </div>
          </Link>

          {/* Leave */}
          <button onClick={leaveRoom}
            className="text-xs text-coral/50 hover:text-coral transition-colors mx-auto block">
            离开房间
          </button>
        </div>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-cream-deep z-40">
          <div className="max-w-lg mx-auto flex justify-around py-2">
            <Link to="/" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-mint"><span className="text-xl">💦</span><span className="text-[10px] font-bold">浇水</span></Link>
            <Link to="/activity" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-peach"><span className="text-xl">📍</span><span className="text-[10px] font-bold">报备</span></Link>
            <Link to="/room" className="flex flex-col items-center gap-0.5 text-lavender"><span className="text-xl">💦</span><span className="text-[10px] font-bold">圈子</span></Link>
            <Link to="/leaderboard" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-coral"><span className="text-xl">🏆</span><span className="text-[10px] font-bold">排行</span></Link>
            <Link to="/awards" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-peach-deep"><span className="text-xl">🏅</span><span className="text-[10px] font-bold">奖状</span></Link>
          </div>
        </nav>
      </div>
    )
  }

  // Not in room — create or join
  return (
    <div className="min-h-screen bg-cream pb-24 relative overflow-hidden">
      <div className="blob-lavender" style={{ top: '-60px', right: '-40px' }} />
      <div className="blob-mint" style={{ bottom: '20%', left: '-40px' }} />

      <header className="relative z-10 pt-12 pb-4 px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-lg">←</Link>
          <h1 className="text-xl font-bold text-text" style={{ fontFamily: 'var(--font-display)' }}>
            💦 浇水圈
          </h1>
        </div>
        <p className="text-xs text-text-muted mt-1">建个圈，发链接，朋友直接进</p>
      </header>

      {errorMsg && <div className="px-6 mb-3"><p className="text-xs text-coral bg-coral/10 rounded-xl px-3 py-2">{errorMsg}</p></div>}

      <div className="px-6 space-y-5 relative z-10">
        {/* Name input if not set */}
        {!myName && (
          <div className="glass-card p-5 space-y-3">
            <p className="text-sm font-bold text-text">先起个名字 ✨</p>
            <input value={nameInput} onChange={e => setNameInput(e.target.value)}
              placeholder="你在圈子里叫什么"
              maxLength={20}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-cream-deep bg-white/80 focus:border-mint focus:outline-none text-sm" />
          </div>
        )}

        {/* Create room */}
        <div className="glass-card p-5 space-y-3">
          <p className="text-sm font-bold text-text">🏡 建个新圈</p>
          <input value={roomNameInput} onChange={e => setRoomNameInput(e.target.value)}
            placeholder="圈子名称（默认：浇水圈）"
            maxLength={20}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-cream-deep bg-white/80 focus:border-mint focus:outline-none text-sm" />
          <button onClick={handleCreate} disabled={status === 'creating'}
            className="w-full py-2.5 bg-mint text-white font-bold rounded-xl hover:bg-mint-dark active:scale-95 transition-all disabled:opacity-50 shadow-md shadow-mint/20">
            {status === 'creating' ? '创建中…' : '创建圈子'}
          </button>
        </div>

        {/* Join room */}
        <div className="glass-card p-5 space-y-3">
          <p className="text-sm font-bold text-text">🔗 加入已有圈</p>
          <input value={joinCodeInput} onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
            placeholder="输入6位房间码"
            maxLength={6}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-cream-deep bg-white/80 focus:border-lavender focus:outline-none text-sm tracking-widest text-center" />
          <button onClick={handleJoin} disabled={status === 'joining' || !joinCodeInput.trim()}
            className="w-full py-2.5 bg-lavender text-white font-bold rounded-xl hover:bg-lavender/80 active:scale-95 transition-all disabled:opacity-50 shadow-md">
            {status === 'joining' ? '加入中…' : '加入圈子'}
          </button>
        </div>

        {/* How it works */}
        <div className="glass-card p-5 space-y-3">
          <p className="text-sm font-bold text-text">🤔 怎么玩？</p>
          <div className="text-xs text-text-light space-y-1.5">
            <p>1. 建圈（或输入码加入）</p>
            <p>2. 把链接发给朋友，点开直接进</p>
            <p>3. 大家一起喝水打卡，实时排行榜</p>
            <p>4. 拿奖状！水利局局长等你来当 👔</p>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-cream-deep z-40">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-mint"><span className="text-xl">💦</span><span className="text-[10px] font-bold">浇水</span></Link>
          <Link to="/activity" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-peach"><span className="text-xl">📍</span><span className="text-[10px] font-bold">报备</span></Link>
          <Link to="/room" className="flex flex-col items-center gap-0.5 text-lavender"><span className="text-xl">💦</span><span className="text-[10px] font-bold">圈子</span></Link>
          <Link to="/leaderboard" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-coral"><span className="text-xl">🏆</span><span className="text-[10px] font-bold">排行</span></Link>
          <Link to="/awards" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-peach-deep"><span className="text-xl">🏅</span><span className="text-[10px] font-bold">奖状</span></Link>
        </div>
      </nav>
    </div>
  )
}
