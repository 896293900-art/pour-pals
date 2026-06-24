// ============================================
// 浇个朋友 · 配置文件
// ============================================

const CONFIG = {
  appName: '浇个朋友',
  appSubtitle: '喝水种树 · 互相报备 · 一起浇',
  appEmoji: '🌱',

  // ---- 喝水模式 ----
  water: {
    name: '喝水浇树',
    emoji: '💦',
    amounts: [
      { ml: 100, label: '抿一口', icon: '💧' },
      { ml: 200, label: '小半杯', icon: '🥛' },
      { ml: 350, label: '一整杯', icon: '🫗' },
      { ml: 500, label: '豪饮', icon: '🏋️' },
      { ml: 750, label: '吨吨吨', icon: '🌊' },
    ],
    dailyGoal: 2000,
    slogans: [
      '今日份续命水已注入 💦',
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
      '此刻你是一棵被浇了水的植物 🌱',
      '咕嘟咕嘟咕嘟',
      '水是生命之源，你是水的甲方',
      '喝水的你，比不喝水的你帅0.01%',
      '今日KPI：活着 ✅',
      '身体含水量上升，发火阈值上升',
      '这一杯，敬熬夜的自己',
      '种一棵树最好的时间是十年前，喝一杯水最好的时间是现在',
      '水：我来了 我走了 谢谢你',
      '小树苗偷偷长高了一毫米 🌿',
      '这杯水下肚，你的树又绿了一点',
      '今天的你是一棵精神树 🌳',
    ],
  },

  // ---- 报备模式 ----
  activities: [
    { id: 'work', group: '工作', emoji: '💻', label: '在搬砖', abstract: '在用灵魂发电' },
    { id: 'meeting', group: '工作', emoji: '🎤', label: '在开会', abstract: '在表演认真听讲' },
    { id: 'email', group: '工作', emoji: '📧', label: '在回消息', abstract: '在信息洪流中划水' },
    { id: 'overtime', group: '工作', emoji: '🥲', label: '在加班', abstract: '在透支未来' },
    { id: 'commute', group: '工作', emoji: '🚇', label: '在通勤', abstract: '在人群中进行分子运动' },

    { id: 'eat', group: '吃喝', emoji: '🍜', label: '在干饭', abstract: '在与碳水深度交流' },
    { id: 'cook', group: '吃喝', emoji: '👨‍🍳', label: '在做饭', abstract: '在扮演米其林大厨' },
    { id: 'snack', group: '吃喝', emoji: '🍿', label: '在吃零食', abstract: '在补充微量快乐' },
    { id: 'coffee', group: '吃喝', emoji: '☕', label: '在喝咖啡', abstract: '在用黑魔法续命' },
    { id: 'tea', group: '吃喝', emoji: '🍵', label: '在喝茶', abstract: '在进行中年养生仪式' },
    { id: 'milktea', group: '吃喝', emoji: '🧋', label: '在喝奶茶', abstract: '在给生活加糖' },

    { id: 'sleep', group: '休息', emoji: '😴', label: '在睡觉', abstract: '在充电恢复出厂设置' },
    { id: 'nap', group: '休息', emoji: '💤', label: '在午休', abstract: '在进行快速充电' },
    { id: 'chill', group: '休息', emoji: '🛋️', label: '在瘫着', abstract: '在练习人体工学' },
    { id: 'daze', group: '休息', emoji: '🌀', label: '在发呆', abstract: '在大脑待机模式' },

    { id: 'game', group: '娱乐', emoji: '🎮', label: '在游戏', abstract: '在训练手眼协调能力' },
    { id: 'series', group: '娱乐', emoji: '📺', label: '在追剧', abstract: '在研究当代影视艺术' },
    { id: 'music', group: '娱乐', emoji: '🎵', label: '在听歌', abstract: '在用声波按摩耳膜' },
    { id: 'movie', group: '娱乐', emoji: '🎬', label: '在看电影', abstract: '在享受两小时的平行宇宙' },
    { id: 'scroll', group: '娱乐', emoji: '📱', label: '在刷手机', abstract: '在进行大拇指有氧运动' },
    { id: 'anime', group: '娱乐', emoji: '✨', label: '在看番', abstract: '在补充二次元能量' },

    { id: 'walk', group: '运动', emoji: '🚶', label: '在散步', abstract: '在进行人类低功耗运动' },
    { id: 'run', group: '运动', emoji: '🏃', label: '在跑步', abstract: '在假装追赶夕阳' },
    { id: 'gym', group: '运动', emoji: '🏋️', label: '在健身', abstract: '在对抗地心引力' },
    { id: 'yoga', group: '运动', emoji: '🧘', label: '在瑜伽', abstract: '在把自己折叠' },
    { id: 'bike', group: '运动', emoji: '🚴', label: '在骑车', abstract: '在用腿驱动世界' },
    { id: 'swim', group: '运动', emoji: '🏊', label: '在游泳', abstract: '在模拟鱼的一生' },

    { id: 'read', group: '学习', emoji: '📖', label: '在看书', abstract: '在吸收前人的智慧结晶' },
    { id: 'study', group: '学习', emoji: '📝', label: '在学习', abstract: '在给大脑写入新数据' },
    { id: 'code', group: '学习', emoji: '⌨️', label: '在写代码', abstract: '在和编译器吵架' },
    { id: 'draw', group: '学习', emoji: '🎨', label: '在画画', abstract: '在让线条听话' },

    { id: 'shop', group: '生活', emoji: '🛒', label: '在逛街', abstract: '在给GDP做微小贡献' },
    { id: 'clean', group: '生活', emoji: '🧹', label: '在打扫', abstract: '在和灰尘展开拉锯战' },
    { id: 'laundry', group: '生活', emoji: '👕', label: '在洗衣服', abstract: '在进行布料净化仪式' },
    { id: 'cook_prep', group: '生活', emoji: '🥬', label: '在备菜', abstract: '在处理植物遗骸' },
    { id: 'bath', group: '生活', emoji: '🛁', label: '在洗澡', abstract: '在进行人类自清洁程序' },
    { id: 'toilet', group: '生活', emoji: '🚽', label: '在洗手间', abstract: '在进行必要的生理排放' },

    { id: 'chat', group: '社交', emoji: '💬', label: '在聊天', abstract: '在进行信息交换仪式' },
    { id: 'date', group: '社交', emoji: '💕', label: '在约会', abstract: '在进行人类求偶行为' },
    { id: 'hangout', group: '社交', emoji: '🍻', label: '在聚会', abstract: '在进行碳基生物连接' },
    { id: 'call', group: '社交', emoji: '📞', label: '在通话', abstract: '在用声波跨越空间' },

    { id: 'think', group: '状态', emoji: '🤔', label: '在思考人生', abstract: '在思考宇宙的终极答案' },
    { id: 'anxious', group: '状态', emoji: '😰', label: '有点焦虑', abstract: '在模拟仓鼠跑轮' },
    { id: 'happy', group: '状态', emoji: '😄', label: '很开心', abstract: '多巴胺溢出中' },
    { id: 'sad', group: '状态', emoji: '🥺', label: '有点emo', abstract: '在经历情绪低气压' },
    { id: 'angry', group: '状态', emoji: '😤', label: '在上火', abstract: '怒气值已超载' },
    { id: 'lazy', group: '状态', emoji: '🐟', label: '在摸鱼', abstract: '在摸鱼但是很优雅' },
    { id: 'breathe', group: '状态', emoji: '🫁', label: '在呼吸', abstract: '在坚持活着' },
    { id: 'existential', group: '状态', emoji: '🌌', label: '在思考存在', abstract: '我思故我在…大概' },
  ],

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

  // ---- 上火提醒（树枯萎警告）----
  fireWarning: {
    thresholdMinutes: 180,
    messages: [
      '你已经好久没浇水了，小树快枯了⚠️',
      '嘴唇干了吧？该浇水了',
      '你的身体含水量正在下降…小树在打蔫',
      '再不浇水，你的树就要变成干柴了',
      '上火三件套：熬夜、吃辣、不喝水。你中了几个？',
      '水杯在召唤你，小树在等你💧',
      '你的树说：我渴了 🥀',
    ],
  },

  // ---- 种树主题 ----
  tree: {
    stages: [
      { days: 0, emoji: '🌱', label: '种子' },
      { days: 1, emoji: '🌿', label: '嫩芽' },
      { days: 3, emoji: '🪴', label: '盆栽' },
      { days: 7, emoji: '🌲', label: '小树' },
      { days: 14, emoji: '🌳', label: '大树' },
      { days: 30, emoji: '🏡', label: '一棵有故事的树' },
      { days: 60, emoji: '🏔️', label: '参天古木' },
      { days: 100, emoji: '🌟', label: '神树降临' },
    ],
    growSlogan: '你的树又长高了一点 🌿',
    wiltSlogan: '你的树在等你回来浇水 🥀',
    pairGrowSlogan: '两个人浇的树，比一个人高 🌳',
  },

  // ---- 🏆 虚拟奖状系统 ----
  awards: {
    // 每日排行榜奖状（根据当日排名）
    daily: [
      { rank: 1, title: '水利局局长', emoji: '👔', desc: '今日浇水冠军，号召力拉满' },
      { rank: 2, title: '水务局副局长', emoji: '📋', desc: '稳坐二把手，绝不缺勤' },
      { rank: 3, title: '灌溉科科长', emoji: '💧', desc: '科里的水都是你浇的' },
    ],
    // 特殊成就奖状
    special: [
      { id: 'first_water', title: '开闸元勋', emoji: '🏅', desc: '圈子里第一个喝水的人', condition: 'room中当日第一个打卡' },
      { id: 'early_bird', title: '晨露采集者', emoji: '🌅', desc: '6点前就开始浇水', condition: '在6:00前打卡' },
      { id: 'night_owl', title: '深夜灌溉师', emoji: '🦉', desc: '23点后还在浇水', condition: '在23:00后打卡' },
      { id: 'streak_7', title: '七日园丁', emoji: '🌻', desc: '连续7天浇水不中断', condition: '连续7天打卡' },
      { id: 'streak_30', title: '月度造林标兵', emoji: '🌲', desc: '连续30天，你种了一片林', condition: '连续30天打卡' },
      { id: 'streak_100', title: '百年树人', emoji: '🏛️', desc: '100天！你是树神', condition: '连续100天打卡' },
      { id: 'big_sip', title: '吨吨吨大王', emoji: '🌊', desc: '单次喝水750ml', condition: '选择吨吨吨选项' },
      { id: 'goal_hit', title: '达标达人', emoji: '🎯', desc: '今日喝水目标达成', condition: '达到每日目标' },
      { id: 'social', title: '群众演员', emoji: '🎭', desc: '报备了5种不同的活动', condition: '当日报备5种' },
      { id: 'fire_warning', title: '火场逃生', emoji: '🚒', desc: '收到上火警告后立刻喝水', condition: '被警告后5分钟内喝水' },
      { id: 'share', title: '传教士', emoji: '📢', desc: '邀请了新朋友进圈', condition: '有人通过你的链接加入' },
      { id: 'bored', title: '摸鱼冠军', emoji: '🐟', desc: '连续3次报备"在摸鱼"', condition: '当日3次摸鱼' },
      { id: 'philosopher', title: '存在主义大师', emoji: '🌌', desc: '报备了"在思考存在"', condition: '选择思考存在选项' },
      { id: 'midnight_snack', title: '深夜食堂', emoji: '🍜', desc: '22点后报备"在干饭"', condition: '22点后选干饭' },
    ],
    // 奖状模板文字
    certificate: {
      header: '浇个朋友 · 荣誉奖状',
      body: '兹证明 {name} 同志',
      footer: '特此表彰，以资鼓励 🏆',
      stamp: '浇水委员会',
    },
  },

  // ---- 主题色 ----
  theme: {
    cream: '#FFF8F0',
    mint: '#7ECEC1',
    peach: '#FFB199',
    lavender: '#C4B5E0',
    text: '#3D3244',
  },
}

export default CONFIG
