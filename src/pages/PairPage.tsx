import { useState } from 'react'
import { Link } from 'react-router'
import { useAppStore } from '@/lib/store'

export default function PairPage() {
  const { pair, myName, generatePairCode, connectPartner, disconnectPair, exportMyData, importPartnerCheckIns } = useAppStore()
  const [partnerCodeInput, setPartnerCodeInput] = useState('')
  const [partnerNameInput, setPartnerNameInput] = useState('')
  const [partnerDataInput, setPartnerDataInput] = useState('')
  const [copied, setCopied] = useState(false)
  const [showImport, setShowImport] = useState(false)

  const handleGenerate = () => {
    generatePairCode()
  }

  const handleConnect = () => {
    if (partnerCodeInput.trim() && partnerNameInput.trim() && pair) {
      connectPartner(partnerCodeInput.trim(), partnerNameInput.trim())
      setPartnerCodeInput('')
      setPartnerNameInput('')
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const handleImportPartner = () => {
    try {
      const data = JSON.parse(partnerDataInput)
      if (Array.isArray(data.checkIns)) {
        importPartnerCheckIns(data.checkIns)
        setPartnerDataInput('')
        setShowImport(false)
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-cream pb-24 relative overflow-hidden">
      <div className="blob-lavender" style={{ top: '-60px', right: '-40px' }} />
      <div className="blob-mint" style={{ bottom: '10%', left: '-40px' }} />

      <header className="relative z-10 pt-12 pb-4 px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-lg">←</Link>
          <h1 className="text-xl font-bold text-text" style={{ fontFamily: 'var(--font-display)' }}>
            💕 配对
          </h1>
        </div>
        <p className="text-xs text-text-muted mt-1">和你的那个人一起咕嘟</p>
      </header>

      <div className="px-6 space-y-5 relative z-10">
        {!pair ? (
          /* No pair yet - generate code */
          <div className="glass-card p-6 text-center space-y-4">
            <div className="text-5xl animate-breathe">🤝</div>
            <p className="text-sm text-text-light">
              生成你的配对码，分享给对方<br />
              对方输入你的码就能配对啦
            </p>
            <button onClick={handleGenerate}
              className="px-6 py-2.5 bg-lavender text-white font-bold rounded-xl
                hover:bg-lavender/80 active:scale-95 transition-all shadow-md">
              生成配对码 ✨
            </button>
          </div>
        ) : !pair.partnerCode ? (
          /* Code generated, waiting for partner */
          <div className="glass-card p-6 text-center space-y-4">
            <p className="text-sm text-text-light">你的配对码是</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-black text-lavender tracking-widest">{pair.myCode}</span>
              <button onClick={() => handleCopy(pair.myCode)}
                className="px-3 py-1.5 bg-lavender/20 text-lavender rounded-lg text-xs font-bold
                  hover:bg-lavender/30 transition-all">
                {copied ? '✅ 已复制' : '📋 复制'}
              </button>
            </div>
            <p className="text-xs text-text-muted">把码发给对方，让他们输入连接</p>

            <div className="border-t border-cream-deep pt-4 mt-4 space-y-3">
              <p className="text-xs font-bold text-text-muted">输入对方的配对码</p>
              <input
                value={partnerCodeInput}
                onChange={e => setPartnerCodeInput(e.target.value.toUpperCase())}
                placeholder="对方的码"
                maxLength={6}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream-deep bg-white/80
                  focus:border-lavender focus:outline-none text-sm text-center tracking-widest
                  uppercase transition-colors"
              />
              <input
                value={partnerNameInput}
                onChange={e => setPartnerNameInput(e.target.value)}
                placeholder="对方的名字"
                maxLength={20}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream-deep bg-white/80
                  focus:border-lavender focus:outline-none text-sm transition-colors"
              />
              <button onClick={handleConnect}
                disabled={!partnerCodeInput.trim() || !partnerNameInput.trim()}
                className="w-full py-2.5 bg-lavender text-white font-bold rounded-xl
                  hover:bg-lavender/80 active:scale-95 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed">
                配对！💕
              </button>
            </div>
          </div>
        ) : (
          /* Paired */
          <div className="glass-card p-6 text-center space-y-4">
            <div className="text-5xl animate-breathe">💑</div>
            <p className="text-lg font-bold text-text">
              {myName} & {pair.partnerName}
            </p>
            <p className="text-xs text-text-muted">
              配对码: {pair.myCode} ↔ {pair.partnerCode}
            </p>
            <p className="text-xs text-text-muted">
              已配对 {Math.floor((Date.now() - pair.pairedAt) / 86400000)} 天
            </p>
            <button onClick={() => handleCopy(exportMyData())}
              className="px-4 py-2 bg-mint/20 text-mint-dark text-sm font-bold rounded-xl
                hover:bg-mint/30 transition-all">
              📤 导出我的数据（发给对方同步）
            </button>
            <div className="border-t border-cream-deep pt-3">
              <button onClick={() => setShowImport(!showImport)}
                className="text-xs text-text-muted hover:text-text transition-colors">
                📥 {showImport ? '收起' : '导入对方数据'}
              </button>
              {showImport && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={partnerDataInput}
                    onChange={e => setPartnerDataInput(e.target.value)}
                    placeholder="粘贴对方导出的数据…"
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border-2 border-cream-deep bg-white/80
                      focus:border-lavender focus:outline-none text-xs transition-colors"
                  />
                  <button onClick={handleImportPartner}
                    className="px-4 py-2 bg-lavender text-white text-xs font-bold rounded-xl
                      hover:bg-lavender/80 active:scale-95 transition-all">
                    导入
                  </button>
                </div>
              )}
            </div>
            <div className="border-t border-cream-deep pt-3">
              <button onClick={disconnectPair}
                className="text-xs text-coral/70 hover:text-coral transition-colors">
                解除配对
              </button>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="glass-card p-5 space-y-3">
          <p className="text-sm font-bold text-text">🤔 配对怎么用？</p>
          <div className="text-xs text-text-light space-y-2">
            <p>1. 你和对方都生成配对码</p>
            <p>2. 互相交换码并输入对方的名字</p>
            <p>3. 配对成功后，可以互相导出/导入打卡数据</p>
            <p>4. 在首页「报备动态」tab 看到对方今天的打卡</p>
            <p className="text-text-muted italic mt-2">
              💡 数据存在浏览器本地，通过导出/导入来同步对方的动态
            </p>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-cream-deep z-40">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-mint transition-colors">
            <span className="text-xl">💧</span>
            <span className="text-[10px] font-bold">首页</span>
          </Link>
          <Link to="/activity" className="flex flex-col items-center gap-0.5 text-text-muted hover:text-peach transition-colors">
            <span className="text-xl">📍</span>
            <span className="text-[10px] font-bold">报备</span>
          </Link>
          <Link to="/pair" className="flex flex-col items-center gap-0.5 text-lavender">
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
