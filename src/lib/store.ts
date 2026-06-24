import { create } from 'zustand'
import CONFIG from '@/lib/config'
import { db, auth, signInAnon, onAuthChange } from '@/lib/firebase'
import {
  collection, doc, setDoc, getDoc, getDocs, updateDoc,
  onSnapshot, query, where, orderBy, limit, serverTimestamp,
  Timestamp, addDoc,
} from 'firebase/firestore'

export type CheckInType = 'water' | 'activity'

export interface CheckIn {
  id: string
  uid: string
  name: string
  type: CheckInType
  content: string
  abstract: string
  slogan: string
  amount_ml: number
  timestamp: number
  date: string  // YYYY-MM-DD for querying
}

export interface RoomMember {
  uid: string
  name: string
  treeEmoji: string
  treeLabel: string
  streak: number
  todayWater: number
  joinedAt: number
}

export interface Award {
  id: string
  uid: string
  name: string
  title: string
  emoji: string
  desc: string
  date: string
  type: 'daily' | 'special'
}

export interface RoomInfo {
  id: string
  code: string
  name: string
  createdAt: number
  members: RoomMember[]
}

function getTodayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getTreeStage(streak: number) {
  const stages = CONFIG.tree.stages
  let current = stages[0]
  for (const s of stages) {
    if (streak >= s.days) current = s
  }
  return current
}

// ---- App Store ----
interface AppState {
  // Auth
  uid: string | null
  myName: string
  isAuthed: boolean
  authLoading: boolean

  // Room
  room: RoomInfo | null
  roomCode: string
  myCheckIns: CheckIn[]
  roomCheckIns: CheckIn[]
  myAwards: Award[]
  roomLeaderboard: RoomMember[]

  // UI
  initDone: boolean

  // Actions
  init: () => Promise<void>
  setMyName: (name: string) => Promise<void>
  createRoom: (roomName: string) => Promise<string>
  joinRoom: (code: string) => Promise<boolean>
  leaveRoom: () => Promise<void>
  addCheckIn: (type: CheckInType, content: string, abstract: string, amountMl?: number) => Promise<CheckIn>
  listenRoom: () => () => void
  refreshLeaderboard: () => Promise<void>
  checkAndGrantAwards: () => Promise<Award[]>
  getTodayWaterTotal: () => number
  getStreak: () => number
  getMinutesSinceLastWater: () => number | null
  getFireWarning: () => string | null
  getRoomLink: () => string
}

export const useAppStore = create<AppState>((set, get) => ({
  uid: null,
  myName: '',
  isAuthed: false,
  authLoading: true,
  room: null,
  roomCode: '',
  myCheckIns: [],
  roomCheckIns: [],
  myAwards: [],
  roomLeaderboard: [],
  initDone: false,

  init: async () => {
    try {
      await signInAnon()
      onAuthChange(async (uid) => {
        if (!uid) { set({ authLoading: false }); return }
        // Load saved name from localStorage
        const savedName = localStorage.getItem('sip-name') || ''
        set({ uid, myName: savedName, isAuthed: true, authLoading: false })

        // Load saved room
        const savedRoom = localStorage.getItem('sip-room')
        if (savedRoom) {
          try {
            const room = JSON.parse(savedRoom)
            set({ room, roomCode: room.code })
            get().listenRoom()
          } catch {}
        }
        set({ initDone: true })
      })
    } catch (e) {
      console.error('Auth failed', e)
      set({ authLoading: false })
    }
  },

  setMyName: async (name) => {
    set({ myName: name })
    localStorage.setItem('sip-name', name)
    // Update name in room if joined
    const { uid, room } = get()
    if (uid && room) {
      const memberRef = doc(db, 'rooms', room.id, 'members', uid)
      try { await updateDoc(memberRef, { name }) } catch {}
    }
  },

  createRoom: async (roomName) => {
    const { uid, myName } = get()
    if (!uid) return ''
    const code = Math.random().toString(36).slice(2, 8).toUpperCase()
    const roomRef = doc(collection(db, 'rooms'), code)
    const roomData: any = {
      id: code,
      code,
      name: roomName || '浇水圈',
      createdAt: serverTimestamp(),
    }
    await setDoc(roomRef, roomData)

    // Add self as member
    const memberRef = doc(db, 'rooms', code, 'members', uid)
    await setDoc(memberRef, {
      uid,
      name: myName || '匿名水友',
      treeEmoji: '🌱',
      treeLabel: '种子',
      streak: 0,
      todayWater: 0,
      joinedAt: serverTimestamp(),
    })

    const room = { id: code, code, name: roomName || '浇水圈', createdAt: Date.now(), members: [] }
    set({ room, roomCode: code })
    localStorage.setItem('sip-room', JSON.stringify(room))
    get().listenRoom()
    return code
  },

  joinRoom: async (code) => {
    const { uid, myName } = get()
    if (!uid) return false
    const roomRef = doc(db, 'rooms', code)
    const roomSnap = await getDoc(roomRef)
    if (!roomSnap.exists()) return false

    // Add as member
    const memberRef = doc(db, 'rooms', code, 'members', uid)
    await setDoc(memberRef, {
      uid,
      name: myName || '匿名水友',
      treeEmoji: '🌱',
      treeLabel: '种子',
      streak: 0,
      todayWater: 0,
      joinedAt: serverTimestamp(),
    }, { merge: true })

    const roomData = roomSnap.data()
    const room = { id: code, code, name: roomData.name || '浇水圈', createdAt: roomData.createdAt?.toMillis() || Date.now(), members: [] }
    set({ room, roomCode: code })
    localStorage.setItem('sip-room', JSON.stringify(room))
    get().listenRoom()
    return true
  },

  leaveRoom: async () => {
    const { uid, room } = get()
    if (uid && room) {
      try {
        const memberRef = doc(db, 'rooms', room.id, 'members', uid)
        // Soft leave - just update name to indicate left
        await updateDoc(memberRef, { name: '(已离开)' })
      } catch {}
    }
    set({ room: null, roomCode: '', roomCheckIns: [], roomLeaderboard: [] })
    localStorage.removeItem('sip-room')
  },

  addCheckIn: async (type, content, abstract, amountMl) => {
    const { uid, myName, room } = get()
    const slogan = type === 'water' ? getRandomItem(CONFIG.water.slogans) : getRandomItem(CONFIG.activitySlogans)
    const today = getTodayStr()

    const checkIn: Omit<CheckIn, 'id'> & { createdAt: any } = {
      uid: uid || 'anon',
      name: myName || '匿名水友',
      type,
      content,
      abstract,
      slogan,
      amount_ml: amountMl || 0,
      timestamp: Date.now(),
      date: today,
      createdAt: serverTimestamp(),
    }

    // Save to Firestore
    if (room) {
      const checkinsRef = collection(db, 'rooms', room.id, 'checkins')
      const docRef = await addDoc(checkinsRef, checkIn)

      // Update member's todayWater if water check-in
      if (type === 'water' && amountMl && uid) {
        const memberRef = doc(db, 'rooms', room.id, 'members', uid)
        const memberSnap = await getDoc(memberRef)
        if (memberSnap.exists()) {
          const currentWater = memberSnap.data().todayWater || 0
          await updateDoc(memberRef, { todayWater: currentWater + amountMl })
        }
      }
    } else {
      // Fallback: save locally
      const localCheckIns = JSON.parse(localStorage.getItem('sip-checkins') || '[]')
      localCheckIns.unshift({ ...checkIn, id: Date.now().toString(36) })
      localStorage.setItem('sip-checkins', JSON.stringify(localCheckIns))
    }

    // Check for awards
    const newAwards = await get().checkAndGrantAwards()

    const fullCheckIn: CheckIn = {
      ...checkIn,
      id: Date.now().toString(36),
      createdAt: undefined as any,
    }
    set(state => ({ myCheckIns: [fullCheckIn, ...state.myCheckIns], myAwards: [...state.myAwards, ...newAwards] }))
    return fullCheckIn
  },

  listenRoom: () => {
    const { room } = get()
    if (!room) return () => {}

    // Listen to check-ins
    const checkinsRef = collection(db, 'rooms', room.id, 'checkins')
    const today = getTodayStr()
    const q = query(checkinsRef, where('date', '==', today), orderBy('timestamp', 'desc'), limit(50))

    const unsub = onSnapshot(q, (snap) => {
      const checkIns = snap.docs.map(d => ({ id: d.id, ...d.data() } as CheckIn))
      set({ roomCheckIns: checkIns })
      // Also update my check-ins
      const { uid } = get()
      const mine = checkIns.filter(c => c.uid === uid)
      set({ myCheckIns: mine })
    })

    // Listen to members (for leaderboard)
    const membersRef = collection(db, 'rooms', room.id, 'members')
    const unsubMembers = onSnapshot(membersRef, (snap) => {
      const members = snap.docs.map(d => d.data() as RoomMember)
      const sorted = members.filter(m => m.name !== '(已离开)').sort((a, b) => b.todayWater - a.todayWater)
      set({ roomLeaderboard: sorted })
    })

    return () => { unsub(); unsubMembers() }
  },

  refreshLeaderboard: async () => {
    const { room } = get()
    if (!room) return
    const membersRef = collection(db, 'rooms', room.id, 'members')
    const snap = await getDocs(membersRef)
    const members = snap.docs.map(d => d.data() as RoomMember)
    const sorted = members.filter(m => m.name !== '(已离开)').sort((a, b) => b.todayWater - a.todayWater)
    set({ roomLeaderboard: sorted })
  },

  checkAndGrantAwards: async () => {
    const { uid, myName, room, myCheckIns } = get()
    if (!uid || !room) return []

    const newAwards: Award[] = []
    const today = getTodayStr()
    const todayCheckIns = myCheckIns.filter(c => c.date === today)
    const todayWater = todayCheckIns.filter(c => c.type === 'water').reduce((s, c) => s + c.amount_ml, 0)

    // Check special awards
    const specialAwards = CONFIG.awards.special

    // goal_hit
    if (todayWater >= CONFIG.water.dailyGoal) {
      newAwards.push({ id: `goal_hit_${today}`, uid, name: myName, title: '达标达人', emoji: '🎯', desc: '今日喝水目标达成', date: today, type: 'special' })
    }
    // big_sip
    if (todayCheckIns.some(c => c.amount_ml >= 750)) {
      newAwards.push({ id: `big_sip_${today}`, uid, name: myName, title: '吨吨吨大王', emoji: '🌊', desc: '单次喝水750ml', date: today, type: 'special' })
    }
    // bored
    const fishCount = todayCheckIns.filter(c => c.content === '在摸鱼').length
    if (fishCount >= 3) {
      newAwards.push({ id: `bored_${today}`, uid, name: myName, title: '摸鱼冠军', emoji: '🐟', desc: '连续3次报备"在摸鱼"', date: today, type: 'special' })
    }
    // philosopher
    if (todayCheckIns.some(c => c.content === '在思考存在')) {
      newAwards.push({ id: `philo_${today}`, uid, name: myName, title: '存在主义大师', emoji: '🌌', desc: '报备了"在思考存在"', date: today, type: 'special' })
    }
    // early_bird
    const now = new Date()
    if (now.getHours() < 6) {
      newAwards.push({ id: `early_${today}`, uid, name: myName, title: '晨露采集者', emoji: '🌅', desc: '6点前就开始浇水', date: today, type: 'special' })
    }
    // night_owl
    if (now.getHours() >= 23) {
      newAwards.push({ id: `owl_${today}`, uid, name: myName, title: '深夜灌溉师', emoji: '🦉', desc: '23点后还在浇水', date: today, type: 'special' })
    }

    // Save awards to Firestore
    for (const award of newAwards) {
      try {
        const awardRef = collection(db, 'rooms', room.id, 'awards')
        await addDoc(awardRef, award)
      } catch {}
    }

    return newAwards
  },

  getTodayWaterTotal: () => {
    const today = getTodayStr()
    const { myCheckIns } = get()
    // Include local data too
    const localCheckIns = JSON.parse(localStorage.getItem('sip-checkins') || '[]') as CheckIn[]
    const all = [...myCheckIns, ...localCheckIns]
    return all
      .filter(c => c.date === today && c.type === 'water')
      .reduce((sum, c) => sum + c.amount_ml, 0)
  },

  getStreak: () => {
    const { myCheckIns } = get()
    const dates = [...new Set(myCheckIns.filter(c => c.type === 'water').map(c => c.date))].sort().reverse()
    if (dates.length === 0) return 0
    const today = getTodayStr()
    let streak = 0
    let current = today
    for (const d of dates) {
      if (d === current) { streak++; const prev = new Date(current); prev.setDate(prev.getDate()-1); current = prev.toISOString().slice(0,10) }
      else break
    }
    return streak
  },

  getMinutesSinceLastWater: () => {
    const { myCheckIns } = get()
    const water = myCheckIns.filter(c => c.type === 'water')
    if (water.length === 0) return null
    const latest = water.reduce((max, c) => Math.max(max, c.timestamp), 0)
    return Math.floor((Date.now() - latest) / 60000)
  },

  getFireWarning: () => {
    const mins = get().getMinutesSinceLastWater()
    if (mins === null || mins < CONFIG.fireWarning.thresholdMinutes) return null
    return getRandomItem(CONFIG.fireWarning.messages)
  },

  getRoomLink: () => {
    const { room } = get()
    if (!room) return ''
    return `${window.location.origin}${window.location.pathname}#/room/${room.code}`
  },
}))
