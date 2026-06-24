// ============================================
// 咕嘟咕嘟 · 配置文件
// 在这里自定义你的打卡项、标语、配对等
// ============================================

const CONFIG = {
  // ---- 基本信息 ----
  appName: '咕嘟咕嘟',
  appSubtitle: '喝水打卡 · 互相报备 · 一起咕嘟',
  appEmoji: '💧',

  // ---- 喝水模式 ----
  water: {
    name: '喝水打卡',
    emoji: '💧',
    // 每次喝水的量级选项
    amounts: [
      { ml: 100, label: '抿一口', icon: '💧' },
      { ml: 200, label: '小半杯', icon: '🥛' },
      { ml: 350, label: '一整杯', icon: '🫗' },
      { ml: 500, label: '豪饮', icon: '🏋️' },
      { ml: 750, label: '吨吨吨', icon: '🌊' },
    ],
    // 每日目标 (ml)
    dailyGoal: 2000,
    // 喝水打卡随机标语
    slogans: [
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
    ],
  },

  // ---- 报备模式：日常场景 ----
  activities: [
    // === 工作 ===
    { id: 'work', group: '工作', emoji: '💻', label: '在搬砖', abstract: '在用灵魂发电' },
    { id: 'meeting', group: '工作', emoji: '🎤', label: '在开会', abstract: '在表演认真听讲' },
    { id: 'email', group: '工作', emoji: '📧', label: '在回消息', abstract: '在信息洪流中划水' },
    { id: 'overtime', group: '工作', emoji: '🥲', label: '在加班', abstract: '在透支未来' },
    { id: 'commute', group: '工作', emoji: '🚇', label: '在通勤', abstract: '在人群中进行分子运动' },

    // === 吃喝 ===
    { id: 'eat', group: '吃喝', emoji: '🍜', label: '在干饭', abstract: '在与碳水深度交流' },
    { id: 'cook', group: '吃喝', emoji: '👨‍🍳', label: '在做饭', abstract: '在扮演米其林大厨' },
    { id: 'snack', group: '吃喝', emoji: '🍿', label: '在吃零食', abstract: '在补充微量快乐' },
    { id: 'coffee', group: '吃喝', emoji: '☕', label: '在喝咖啡', abstract: '在用黑魔法续命' },
    { id: 'tea', group: '吃喝', emoji: '🍵', label: '在喝茶', abstract: '在进行中年养生仪式' },
    { id: 'milktea', group: '吃喝', emoji: '🧋', label: '在喝奶茶', abstract: '在给生活加糖' },

    // === 休息 ===
    { id: 'sleep', group: '休息', emoji: '😴', label: '在睡觉', abstract: '在充电恢复出厂设置' },
    { id: 'nap', group: '休息', emoji: '💤', label: '在午休', abstract: '在进行快速充电' },
    { id: 'chill', group: '休息', emoji: '🛋️', label: '在瘫着', abstract: '在练习人体工学' },
    { id: 'daze', group: '休息', emoji: '🌀', label: '在发呆', abstract: '在大脑待机模式' },

    // === 娱乐 ===
    { id: 'game', group: '娱乐', emoji: '🎮', label: '在游戏', abstract: '在训练手眼协调能力' },
    { id: 'series', group: '娱乐', emoji: '📺', label: '在追剧', abstract: '在研究当代影视艺术' },
    { id: 'music', group: '娱乐', emoji: '🎵', label: '在听歌', abstract: '在用声波按摩耳膜' },
    { id: 'movie', group: '娱乐', emoji: '🎬', label: '在看电影', abstract: '在享受两小时的平行宇宙' },
    { id: 'scroll', group: '娱乐', emoji: '📱', label: '在刷手机', abstract: '在进行大拇指有氧运动' },
    { id: 'anime', group: '娱乐', emoji: '✨', label: '在看番', abstract: '在补充二次元能量' },

    // === 运动 ===
    { id: 'walk', group: '运动', emoji: '🚶', label: '在散步', abstract: '在进行人类低功耗运动' },
    { id: 'run', group: '运动', emoji: '🏃', label: '在跑步', abstract: '在假装追赶夕阳' },
    { id: 'gym', group: '运动', emoji: '🏋️', label: '在健身', abstract: '在对抗地心引力' },
    { id: 'yoga', group: '运动', emoji: '🧘', label: '在瑜伽', abstract: '在把自己折叠' },
    { id: 'bike', group: '运动', emoji: '🚴', label: '在骑车', abstract: '在用腿驱动世界' },
    { id: 'swim', group: '运动', emoji: '🏊', label: '在游泳', abstract: '在模拟鱼的一生' },

    // === 学习 ===
    { id: 'read', group: '学习', emoji: '📖', label: '在看书', abstract: '在吸收前人的智慧结晶' },
    { id: 'study', group: '学习', emoji: '📝', label: '在学习', abstract: '在给大脑写入新数据' },
    { id: 'code', group: '学习', emoji: '⌨️', label: '在写代码', abstract: '在和编译器吵架' },
    { id: 'draw', group: '学习', emoji: '🎨', label: '在画画', abstract: '在让线条听话' },

    // === 生活 ===
    { id: 'shop', group: '生活', emoji: '🛒', label: '在逛街', abstract: '在给GDP做微小贡献' },
    { id: 'clean', group: '生活', emoji: '🧹', label: '在打扫', abstract: '在和灰尘展开拉锯战' },
    { id: 'laundry', group: '生活', emoji: '👕', label: '在洗衣服', abstract: '在进行布料净化仪式' },
    { id: 'cook_prep', group: '生活', emoji: '🥬', label: '在备菜', abstract: '在处理植物遗骸' },
    { id: 'bath', group: '生活', emoji: '🛁', label: '在洗澡', abstract: '在进行人类自清洁程序' },
    { id: 'toilet', group: '生活', emoji: '🚽', label: '在洗手间', abstract: '在进行必要的生理排放' },

    // === 社交 ===
    { id: 'chat', group: '社交', emoji: '💬', label: '在聊天', abstract: '在进行信息交换仪式' },
    { id: 'date', group: '社交', emoji: '💕', label: '在约会', abstract: '在进行人类求偶行为' },
    { id: 'hangout', group: '社交', emoji: '🍻', label: '在聚会', abstract: '在进行碳基生物连接' },
    { id: 'call', group: '社交', emoji: '📞', label: '在通话', abstract: '在用声波跨越空间' },

    // === 情绪 ===
    { id: 'think', group: '状态', emoji: '🤔', label: '在思考人生', abstract: '在思考宇宙的终极答案' },
    { id: 'anxious', group: '状态', emoji: '😰', label: '有点焦虑', abstract: '在模拟仓鼠跑轮' },
    { id: 'happy', group: '状态', emoji: '😄', label: '很开心', abstract: '多巴胺溢出中' },
    { id: 'sad', group: '状态', emoji: '🥺', label: '有点emo', abstract: '在经历情绪低气压' },
    { id: 'angry', group: '状态', emoji: '😤', label: '在上火', abstract: '怒气值已超载' },
    { id: 'lazy', group: '状态', emoji: '🐟', label: '在摸鱼', abstract: '在摸鱼但是很优雅' },
    { id: 'breathe', group: '状态', emoji: '🫁', label: '在呼吸', abstract: '在坚持活着' },
    { id: 'existential', group: '状态', emoji: '🌌', label: '在思考存在', abstract: '我思故我在…大概' },
  ],

  // ---- 报备模式随机标语 ----
  activitySlogans: [
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
    '收到请回复，不回也行',
    '今日行踪透明度：100%',
  ],

  // ---- 配对 ----
  // 配对通过 localStorage 本地管理，不需要服务端
  // pairCode: 生成一个唯一码分享给对方即可配对

  // ---- 上火提醒 ----
  fireWarning: {
    // 超过这个分钟数没喝水就提醒
    thresholdMinutes: 180,
    messages: [
      '你已经好久没喝水了，上火警告⚠️',
      '嘴唇干了吧？该喝水了',
      '你的身体含水量正在下降…',
      '再不喝水，就要变成人干了',
      '上火三件套：熬夜、吃辣、不喝水。你中了几个？',
      '水杯在召唤你，你听到了吗？',
    ],
  },

  // ---- 主题色（可自定义）----
  theme: {
    cream: '#FFF8F0',
    mint: '#7ECEC1',
    peach: '#FFB199',
    lavender: '#C4B5E0',
    text: '#3D3244',
  },
}

export default CONFIG
