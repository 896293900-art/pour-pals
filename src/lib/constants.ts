// Slogan banks for different check-in types
export const WATER_SLOGANS = [
  '今日份续命水已注入 💧',
  '你喝的不是水，是生命的温柔',
  '又干了一杯虚无',
  '膀胱：感谢您的慷慨投喂',
  '这杯水敬明天的自己',
  '肾脏发来感谢信 ✉️',
  '水分+1 灵魂+1',
  '你比刚才的自己水了一点',
  '恭喜你，又成功骗身体喝了水',
  '这杯水下肚，上火的概率-1%',
  '肝说：够意思',
  '此刻你是一棵被浇了水的植物',
  '咕嘟咕嘟咕嘟',
  '水是生命之源，你是水的甲方',
  '喝水的你，比不喝水的你帅0.01%',
  '今日KPI：活着 ✅',
  '身体含水量上升，发火阈值上升',
  '这一杯，敬熬夜的自己',
  '种一棵树最好的时间是十年前，喝一杯水最好的时间是现在',
  '水：我来了 我走了 谢谢你',
]

export const ACTIVITY_SLOGANS = [
  '行踪已报备，请查收 📍',
  '你的眼线已上线',
  '对方正在…嗯…做这个',
  '今日份的我在做今日份的事',
  '报备完毕，请安心摸鱼',
  '人生如戏，此刻我在这一幕',
  '坐标已更新，状态已同步',
  '我活着，在做某事，over',
  '此处有人，正在干嘛',
  '你的专属情报员发来前线报道',
]

export const ACTIVITY_OPTIONS = [
  { emoji: '💻', label: '在搬砖', abstract: '在用灵魂发电' },
  { emoji: '😴', label: '在睡觉', abstract: '在充电恢复出厂设置' },
  { emoji: '🍜', label: '在干饭', abstract: '在与碳水深度交流' },
  { emoji: '🚶', label: '在散步', abstract: '在进行人类低功耗运动' },
  { emoji: '🎮', label: '在游戏', abstract: '在训练手眼协调能力' },
  { emoji: '📺', label: '在追剧', abstract: '在研究当代影视艺术' },
  { emoji: '📖', label: '在看书', abstract: '在吸收前人的智慧结晶' },
  { emoji: '🏋️', label: '在运动', abstract: '在对抗地心引力' },
  { emoji: '🎵', label: '在听歌', abstract: '在用声波按摩耳膜' },
  { emoji: '🧘', label: '在冥想', abstract: '在试图清空大脑缓存' },
  { emoji: '🚽', label: '在洗手间', abstract: '在进行必要的生理排放' },
  { emoji: '🤔', label: '在思考人生', abstract: '在思考宇宙的终极答案' },
  { emoji: '🐟', label: '在摸鱼', abstract: '在摸鱼但是很优雅' },
  { emoji: '🫁', label: '在呼吸', abstract: '在坚持活着' },
  { emoji: '🌀', label: '在发呆', abstract: '在大脑待机模式' },
  { emoji: '🛒', label: '在逛街', abstract: '在给GDP做微小的贡献' },
]

export const WATER_AMOUNTS = [
  { ml: 100, label: '抿一口', icon: '💧' },
  { ml: 200, label: '小半杯', icon: '🥛' },
  { ml: 350, label: '一整杯', icon: '🫗' },
  { ml: 500, label: '豪饮', icon: '🏋️' },
  { ml: 750, label: '吨吨吨', icon: '🌊' },
]

export type CheckInType = 'water' | 'activity'

// Get random slogan
export function getRandomSlogan(type: CheckInType): string {
  const bank = type === 'water' ? WATER_SLOGANS : ACTIVITY_SLOGANS
  return bank[Math.floor(Math.random() * bank.length)]
}

// Get today's date string (YYYY-MM-DD) in local time
export function getTodayStr(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Format time for display
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// Calculate consecutive days from check-in dates
export function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const sorted = [...dates].sort().reverse()
  const today = getTodayStr()
  let streak = 0
  let current = today
  
  for (const d of sorted) {
    if (d === current) {
      streak++
      const prev = new Date(current)
      prev.setDate(prev.getDate() - 1)
      current = prev.toISOString().slice(0, 10)
    } else if (d < current) {
      break
    }
  }
  return streak
}

// Time since last check-in (in minutes)
export function minutesSinceLastCheckIn(lastTime: string | null): number | null {
  if (!lastTime) return null
  const last = new Date(lastTime)
  const now = new Date()
  return Math.floor((now.getTime() - last.getTime()) / 60000)
}
