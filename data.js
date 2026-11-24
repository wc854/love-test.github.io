/* 恋爱人格测试 · 维度 / 题库 / 人格原型 */

const DIMENSIONS = {
  drive:   { name: '主动度', plus: '主动出击', minus: '被动回应' },
  express: { name: '表达度', plus: '明牌直球', minus: '含蓄暗号' },
  attach:  { name: '依恋度', plus: '紧密依恋', minus: '独立留白' },
  conflict:{ name: '冲突度', plus: '当场拆弹', minus: '冷静沉淀' }
};

const POLE_CHAR = {
  drive:   { plus: '燃', minus: '静' },
  express: { plus: '白', minus: '隐' },
  attach:  { plus: '贴', minus: '留' },
  conflict:{ plus: '锋', minus: '柔' }
};

const QUESTIONS = [
  {
    title: '人群里有人朝你看来，你的第一反应是？',
    options: [
      { text: '迎上去，先打个招呼再说', w: { drive: 2, express: 1 } },
      { text: '等他先开口，然后顺势聊起来', w: { drive: 1, attach: 1 } },
      { text: '先观察几秒，确认信号再回应', w: { drive: -2, express: -1 } },
      { text: '假装没看见，心里记下一笔', w: { drive: -2, attach: -1 } }
    ]
  },
  {
    title: '深夜聊得正开心，你会怎么收尾？',
    options: [
      { text: '直接说：我好像有点喜欢你了', w: { express: 2, drive: 1 } },
      { text: '换个说法：你是我今天唯一想聊的人', w: { express: 1, attach: 1 } },
      { text: '甩一首歌过去，让对方自己猜', w: { express: -2, drive: 1 } },
      { text: '认真道晚安，把心动留到明天', w: { express: -1, attach: -1 } }
    ]
  },
  {
    title: '暧昧期最让你舒服的节奏是？',
    options: [
      { text: '尽快确认关系，拖着太耗心力', w: { drive: 1, conflict: 2 } },
      { text: '高频联系，一天不聊就有点空', w: { attach: 2 } },
      { text: '留点神秘感，太满反而减速', w: { attach: -2, express: -1 } },
      { text: '跟着对方的节奏走，不急着推进', w: { drive: -1, attach: -1 } }
    ]
  },
  {
    title: '对方突然三天没回消息，你会？',
    options: [
      { text: '直接问：你是不是不太想聊了', w: { conflict: 2, drive: 1 } },
      { text: '再发一条俏皮的，试探一下水温', w: { drive: 1, express: 1 } },
      { text: '不问，但心里已经演完一部剧', w: { attach: 1, express: -2 } },
      { text: '放下手机，该干嘛干嘛', w: { attach: -2, conflict: -1 } }
    ]
  },
  {
    title: '发生争执时，你更接近哪种状态？',
    options: [
      { text: '当场说清楚，绝不让问题过夜', w: { conflict: 2, express: 1 } },
      { text: '先冷静几小时，再坐下来认真谈', w: { conflict: -2, attach: 1 } },
      { text: '用玩笑把台阶递过去，先缓和气氛', w: { express: -1, conflict: 1 } },
      { text: '沉默处理，等对方先低头', w: { conflict: -2, drive: -1 } }
    ]
  },
  {
    title: '发现自己有点吃醋，你会？',
    options: [
      { text: '坦白说：我有点吃醋，你别笑我', w: { express: 2, conflict: 1 } },
      { text: '加倍对你好，不动声色地宣示主权', w: { drive: 1, attach: 1 } },
      { text: '装作没事，但语气明显变淡', w: { express: -2, conflict: -2 } },
      { text: '自己消化，不让情绪影响关系', w: { attach: -2, conflict: -1 } }
    ]
  },
  {
    title: '私下表达爱意，你的拿手方式是？',
    options: [
      { text: '写一段很直白的话，亲手交给对方', w: { express: 2, attach: 1 } },
      { text: '记住随口说的小事，然后默默做到', w: { express: -2, attach: 2 } },
      { text: '设计只有两个人懂的暗号和仪式', w: { express: -1, drive: 1 } },
      { text: '用礼物和行动代替所有语言', w: { express: -1, attach: 1 } }
    ]
  },
  {
    title: '轮到你安排一次约会，你会？',
    options: [
      { text: '规划好完整行程，牵着对方走', w: { drive: 2, express: 1 } },
      { text: '给几个方案，让对方选喜欢的', w: { drive: 1, attach: 1 } },
      { text: '说「都行，你定就好」', w: { drive: -2, attach: -1 } },
      { text: '心里期待对方准备惊喜', w: { drive: -2, express: -2 } }
    ]
  },
  {
    title: '关于恋爱里的空间，你更认同？',
    options: [
      { text: '恨不得共享定位，随时知道彼此在哪', w: { attach: 2, drive: 1 } },
      { text: '每天报备一次，就足够安心', w: { attach: 1 } },
      { text: '各有各的社交圈，关系才健康', w: { attach: -2 } },
      { text: '需要大量独处时间来回血', w: { attach: -3, drive: -1 } }
    ]
  },
  {
    title: '如果被明确拒绝了一次，你会？',
    options: [
      { text: '再试一次，越挫越勇', w: { drive: 2, conflict: 1 } },
      { text: '换条路靠近，曲线救国', w: { drive: 1, express: -1 } },
      { text: '退回朋友的位置，慢慢来', w: { drive: -1, attach: -1 } },
      { text: '体面退场，不消耗自己', w: { drive: -2, attach: -2 } }
    ]
  },
  {
    title: '对方情绪低落，你通常？',
    options: [
      { text: '立刻追问怎么了，想马上解决', w: { drive: 1, conflict: 2, attach: 1 } },
      { text: '安静陪着就好，不急着说破', w: { express: -1, attach: 1 } },
      { text: '讲个冷笑话，先把气氛救回来', w: { express: 1, conflict: 1 } },
      { text: '给足空间，等他主动开口', w: { attach: -2, conflict: -2 } }
    ]
  },
  {
    title: '你理想中的恋爱状态是？',
    options: [
      { text: '轰轰烈烈，恨不得全世界都知道', w: { drive: 1, express: 2, attach: 2 } },
      { text: '细水长流，好只有我们两个懂', w: { express: -1, attach: 1 } },
      { text: '各有空间，偶尔紧密，舒服最重要', w: { attach: -2, drive: -1 } },
      { text: '像一场有趣的博弈，永远猜不透', w: { drive: 1, express: -1, attach: -1 } }
    ]
  }
];

const ARCHETYPES = [
  {
    id: 'flame', code: 'AR-01', name: '焰火直球派', en: 'THE FLAME',
    rarity: 8.6, vector: [3,3,2,2], pattern: '++++', accent: '#E85D75', soft: '#FFD9DE',
    tagline: '爱意从不预热，喜欢就让它烧起来。',
    tags: ['高主动', '不内耗', '当场拆弹'],
    signal: '对方敢直视你的眼睛，认真回应你的每一句话。',
    highlight: '你把暧昧期压缩成一条直线，喜欢就说，见面就冲。',
    trap: '对方还没准备好时，你的热烈会变成压力。',
    match: '慢热观测者', prescription: '把「我喜欢你」说出口之后，留三秒钟给对方喘气。',
    quote: '我不玩猜心游戏，我的心意明码标价。'
  },
  {
    id: 'rose', code: 'AR-02', name: '玫瑰暗探', en: 'THE ROSE AGENT',
    rarity: 9.2, vector: [-1,-3,2,-1], pattern: '+-+-', accent: '#C2648F', soft: '#F7DDE9',
    tagline: '不说喜欢，但把你的一切都记在心里。',
    tags: ['细节控', '暗中观察', '深情不说'],
    signal: '对方随口提过的小事，被你记了整整三个月。',
    highlight: '你的爱藏在别人看不懂的暗号里，只有对方能解码。',
    trap: '信号太隐秘，对方可能真的没收到。',
    match: '心跳雷达', prescription: '偶尔把暗号翻译成人话，对方会更有安全感。',
    quote: '我的喜欢不在嘴上，在你没注意到的每一次。'
  },
  {
    id: 'slow', code: 'AR-03', name: '慢热观测者', en: 'THE SLOW BURN',
    rarity: 10.4, vector: [-3,-2,-1,-2], pattern: '----', accent: '#8E86B8', soft: '#E5E0F5',
    tagline: '先观察，再沦陷，一旦认定就很长久。',
    tags: ['慢热', '谨慎投入', '长期主义'],
    signal: '对方在你面前展现出和别人不一样的一面。',
    highlight: '你不轻易动心，但动心之后几乎不会撤退。',
    trap: '太久不表态，容易被误读成「没兴趣」。',
    match: '焰火直球派', prescription: '给对方一个最小信号：一句「和你聊天挺开心的」。',
    quote: '我不是冷淡，我只是在认真确认。'
  },
  {
    id: 'moon', code: 'AR-04', name: '月亮邮差', en: 'THE MOON COURIER',
    rarity: 7.8, vector: [-2,-1,3,2], pattern: '--++', accent: '#7A8CC4', soft: '#DDE5FA',
    tagline: '白天克制，深夜把全部温柔寄给你。',
    tags: ['夜型恋人', '黏人但不闹', '温柔蓄力'],
    signal: '凌晨一点的那句「你睡了吗」，是你最大的勇气。',
    highlight: '你擅长在安静的时刻让对方意识到：你一直都在。',
    trap: '情绪都留在夜里，白天容易显得疏离。',
    match: '炽热守望者', prescription: '白天也发一句简短的惦记，让温柔保持连续。',
    quote: '我的浪漫有作息，但它只对你营业。'
  },
  {
    id: 'orbit', code: 'AR-05', name: '独立轨道', en: 'THE FREE ORBIT',
    rarity: 9.6, vector: [-2,1,-3,-1], pattern: '-+--', accent: '#5E9E91', soft: '#D8EFE9',
    tagline: '我爱你，但我依然是我自己的圆心。',
    tags: ['边界清晰', '不黏人', '清醒浪漫'],
    signal: '对方尊重你的独处时间，还愿意等你回来。',
    highlight: '你让关系保持呼吸感，反而让对方更想靠近。',
    trap: '过度留白容易被理解成「不太在乎」。',
    match: '玫瑰暗探', prescription: '主动说明你需要空间，而不是让对方自己猜。',
    quote: '好的爱情不是 merge，是两颗星各自发光。'
  },
  {
    id: 'tug', code: 'AR-06', name: '拉扯艺术家', en: 'THE TUG MASTER',
    rarity: 8.4, vector: [1,-2,-2,1], pattern: '+--+', accent: '#B1785F', soft: '#F1DFD3',
    tagline: '靠近半步，退开半步，节奏感是你的天赋。',
    tags: ['推拉高手', '神秘感', '掌控节奏'],
    signal: '对方开始主动猜测你的下一步，你就赢了一半。',
    highlight: '你让关系始终有悬念，也让对方越来越投入。',
    trap: '玩得太久，真心也会被当成套路。',
    match: '温柔谈判官', prescription: '在关键时刻给一次确定答案，拉扯才有意义。',
    quote: '喜欢是你追我跑，但终点一定是你。'
  },
  {
    id: 'radar', code: 'AR-07', name: '心跳雷达', en: 'THE HEART RADAR',
    rarity: 9.0, vector: [2,2,2,-1], pattern: '+++-', accent: '#D4709A', soft: '#F8DCE9',
    tagline: '你的天线永远朝对方倾斜，细微情绪都逃不掉。',
    tags: ['高敏感', '共情力强', '情绪同步'],
    signal: '对方语气变了半个调，你已经开始担心。',
    highlight: '你是最好用的情绪翻译器，也是最早的安慰。',
    trap: '接收太多信号，容易把自己也搭进去。',
    match: '玫瑰暗探', prescription: '分清「对方的情绪」和「你的情绪」，别全盘接收。',
    quote: '我不是想太多，我只是接收得更清楚。'
  },
  {
    id: 'negotiator', code: 'AR-08', name: '温柔谈判官', en: 'THE SOFT TALKS',
    rarity: 7.6, vector: [1,2,-3,-3], pattern: '++--', accent: '#6E9AA6', soft: '#D9EBEF',
    tagline: '吵架也可以体面，情绪平静了再讲道理。',
    tags: ['冷静型', '会沟通', '不翻旧账'],
    signal: '对方愿意在冲突里听你说完，就是最大的信任。',
    highlight: '你把每一次争执变成关系升级的机会。',
    trap: '冷静太久，对方以为你不在乎了。',
    match: '拉扯艺术家', prescription: '先说一句「我很在意这件事」，再开始冷静分析。',
    quote: '我不是不生气，我只是想好好把话说完。'
  },
  {
    id: 'deep', code: 'AR-09', name: '深海静音者', en: 'THE DEEP SILENCE',
    rarity: 6.8, vector: [-3,-3,1,-2], pattern: '--+-', accent: '#5A6E92', soft: '#DBE2EF',
    tagline: '情绪都在水面之下，能看见的人才是自己人。',
    tags: ['低表达', '高浓度', '慢速启动'],
    signal: '对方愿意安静陪你待着，不逼你说话。',
    highlight: '你的喜欢极安静，但一旦交付就非常彻底。',
    trap: '沉默太久，关系会在没有争吵的情况下变淡。',
    match: '焰火直球派', prescription: '每周给对方一句明确的肯定，哪怕很短。',
    quote: '我不擅长说，但我记得所有。'
  },
  {
    id: 'meme', code: 'AR-10', name: '甜梗制造机', en: 'THE SWEET MEMER',
    rarity: 9.8, vector: [2,2,-1,1], pattern: '++-+', accent: '#D88B45', soft: '#F7E3CC',
    tagline: '用幽默推进关系，笑着笑着就在一起了。',
    tags: ['气氛担当', '行动派', '快乐传染'],
    signal: '对方接住你的梗，还愿意跟你一起犯傻。',
    highlight: '你把暧昧变成一场好玩的游戏，谁都不累。',
    trap: '太会开玩笑，认真的话反而没人相信。',
    match: '边界诗人', prescription: '偶尔一本正经地说一句真心话，杀伤力翻倍。',
    quote: '喜欢你是真的，梗也是真的。'
  },
  {
    id: 'poet', code: 'AR-11', name: '边界诗人', en: 'THE BOUNDARY POET',
    rarity: 6.4, vector: [-1,2,-3,-2], pattern: '-++-', accent: '#788B7A', soft: '#DFE9DE',
    tagline: '清醒地浪漫，温柔地保持距离。',
    tags: ['高边界', '低消耗', '自洽型'],
    signal: '对方懂得敲门，而不是直接推门进来。',
    highlight: '你在亲密里保留自我，让双方都不必变形。',
    trap: '别人会觉得你难以靠近，即使你心里已经很柔软。',
    match: '甜梗制造机', prescription: '主动告诉对方：你慢热，但值得等。',
    quote: '我给的爱有边界，但边界之内全是真诚。'
  },
  {
    id: 'guard', code: 'AR-12', name: '炽热守望者', en: 'THE WARM GUARD',
    rarity: 6.4, vector: [2,-1,3,2], pattern: '+-++', accent: '#C96A5B', soft: '#F5DCD6',
    tagline: '主动靠近，长久守住，热烈且可靠。',
    tags: ['高投入', '行动浪漫', '稳定输出'],
    signal: '对方愿意把脆弱交给你，你会立刻接住。',
    highlight: '你既能点燃开始，也能撑住漫长的以后。',
    trap: '付出太满时，容易忽略自己也会累。',
    match: '月亮邮差', prescription: '记得留一部分热情给自己，爱才会更持久。',
    quote: '我会主动，也会一直在。'
  }
];
