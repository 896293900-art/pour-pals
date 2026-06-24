import { create } from 'zustand'
import CONFIG from '@/lib/config'

export type CheckInType = 'water' | 'activity'

export interface CheckIn {
  id: string
  type: CheckInType
  content: string      // activity label or "喝水"
  abstract: string     // 抽象描述
  slogan: string       // 随机标语
  amount_ml: number    // 喝水量 (water only)
  timestamp: number    // unix ms
}

export interface PairInfo {
  myCode: string       // 我的配对码
  partnerCode: string  // 对方的配对码
  partnerName: string  // 对方昵称
  pairedAt: number     // 配对时间
}

const STORAGE_KEY = 'sip-together'
const PAIRS_STORAGE_KEY = 'sip-pairs'

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function saveToStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data))
}

function generateCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getTodayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// Shared state with partner via localStorage (same device) or manual sync
interface AppState {
  myName: string
  pair: PairInfo | null
  checkIns: CheckIn[]
  partnerCheckIns: CheckIn[]

  setMyName: (name: string) => void
  generatePairCode: () => string
  connectPartner: (code: string, name: string) => void
  disconnectPair: () => void
  addCheckIn: (type: CheckInType, content: string, abstract: string, amountMl?: number) => CheckIn
  removeCheckIn: (id: string) => void
  importPartnerCheckIns: (data: CheckIn[]) => void
  getTodayCheckIns: () => CheckIn[]
  getTodayPartnerCheckIns: () => CheckIn[]
  getTodayWaterTotal: () => number
  getStreak: () => number
  getMinutesSinceLastWater: () => number | null
  getFireWarning: () => string | null
  exportMyData: () => string
  importData: (json: string) => boolean
}

export const useAppStore = create<AppState>((set, get) => {
  const saved = loadFromStorage<{ name: string; checkIns: CheckIn[] }>(STORAGE_KEY, { name: '', checkIns: [] })
  const savedPair = loadFromStorage<PairInfo | null>(PAIRS_STORAGE_KEY, null)
  const savedPartner = loadFromStorage<CheckIn[]>('sip-partner-checkins', [])

  return {
    myName: saved.name || '',
    pair: savedPair,
    checkIns: saved.checkIns,
    partnerCheckIns: savedPartner,

    setMyName: (name) => {
      set({ myName: name })
      const state = get()
      saveToStorage(STORAGE_KEY, { name, checkIns: state.checkIns })
    },

    generatePairCode: () => {
      const code = generateCode()
      const pair: PairInfo = { myCode: code, partnerCode: '', partnerName: '', pairedAt: Date.now() }
      set({ pair })
      saveToStorage(PAIRS_STORAGE_KEY, pair)
      return code
    },

    connectPartner: (code, name) => {
      const pair = get().pair
      if (!pair) return
      const updated = { ...pair, partnerCode: code, partnerName: name }
      set({ pair: updated })
      saveToStorage(PAIRS_STORAGE_KEY, updated)
    },

    disconnectPair: () => {
      set({ pair: null, partnerCheckIns: [] })
      localStorage.removeItem(PAIRS_STORAGE_KEY)
      localStorage.removeItem('sip-partner-checkins')
    },

    addCheckIn: (type, content, abstract, amountMl) => {
      const slogan = type === 'water' ? getRandomItem(CONFIG.water.slogans) : getRandomItem(CONFIG.activitySlogans)
      const checkIn: CheckIn = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        type,
        content,
        abstract,
        slogan,
        amount_ml: amountMl || 0,
        timestamp: Date.now(),
      }
      set(state => {
        const updated = [checkIn, ...state.checkIns]
        saveToStorage(STORAGE_KEY, { name: state.myName, checkIns: updated })
        return { checkIns: updated }
      })
      return checkIn
    },

    removeCheckIn: (id) => {
      set(state => {
        const updated = state.checkIns.filter(c => c.id !== id)
        saveToStorage(STORAGE_KEY, { name: state.myName, checkIns: updated })
        return { checkIns: updated }
      })
    },

    importPartnerCheckIns: (data) => {
      set({ partnerCheckIns: data })
      saveToStorage('sip-partner-checkins', data)
    },

    getTodayCheckIns: () => {
      const today = getTodayStr()
      return get().checkIns.filter(c => {
        const d = new Date(c.timestamp)
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` === today
      })
    },

    getTodayPartnerCheckIns: () => {
      const today = getTodayStr()
      return get().partnerCheckIns.filter(c => {
        const d = new Date(c.timestamp)
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` === today
      })
    },

    getTodayWaterTotal: () => {
      return get().getTodayCheckIns()
        .filter(c => c.type === 'water')
        .reduce((sum, c) => sum + c.amount_ml, 0)
    },

    getStreak: () => {
      const dates = [...new Set(get().checkIns.filter(c => c.type === 'water').map(c => {
        const d = new Date(c.timestamp)
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      }))].sort().reverse()

      if (dates.length === 0) return 0
      const today = getTodayStr()
      let streak = 0
      let current = today
      for (const d of dates) {
        if (d === current) {
          streak++
          const prev = new Date(current)
          prev.setDate(prev.getDate() - 1)
          current = `${prev.getFullYear()}-${String(prev.getMonth()+1).padStart(2,'0')}-${String(prev.getDate()).padStart(2,'0')}`
        } else break
      }
      return streak
    },

    getMinutesSinceLastWater: () => {
      const waterCheckIns = get().checkIns.filter(c => c.type === 'water')
      if (waterCheckIns.length === 0) return null
      const latest = waterCheckIns.reduce((max, c) => Math.max(max, c.timestamp), 0)
      return Math.floor((Date.now() - latest) / 60000)
    },

    getFireWarning: () => {
      const mins = get().getMinutesSinceLastWater()
      if (mins === null || mins < CONFIG.fireWarning.thresholdMinutes) return null
      return getRandomItem(CONFIG.fireWarning.messages)
    },

    exportMyData: () => {
      const state = get()
      return JSON.stringify({
        name: state.myName,
        pairCode: state.pair?.myCode || '',
        checkIns: state.checkIns,
      })
    },

    importData: (json) => {
      try {
        const data = JSON.parse(json)
        if (data.checkIns && Array.isArray(data.checkIns)) {
          set({ myName: data.name || '', checkIns: data.checkIns })
          saveToStorage(STORAGE_KEY, { name: data.name || '', checkIns: data.checkIns })
          return true
        }
        return false
      } catch { return false }
    },
  }
})
