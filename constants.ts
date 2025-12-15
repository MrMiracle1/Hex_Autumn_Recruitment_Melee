
import { Tier, GameItem, FinalOutcome } from './types';

// 概率配置
export const TIER_PROBABILITIES = {
  [Tier.SILVER]: 0.40,
  [Tier.GOLD]: 0.40,
  [Tier.PRISMATIC]: 0.20
};

export const ROUND_NAMES = [
  "第一轮：选择院校",
  "第二轮：选择专业",
  "第三轮：实习经历", // Swapped
  "第四轮：意向岗位"  // Swapped
];

// Helper to generate image url
const getImg = (id: string) => `https://picsum.photos/seed/${id}/400/600`;

// =========================================================================================
// 1. 学校池 (ROUND 1) - 仅限中国大陆
// =========================================================================================
export const SCHOOLS: GameItem[] = [
  // --- PRISMATIC (顶级985/C9) ---
  { id: 's_thu', type: 'SCHOOL', name: '清华大学', subTitle: '北京', tier: Tier.PRISMATIC, imageUrl: getImg('thu'), description: '国内顶尖学府，五道口男子职业技术学院。', statBonus: 120 },
  { id: 's_pku', type: 'SCHOOL', name: '北京大学', subTitle: '北京', tier: Tier.PRISMATIC, imageUrl: getImg('pku'), description: '一塔湖图，思想自由，兼容并包。', statBonus: 120 },
  { id: 's_fudan', type: 'SCHOOL', name: '复旦大学', subTitle: '上海', tier: Tier.PRISMATIC, imageUrl: getImg('fudan'), description: '自由而无用的灵魂，江南第一学府。', statBonus: 110 },
  { id: 's_sjtu', type: 'SCHOOL', name: '上海交通大学', subTitle: '上海', tier: Tier.PRISMATIC, imageUrl: getImg('sjtu'), description: '闵行女子职业技术学院，理工霸主。', statBonus: 110 },
  { id: 's_zju', type: 'SCHOOL', name: '浙江大学', subTitle: '杭州', tier: Tier.PRISMATIC, imageUrl: getImg('zju'), description: '东方剑桥，规模宏大，校区众多。', statBonus: 105 },
  { id: 's_ustc', type: 'SCHOOL', name: '中国科学技术大学', subTitle: '合肥', tier: Tier.PRISMATIC, imageUrl: getImg('ustc'), description: '千生一院士，离北京远，离科学近。', statBonus: 105 },
  { id: 's_nju', type: 'SCHOOL', name: '南京大学', subTitle: '南京', tier: Tier.PRISMATIC, imageUrl: getImg('nju'), description: '诚朴雄伟，励学敦行，低调内敛。', statBonus: 100 },
  { id: 's_ruc', type: 'SCHOOL', name: '中国人民大学', subTitle: '北京', tier: Tier.PRISMATIC, imageUrl: getImg('ruc'), description: '人文社科的最高殿堂，第二党校。', statBonus: 100 },
  { id: 's_buaa', type: 'SCHOOL', name: '北京航空航天大学', subTitle: '北京', tier: Tier.PRISMATIC, imageUrl: getImg('buaa'), description: '国防七子，仰望星空。', statBonus: 105 },
  { id: 's_hit', type: 'SCHOOL', name: '哈尔滨工业大学', subTitle: '哈尔滨', tier: Tier.PRISMATIC, imageUrl: getImg('hit'), description: '规格严格，功夫到家，工程师摇篮。', statBonus: 102 },
  { id: 's_xjtu', type: 'SCHOOL', name: '西安交通大学', subTitle: '西安', tier: Tier.PRISMATIC, imageUrl: getImg('xjtu'), description: '西迁精神，西北第一高校。', statBonus: 100 },

  // --- GOLD (强力985/211/特色强校) ---
  { id: 's_whu', type: 'SCHOOL', name: '武汉大学', subTitle: '武汉', tier: Tier.GOLD, imageUrl: getImg('whu'), description: '珞珈山下的樱花，网红大学。', statBonus: 90 },
  { id: 's_hust', type: 'SCHOOL', name: '华中科技大学', subTitle: '武汉', tier: Tier.GOLD, imageUrl: getImg('hust'), description: '学在华科，大厂青睐。', statBonus: 92 },
  { id: 's_bupt', type: 'SCHOOL', name: '北京邮电大学', subTitle: '北京', tier: Tier.GOLD, imageUrl: getImg('bupt'), description: '信息黄埔，互联网大厂的直通车。', statBonus: 95 },
  { id: 's_sysu', type: 'SCHOOL', name: '中山大学', subTitle: '广州', tier: Tier.GOLD, imageUrl: getImg('sysu'), description: '双鸭山大学，华南第一。', statBonus: 88 },
  { id: 's_xidian', type: 'SCHOOL', name: '西安电子科技大学', subTitle: '西安', tier: Tier.GOLD, imageUrl: getImg('xidian'), description: '两电一邮，华为的后花园。', statBonus: 90 },
  { id: 's_tongji', type: 'SCHOOL', name: '同济大学', subTitle: '上海', tier: Tier.GOLD, imageUrl: getImg('tongji'), description: '土木建筑领域的王者，吃饭大学。', statBonus: 88 },
  { id: 's_cuf', type: 'SCHOOL', name: '中央财经大学', subTitle: '北京', tier: Tier.GOLD, imageUrl: getImg('cuf'), description: '龙马担乾坤，财经黄埔。', statBonus: 85 },
  { id: 's_nankai', type: 'SCHOOL', name: '南开大学', subTitle: '天津', tier: Tier.GOLD, imageUrl: getImg('nankai'), description: '允公允能，日新月异。', statBonus: 85 },
  { id: 's_uestc', type: 'SCHOOL', name: '电子科技大学', subTitle: '成都', tier: Tier.GOLD, imageUrl: getImg('uestc'), description: '成电，电子信息领域的强校。', statBonus: 92 },
  { id: 's_scu', type: 'SCHOOL', name: '四川大学', subTitle: '成都', tier: Tier.GOLD, imageUrl: getImg('scu'), description: '海纳百川，有容乃大，火锅大学。', statBonus: 86 },
  { id: 's_bit', type: 'SCHOOL', name: '北京理工大学', subTitle: '北京', tier: Tier.GOLD, imageUrl: getImg('bit'), description: '国防科工，低调务实。', statBonus: 90 },
  { id: 's_tju', type: 'SCHOOL', name: '天津大学', subTitle: '天津', tier: Tier.GOLD, imageUrl: getImg('tju'), description: '中国第一所现代大学。', statBonus: 87 },
  { id: 's_xmu', type: 'SCHOOL', name: '厦门大学', subTitle: '厦门', tier: Tier.GOLD, imageUrl: getImg('xmu'), description: '最美海景宿舍，南方之强。', statBonus: 85 },
  { id: 's_seu', type: 'SCHOOL', name: '东南大学', subTitle: '南京', tier: Tier.GOLD, imageUrl: getImg('seu'), description: '九龙湖职业技术学院，工科强校。', statBonus: 90 },
  { id: 's_shufe', type: 'SCHOOL', name: '上海财经大学', subTitle: '上海', tier: Tier.GOLD, imageUrl: getImg('shufe'), description: '魔都财经，金饭碗。', statBonus: 89 },
  { id: 's_cau', type: 'SCHOOL', name: '中国农业大学', subTitle: '北京', tier: Tier.GOLD, imageUrl: getImg('cau'), description: '解民生之多艰。', statBonus: 80 },

  // --- SILVER (普通一本/二本/专科) ---
  { id: 's_szu', type: 'SCHOOL', name: '深圳大学', subTitle: '深圳', tier: Tier.SILVER, imageUrl: getImg('szu'), description: '双非中的战斗机，经费充足。', statBonus: 78 },
  { id: 's_hangdian', type: 'SCHOOL', name: '杭州电子科技大学', subTitle: '杭州', tier: Tier.SILVER, imageUrl: getImg('hdu'), description: '阿里校友众多，计算机实力不俗。', statBonus: 70 },
  { id: 's_lanxiang', type: 'SCHOOL', name: '山东蓝翔技师学院', subTitle: '济南', tier: Tier.SILVER, imageUrl: getImg('blue'), description: '挖掘机技术哪家强？', statBonus: 40 },
  { id: 's_xinhua', type: 'SCHOOL', name: '新东方烹饪学校', subTitle: '全国', tier: Tier.SILVER, imageUrl: getImg('cook'), description: '遇到新东方厨师就嫁了吧。', statBonus: 35 },
  { id: 's_minban', type: 'SCHOOL', name: '某民办三本学院', subTitle: '郊区', tier: Tier.SILVER, imageUrl: getImg('pvt'), description: '学费很贵，校园很像艾利斯顿商学院。', statBonus: 20 },
  { id: 's_poly', type: 'SCHOOL', name: '职业技术学院', subTitle: '县城', tier: Tier.SILVER, imageUrl: getImg('poly'), description: '大国工匠的起点。', statBonus: 15 },
  { id: 's_adult', type: 'SCHOOL', name: '成人自考班', subTitle: '在线', tier: Tier.SILVER, imageUrl: getImg('adult'), description: '学历提升，圆你大学梦。', statBonus: 10 },
  { id: 's_xx_college', type: 'SCHOOL', name: '某某城市学院', subTitle: '地级市', tier: Tier.SILVER, imageUrl: getImg('citycol'), description: '本地人为主，安逸。', statBonus: 30 },
  { id: 's_net_edu', type: 'SCHOOL', name: '网络教育学院', subTitle: '云端', tier: Tier.SILVER, imageUrl: getImg('net'), description: '宽进宽出。', statBonus: 10 },
  { id: 's_finance_voc', type: 'SCHOOL', name: '财经职业学院', subTitle: '省会', tier: Tier.SILVER, imageUrl: getImg('finvoc'), description: '可以专升本。', statBonus: 25 },
  { id: 's_normal_xx', type: 'SCHOOL', name: 'xx师范专科', subTitle: '县城', tier: Tier.SILVER, imageUrl: getImg('norm'), description: '为了当老师。', statBonus: 25 },
  { id: 's_police', type: 'SCHOOL', name: 'xx警官学院', subTitle: '省会', tier: Tier.SILVER, imageUrl: getImg('police'), description: '入警率高，管理严格。', statBonus: 60 },
  { id: 's_railway', type: 'SCHOOL', name: '铁道职业技术', subTitle: '枢纽', tier: Tier.SILVER, imageUrl: getImg('rail'), description: '毕业修高铁。', statBonus: 40 },
  { id: 's_art', type: 'SCHOOL', name: 'xx艺术学院', subTitle: '省会', tier: Tier.SILVER, imageUrl: getImg('artsch'), description: '帅哥美女多，烧钱。', statBonus: 30 },
];

// =========================================================================================
// 2. 专业池 (ROUND 2)
// =========================================================================================
export const MAJORS: GameItem[] = [
  // --- PRISMATIC ---
  { id: 'm_cs', type: 'MAJOR', name: '计算机科学', subTitle: '工学', category: 'STEM', tier: Tier.PRISMATIC, imageUrl: getImg('cs'), description: '宇宙机，时代的红利。', statBonus: 100 },
  { id: 'm_ai', type: 'MAJOR', name: '人工智能', subTitle: '工学', category: 'STEM', tier: Tier.PRISMATIC, imageUrl: getImg('ai'), description: '大模型炼丹师，未来的主宰。', statBonus: 105 },
  { id: 'm_soft', type: 'MAJOR', name: '软件工程', subTitle: '工学', category: 'STEM', tier: Tier.PRISMATIC, imageUrl: getImg('soft'), description: '代码搬运工，薪资天花板。', statBonus: 98 },
  { id: 'm_fin_eng', type: 'MAJOR', name: '金融工程', subTitle: '经济学', category: 'BIZ', tier: Tier.PRISMATIC, imageUrl: getImg('fintech'), description: '用数学收割财富。', statBonus: 95 },
  { id: 'm_micro', type: 'MAJOR', name: '微电子科学', subTitle: '工学', category: 'STEM', tier: Tier.PRISMATIC, imageUrl: getImg('chip'), description: '国家战略核心，芯片造富。', statBonus: 100 },
  { id: 'm_clin_8', type: 'MAJOR', name: '临床医学(八年)', subTitle: '医学', category: 'MED', tier: Tier.PRISMATIC, imageUrl: getImg('doc8'), description: '本博连读，毕业即巅峰。', statBonus: 95 },
  { id: 'm_math', type: 'MAJOR', name: '应用数学', subTitle: '理学', category: 'STEM', tier: Tier.PRISMATIC, imageUrl: getImg('math'), description: '万物皆数，量化的基础。', statBonus: 90 },
  { id: 'm_law_top', type: 'MAJOR', name: '法学(涉外)', subTitle: '法学', category: 'HUMANITIES', tier: Tier.PRISMATIC, imageUrl: getImg('lawtop'), description: '红圈所预定。', statBonus: 92 },
  { id: 'm_physics', type: 'MAJOR', name: '物理学(强基)', subTitle: '理学', category: 'STEM', tier: Tier.PRISMATIC, imageUrl: getImg('phy'), description: '探究宇宙真理，智商过滤器。', statBonus: 91 },

  // --- GOLD ---
  { id: 'm_ee', type: 'MAJOR', name: '电子信息', subTitle: '工学', category: 'STEM', tier: Tier.GOLD, imageUrl: getImg('ee'), description: '硬科技基石，进可攻退可守。', statBonus: 85 },
  { id: 'm_auto', type: 'MAJOR', name: '自动化', subTitle: '工学', category: 'STEM', tier: Tier.GOLD, imageUrl: getImg('auto'), description: '控制万物，工业4.0。', statBonus: 82 },
  { id: 'm_law', type: 'MAJOR', name: '法学', subTitle: '法学', category: 'HUMANITIES', tier: Tier.GOLD, imageUrl: getImg('law'), description: '考公卷王，律所卷王。', statBonus: 75 },
  { id: 'm_acc', type: 'MAJOR', name: '会计学', subTitle: '管理学', category: 'BIZ', tier: Tier.GOLD, imageUrl: getImg('acca'), description: '越老越吃香，掌握核心账本。', statBonus: 70 },
  { id: 'm_stat', type: 'MAJOR', name: '统计学', subTitle: '理学', category: 'STEM', tier: Tier.GOLD, imageUrl: getImg('stat'), description: '数据科学的鼻祖。', statBonus: 80 },
  { id: 'm_comm', type: 'MAJOR', name: '通信工程', subTitle: '工学', category: 'STEM', tier: Tier.GOLD, imageUrl: getImg('5g'), description: '5G/6G时代。', statBonus: 82 },
  { id: 'm_dent', type: 'MAJOR', name: '口腔医学', subTitle: '医学', category: 'MED', tier: Tier.GOLD, imageUrl: getImg('tooth'), description: '金眼科，银外科，开豪车的牙科。', statBonus: 88 },
  { id: 'm_energy', type: 'MAJOR', name: '新能源', subTitle: '工学', category: 'STEM', tier: Tier.GOLD, imageUrl: getImg('bat'), description: '电池与电动车，风口行业。', statBonus: 80 },
  { id: 'm_civil', type: 'MAJOR', name: '土木工程', subTitle: '工学', category: 'STEM', tier: Tier.GOLD, imageUrl: getImg('civil'), description: '大兴土木的时代已过？但底蕴犹在。', statBonus: 60 },
  { id: 'm_arch', type: 'MAJOR', name: '建筑学', subTitle: '工学', category: 'STEM', tier: Tier.GOLD, imageUrl: getImg('archmaj'), description: '熬夜画图，艺术与技术的结合。', statBonus: 65 },
  { id: 'm_news', type: 'MAJOR', name: '新闻传播', subTitle: '文学', category: 'HUMANITIES', tier: Tier.GOLD, imageUrl: getImg('news'), description: '无冕之王，或者营销号小编。', statBonus: 65 },

  // --- SILVER ---
  { id: 'm_bio', type: 'MAJOR', name: '生物科学', subTitle: '理学', category: 'STEM', tier: Tier.SILVER, imageUrl: getImg('bio'), description: '21世纪是生物的世纪（滑稽）。', statBonus: 40 },
  { id: 'm_env', type: 'MAJOR', name: '环境工程', subTitle: '工学', category: 'STEM', tier: Tier.SILVER, imageUrl: getImg('env'), description: '四大天坑之一，用爱发电。', statBonus: 35 },
  { id: 'm_mat', type: 'MAJOR', name: '材料科学', subTitle: '工学', category: 'STEM', tier: Tier.SILVER, imageUrl: getImg('mat'), description: '材子佳人，科研路漫漫。', statBonus: 42 },
  { id: 'm_chem', type: 'MAJOR', name: '化学', subTitle: '理学', category: 'STEM', tier: Tier.SILVER, imageUrl: getImg('chem'), description: '危险与机遇并存，主要是危险。', statBonus: 38 },
  { id: 'm_philo', type: 'MAJOR', name: '哲学', subTitle: '哲学', category: 'HUMANITIES', tier: Tier.SILVER, imageUrl: getImg('philo'), description: '无用之用，方为大用。', statBonus: 30 },
  { id: 'm_hist', type: 'MAJOR', name: '历史学', subTitle: '历史', category: 'HUMANITIES', tier: Tier.SILVER, imageUrl: getImg('hist'), description: '究天人之际，通古今之变。', statBonus: 25 },
  { id: 'm_cn', type: 'MAJOR', name: '汉语言文学', subTitle: '文学', category: 'HUMANITIES', tier: Tier.SILVER, imageUrl: getImg('cn'), description: '考公第一大户。', statBonus: 45 },
  { id: 'm_tour', type: 'MAJOR', name: '旅游管理', subTitle: '管理学', category: 'BIZ', tier: Tier.SILVER, imageUrl: getImg('tour'), description: '导游跑断腿。', statBonus: 28 },
  { id: 'm_ecomm', type: 'MAJOR', name: '电子商务', subTitle: '管理学', category: 'BIZ', tier: Tier.SILVER, imageUrl: getImg('ecomm'), description: '主要是做淘宝客服。', statBonus: 35 },
  { id: 'm_mkt', type: 'MAJOR', name: '市场营销', subTitle: '管理学', category: 'BIZ', tier: Tier.SILVER, imageUrl: getImg('mkt'), description: '什么都学，什么都不精。', statBonus: 30 },
  { id: 'm_eng', type: 'MAJOR', name: '英语', subTitle: '文学', category: 'HUMANITIES', tier: Tier.SILVER, imageUrl: getImg('eng'), description: '会被翻译AI取代吗？', statBonus: 35 },
  { id: 'm_soc', type: 'MAJOR', name: '社会学', subTitle: '法学', category: 'HUMANITIES', tier: Tier.SILVER, imageUrl: getImg('soc'), description: '屠龙之术，毕业难找工作。', statBonus: 25 },
  { id: 'm_psych', type: 'MAJOR', name: '应用心理学', subTitle: '理学', category: 'STEM', tier: Tier.SILVER, imageUrl: getImg('psych'), description: '算命还是科学？人力资源预备役。', statBonus: 35 },
  { id: 'm_logis', type: 'MAJOR', name: '物流管理', subTitle: '管理学', category: 'BIZ', tier: Tier.SILVER, imageUrl: getImg('logis'), description: '送快递的？不，是供应链。', statBonus: 32 },
  { id: 'm_admin', type: 'MAJOR', name: '公共事业管理', subTitle: '管理学', category: 'BIZ', tier: Tier.SILVER, imageUrl: getImg('pubadm'), description: '除了考公，别无出路。', statBonus: 20 },
];

// =========================================================================================
// 3. 实习池 (ROUND 3) - Swapped with Job
// =========================================================================================
export const INTERNSHIPS: GameItem[] = [
  // --- PRISMATIC (顶级大厂/核心部门) ---
  { id: 'i_bytedance', type: 'INTERNSHIP', name: '字节跳动', subTitle: '北京', tier: Tier.PRISMATIC, imageUrl: getImg('byte'), description: '心脏部门，推荐算法，卷并快乐着。', allowedCategories: ['TECH'], statBonus: 120 },
  { id: 'i_tencent', type: 'INTERNSHIP', name: '腾讯-微信', subTitle: '广州', tier: Tier.PRISMATIC, imageUrl: getImg('wx'), description: '互联网产品的最高殿堂，瑞雪。', allowedCategories: ['PRODUCT', 'TECH'], statBonus: 115 },
  { id: 'i_ali', type: 'INTERNSHIP', name: '阿里云', subTitle: '杭州', tier: Tier.PRISMATIC, imageUrl: getImg('ali'), description: '技术大牛云集，福报厂。', allowedCategories: ['TECH'], statBonus: 110 },
  { id: 'i_pbc', type: 'INTERNSHIP', name: '人民银行总行', subTitle: '北京', tier: Tier.PRISMATIC, imageUrl: getImg('pbc'), description: '金融顶层设计，这就是排面。', allowedCategories: ['FINANCE'], statBonus: 110 },
  { id: 'i_cicc', type: 'INTERNSHIP', name: '中金公司', subTitle: '北京', tier: Tier.PRISMATIC, imageUrl: getImg('cicc'), description: '国贸精英，年薪百万的起点。', allowedCategories: ['FINANCE'], statBonus: 120 },
  { id: 'i_ministry', type: 'INTERNSHIP', name: '中央部委', subTitle: '北京', tier: Tier.PRISMATIC, imageUrl: getImg('govtop'), description: '仕途起点，为人民服务。', allowedCategories: ['FUNCTION'], statBonus: 115 },
  { id: 'i_catl', type: 'INTERNSHIP', name: '宁德时代', subTitle: '福建', tier: Tier.PRISMATIC, imageUrl: getImg('catl'), description: '宁王，新能源霸主，硬核奋斗。', allowedCategories: ['TECH', 'STEM'], statBonus: 105 },
  { id: 'i_openai_cn', type: 'INTERNSHIP', name: '某AI独角兽', subTitle: '北京', tier: Tier.PRISMATIC, imageUrl: getImg('aistartup'), description: '百模大战核心团队，对标OpenAI。', allowedCategories: ['TECH'], statBonus: 115 },
  { id: 'i_rocket', type: 'INTERNSHIP', name: '航天科技集团', subTitle: '北京', tier: Tier.PRISMATIC, imageUrl: getImg('rocket'), description: '大国重器，星辰大海。', allowedCategories: ['TECH', 'STEM'], statBonus: 110 },

  // --- GOLD (知名大厂/独角兽/大型国企) ---
  { id: 'i_meituan', type: 'INTERNSHIP', name: '美团', subTitle: '北京', tier: Tier.GOLD, imageUrl: getImg('meituan'), description: '开水团，核心业务，锻炼人。', allowedCategories: ['TECH', 'PRODUCT'], statBonus: 90 },
  { id: 'i_jd', type: 'INTERNSHIP', name: '京东', subTitle: '北京', tier: Tier.GOLD, imageUrl: getImg('jd'), description: '兄弟文化，物流很强。', allowedCategories: ['TECH', 'BIZ'], statBonus: 85 },
  { id: 'i_pdd', type: 'INTERNSHIP', name: '拼多多', subTitle: '上海', tier: Tier.GOLD, imageUrl: getImg('pdd'), description: '本分厂，钱给的实在太多了。', allowedCategories: ['TECH'], statBonus: 95 },
  { id: 'i_tesla', type: 'INTERNSHIP', name: '特斯拉中国', subTitle: '上海', tier: Tier.GOLD, imageUrl: getImg('tesla'), description: '第一性原理，外企氛围。', allowedCategories: ['TECH', 'BIZ'], statBonus: 88 },
  { id: 'i_huawei', type: 'INTERNSHIP', name: '华为', subTitle: '深圳', tier: Tier.GOLD, imageUrl: getImg('hw'), description: '奋斗者协议，遥遥领先。', allowedCategories: ['TECH'], statBonus: 92 },
  { id: 'i_grid', type: 'INTERNSHIP', name: '国家电网', subTitle: '省会', tier: Tier.GOLD, imageUrl: getImg('grid'), description: '丈母娘最爱，稳定供电。', allowedCategories: ['TECH'], statBonus: 85 },
  { id: 'i_pingan', type: 'INTERNSHIP', name: '平安集团', subTitle: '深圳', tier: Tier.GOLD, imageUrl: getImg('pingan'), description: '金融巨头，全牌照。', allowedCategories: ['FINANCE'], statBonus: 85 },
  { id: 'i_netease', type: 'INTERNSHIP', name: '网易游戏', subTitle: '广州', tier: Tier.GOLD, imageUrl: getImg('netease'), description: '猪场，伙食好，游戏强。', allowedCategories: ['TECH', 'PRODUCT', 'DESIGN'], statBonus: 88 },
  { id: 'i_byd', type: 'INTERNSHIP', name: '比亚迪', subTitle: '深圳', tier: Tier.GOLD, imageUrl: getImg('byd'), description: '卷王之王，销量冠军。', allowedCategories: ['TECH', 'STEM'], statBonus: 90 },
  { id: 'i_xiaomi', type: 'INTERNSHIP', name: '小米', subTitle: '北京', tier: Tier.GOLD, imageUrl: getImg('mi'), description: '为发烧而生，年轻人的第一份实习。', allowedCategories: ['TECH'], statBonus: 88 },
  { id: 'i_boc', type: 'INTERNSHIP', name: '中国银行', subTitle: '省行', tier: Tier.GOLD, imageUrl: getImg('boc'), description: '四大行之一，体面。', allowedCategories: ['FINANCE'], statBonus: 82 },
  { id: 'i_ct', type: 'INTERNSHIP', name: '中国电信', subTitle: '市公司', tier: Tier.GOLD, imageUrl: getImg('telecom'), description: '运营商，福利好。', allowedCategories: ['TECH'], statBonus: 80 },
  { id: 'i_tobacco', type: 'INTERNSHIP', name: '烟草局', subTitle: '市局', tier: Tier.GOLD, imageUrl: getImg('smoke'), description: '闷声发大财，非常难进。', allowedCategories: ['FUNCTION'], statBonus: 95 },

  // --- SILVER (中小厂/传统企业/基层) ---
  { id: 'i_ruijie', type: 'INTERNSHIP', name: '锐捷网络', subTitle: '福州', tier: Tier.SILVER, imageUrl: getImg('ruijie'), description: 'ICT老厂，数通设备。', allowedCategories: ['TECH'], statBonus: 60 },
  { id: 'i_dewu', type: 'INTERNSHIP', name: '得物', subTitle: '上海', tier: Tier.SILVER, imageUrl: getImg('dewu'), description: '潮流电商，毒。', allowedCategories: ['TECH', 'OPERATE'], statBonus: 55 },
  { id: 'i_lianjia', type: 'INTERNSHIP', name: '链家', subTitle: '全国', tier: Tier.SILVER, imageUrl: getImg('lianjia'), description: '西装革履卖房子。', allowedCategories: ['MARKET'], statBonus: 40 },
  { id: 'i_mcn', type: 'INTERNSHIP', name: '某MCN', subTitle: '杭州', tier: Tier.SILVER, imageUrl: getImg('mcn'), description: '给网红打杂，剪视频。', allowedCategories: ['OPERATE'], statBonus: 35 },
  { id: 'i_street', type: 'INTERNSHIP', name: '街道办', subTitle: '社区', tier: Tier.SILVER, imageUrl: getImg('govst'), description: '调解纠纷，各种填表。', allowedCategories: ['FUNCTION'], statBonus: 45 },
  { id: 'i_tea', type: 'INTERNSHIP', name: '蜜雪冰城', subTitle: '门店', tier: Tier.SILVER, imageUrl: getImg('tea'), description: '你爱我，我爱你，雪王。', allowedCategories: ['SERVICE'], statBonus: 25 },
  { id: 'i_prop', type: 'INTERNSHIP', name: '小区物业', subTitle: '小区', tier: Tier.SILVER, imageUrl: getImg('prop'), description: '保安大队，少走四十年弯路。', allowedCategories: ['SERVICE'], statBonus: 30 },
  { id: 'i_factory', type: 'INTERNSHIP', name: '电子厂', subTitle: '园区', tier: Tier.SILVER, imageUrl: getImg('fac'), description: '流水线，三点一线。', allowedCategories: ['TECH'], statBonus: 35 },
  { id: 'i_call', type: 'INTERNSHIP', name: '呼叫中心', subTitle: '写字楼', tier: Tier.SILVER, imageUrl: getImg('call'), description: '你好，这里是...嘟嘟嘟。', allowedCategories: ['MARKET'], statBonus: 20 },
  { id: 'i_soft_small', type: 'INTERNSHIP', name: '外包公司', subTitle: '居民楼', tier: Tier.SILVER, imageUrl: getImg('smalls'), description: '驻场开发，二等公民。', allowedCategories: ['TECH'], statBonus: 30 },
  { id: 'i_tv', type: 'INTERNSHIP', name: '县电视台', subTitle: '县城', tier: Tier.SILVER, imageUrl: getImg('tv'), description: '由于新媒体冲击，也没什么人看。', allowedCategories: ['HUMANITIES'], statBonus: 35 },
  { id: 'i_construction', type: 'INTERNSHIP', name: '某建筑公司', subTitle: '工地', tier: Tier.SILVER, imageUrl: getImg('site'), description: '打灰，提桶跑路。', allowedCategories: ['STEM'], statBonus: 30 },
  { id: 'i_kfc', type: 'INTERNSHIP', name: '肯德基', subTitle: '门店', tier: Tier.SILVER, imageUrl: getImg('kfc'), description: '疯狂星期四V我50。', allowedCategories: ['SERVICE'], statBonus: 25 },
];

// =========================================================================================
// 4. 岗位池 (ROUND 4) - Swapped with Internship
// =========================================================================================
export const JOBS: GameItem[] = [
  // --- PRISMATIC ---
  { id: 'j_algo', type: 'JOB', name: '算法工程师', subTitle: '研发', category: 'TECH', tier: Tier.PRISMATIC, imageUrl: getImg('algo'), description: '模型训练，年薪百万。', statBonus: 100 },
  { id: 'j_quant', type: 'JOB', name: '量化研究员', subTitle: '金融', category: 'FINANCE', tier: Tier.PRISMATIC, imageUrl: getImg('quant'), description: '奖金比工资高，数学天才的游戏。', statBonus: 110 },
  { id: 'j_arch', type: 'JOB', name: '系统架构师', subTitle: '研发', category: 'TECH', tier: Tier.PRISMATIC, imageUrl: getImg('arch'), description: '高屋建瓴，核心设计，也是发际线终结者。', statBonus: 105 },
  { id: 'j_ibd', type: 'JOB', name: '投行分析师', subTitle: '金融', category: 'FINANCE', tier: Tier.PRISMATIC, imageUrl: getImg('ibd'), description: '每周工作100小时，穿Prada的金融民工。', statBonus: 95 },
  { id: 'j_partner', type: 'JOB', name: '管理培训生(SSP)', subTitle: '管培', category: 'BIZ', tier: Tier.PRISMATIC, imageUrl: getImg('gmt'), description: '未来的CEO，火箭晋升通道。', statBonus: 90 },
  { id: 'j_ai_res', type: 'JOB', name: 'AI科学家', subTitle: '研发', category: 'TECH', tier: Tier.PRISMATIC, imageUrl: getImg('scientist'), description: '推动人类边界，智商碾压。', statBonus: 115 },
  { id: 'j_fund', type: 'JOB', name: '基金经理', subTitle: '金融', category: 'FINANCE', tier: Tier.PRISMATIC, imageUrl: getImg('fund'), description: '掌控百亿资金，在天台与别墅间徘徊。', statBonus: 105 },
  { id: 'j_chief', type: 'JOB', name: '主治医师', subTitle: '医疗', category: 'MED', tier: Tier.PRISMATIC, imageUrl: getImg('chiefdoc'), description: '神之手，起死回生。', statBonus: 100 },
  { id: 'j_judge', type: 'JOB', name: '员额法官', subTitle: '司法', category: 'LEGAL', tier: Tier.PRISMATIC, imageUrl: getImg('judge'), description: '手握法槌，定分止争。', statBonus: 100 },

  // --- GOLD ---
  { id: 'j_backend', type: 'JOB', name: '后端开发', subTitle: '研发', category: 'TECH', tier: Tier.GOLD, imageUrl: getImg('java'), description: 'Java/Go一把梭，高并发全靠扛。', statBonus: 85 },
  { id: 'j_frontend', type: 'JOB', name: '前端开发', subTitle: '研发', category: 'TECH', tier: Tier.GOLD, imageUrl: getImg('react'), description: '用户体验把关人，切图仔翻身。', statBonus: 82 },
  { id: 'j_pm', type: 'JOB', name: '产品经理', subTitle: '产品', category: 'PRODUCT', tier: Tier.GOLD, imageUrl: getImg('pm'), description: '画饼专家，不仅要懂技术还要懂人性。', statBonus: 78 },
  { id: 'j_data', type: 'JOB', name: '数据分析', subTitle: '数据', category: 'TECH', tier: Tier.GOLD, imageUrl: getImg('data'), description: 'SQL写得好，下班早。', statBonus: 75 },
  { id: 'j_legal', type: 'JOB', name: '公司法务', subTitle: '法务', category: 'LEGAL', tier: Tier.GOLD, imageUrl: getImg('legal'), description: '规避风险，审核合同。', statBonus: 72 },
  { id: 'j_doc', type: 'JOB', name: '住院医师', subTitle: '医疗', category: 'MED', tier: Tier.GOLD, imageUrl: getImg('doc'), description: '治病救人，虽然头发掉得快。', statBonus: 90 },
  { id: 'j_audit', type: 'JOB', name: '审计师', subTitle: '财务', category: 'FINANCE', tier: Tier.GOLD, imageUrl: getImg('audit'), description: '由于出差太多，导致单身。', statBonus: 75 },
  { id: 'j_game_des', type: 'JOB', name: '游戏策划', subTitle: '产品', category: 'PRODUCT', tier: Tier.GOLD, imageUrl: getImg('game'), description: '创造快乐，也创造Bug。', statBonus: 80 },
  { id: 'j_embedded', type: 'JOB', name: '嵌入式开发', subTitle: '研发', category: 'TECH', tier: Tier.GOLD, imageUrl: getImg('embed'), description: '软硬结合，越老越吃香。', statBonus: 85 },
  { id: 'j_ui', type: 'JOB', name: 'UI设计师', subTitle: '设计', category: 'DESIGN', tier: Tier.GOLD, imageUrl: getImg('ui'), description: '像素眼，五彩斑斓的黑。', statBonus: 70 },
  { id: 'j_teacher', type: 'JOB', name: '高中老师', subTitle: '教育', category: 'EDU', tier: Tier.GOLD, imageUrl: getImg('teach'), description: '虽然累，但是有寒暑假啊。', statBonus: 80 },
  { id: 'j_counsellor', type: 'JOB', name: '大学辅导员', subTitle: '教育', category: 'EDU', tier: Tier.GOLD, imageUrl: getImg('uni'), description: '可以留校，稳定。', statBonus: 75 },
  { id: 'j_sales_dir', type: 'JOB', name: '销售总监', subTitle: '销售', category: 'MARKET', tier: Tier.GOLD, imageUrl: getImg('saledir'), description: '背背KPI，带带团队。', statBonus: 85 },

  // --- SILVER ---
  { id: 'j_op', type: 'JOB', name: '用户运营', subTitle: '运营', category: 'OPERATE', tier: Tier.SILVER, imageUrl: getImg('userop'), description: '拉新促活，社群陪聊。', statBonus: 50 },
  { id: 'j_content', type: 'JOB', name: '内容编辑', subTitle: '运营', category: 'OPERATE', tier: Tier.SILVER, imageUrl: getImg('editor'), description: '月薪三千五，用爱发电。', statBonus: 45 },
  { id: 'j_sales', type: 'JOB', name: '销售专员', subTitle: '销售', category: 'MARKET', tier: Tier.SILVER, imageUrl: getImg('sales'), description: '提成看天命，底薪只能吃土。', statBonus: 55 },
  { id: 'j_hr', type: 'JOB', name: '人事专员', subTitle: '职能', category: 'FUNCTION', tier: Tier.SILVER, imageUrl: getImg('hr'), description: '招聘算薪，处理纠纷。', statBonus: 40 },
  { id: 'j_admin', type: 'JOB', name: '行政助理', subTitle: '职能', category: 'FUNCTION', tier: Tier.SILVER, imageUrl: getImg('admin'), description: '全能打杂，订盒饭。', statBonus: 30 },
  { id: 'j_cs', type: 'JOB', name: '客服', subTitle: '服务', category: 'SERVICE', tier: Tier.SILVER, imageUrl: getImg('cs_job'), description: '亲，在吗？由于情绪劳动过重而抑郁。', statBonus: 25 },
  { id: 'j_tester', type: 'JOB', name: '功能测试', subTitle: '研发', category: 'TECH', tier: Tier.SILVER, imageUrl: getImg('test'), description: '点点点，背锅侠。', statBonus: 45 },
  { id: 'j_cashier', type: 'JOB', name: '出纳', subTitle: '财务', category: 'FINANCE', tier: Tier.SILVER, imageUrl: getImg('cash'), description: '管钱不管账，数钱数到手抽筋（不是自己的）。', statBonus: 35 },
  { id: 'j_clerk', type: 'JOB', name: '文员', subTitle: '职能', category: 'FUNCTION', tier: Tier.SILVER, imageUrl: getImg('clerk'), description: '熟练使用Office，打印机维修专家。', statBonus: 20 },
  { id: 'j_gwy', type: 'JOB', name: '乡镇公务员', subTitle: '公职', category: 'FUNCTION', tier: Tier.SILVER, imageUrl: getImg('gov'), description: '稳定是稳定，就是事多钱少离家远。', statBonus: 60 },
  { id: 'j_agent', type: 'JOB', name: '房产中介', subTitle: '销售', category: 'MARKET', tier: Tier.SILVER, imageUrl: getImg('agent'), description: '大哥看房吗？风里来雨里去。', statBonus: 45 },
  { id: 'j_delivery', type: 'JOB', name: '外卖骑手', subTitle: '服务', category: 'SERVICE', tier: Tier.SILVER, imageUrl: getImg('bike'), description: '单王月入过万，但是废腰废膝盖。', statBonus: 40 },
  { id: 'j_security', type: 'JOB', name: '保安', subTitle: '服务', category: 'SERVICE', tier: Tier.SILVER, imageUrl: getImg('sec'), description: '少走四十年弯路。', statBonus: 30 },
];

export const POOLS: Record<number, GameItem[]> = {
  1: SCHOOLS,
  2: MAJORS,
  3: INTERNSHIPS, // Swapped
  4: JOBS        // Swapped
};

// Remove local getFinalDecision as we will use AI
