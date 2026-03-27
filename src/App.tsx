import { useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
  Check,
  ChevronLeft,
  Heart,
  Home,
  MapPin,
  Monitor,
  Search,
  Settings2,
  Smartphone,
  User,
} from "lucide-react";

type TabKey = "square" | "assessment" | "mine" | "manage";
type ViewKey = "tabs" | "results" | "detail" | "apply" | "success";
type Category =
  | "学术科技"
  | "文艺表演"
  | "体育运动"
  | "志愿公益"
  | "创业实践"
  | "兴趣生活";
type ApplicationStatus = "待审核" | "已通过" | "未通过";
type TimeOption = "1~2h" | "3~5h" | "5~8h" | "8h以上";

type SurveyAnswer = {
  interests: string[];
  goals: string[];
  time: TimeOption | "";
  collaboration: string;
  skills: string[];
};

type Club = {
  id: string;
  name: string;
  category: Category;
  tags: string[];
  shortDescription: string;
  fullDescription: string;
  firstSemesterTasks: string;
  suitableFor: string;
  notSuitableFor: string;
  timeCommitment: TimeOption;
  busyNote: string;
  beginnerFriendly: "零基础可" | "有基础更适合";
  interviewDifficulty: "无需面试" | "简单面试" | "常规面试" | "有一定难度";
  interviewFormat: string;
  growthAreas: string[];
  deadline: string;
  popularity: number;
  requiredSkills: string[];
  interestTags: string[];
  goalTags: string[];
  collaborationFit: string[];
  logo: string;
};

type MatchResult = {
  clubId: string;
  score: number;
  reasons: string[];
};

type Application = {
  id: string;
  clubId: string;
  name: string;
  major: string;
  grade: string;
  contact: string;
  strengths: string;
  time: TimeOption;
  motivation: string;
  status: ApplicationStatus;
  matchScore: number;
  appliedAt: string;
};

type DeviceMode = "mobile" | "desktop";

const categories: Array<"全部" | Category> = [
  "全部",
  "学术科技",
  "文艺表演",
  "体育运动",
  "志愿公益",
  "创业实践",
  "兴趣生活",
];

const interestOptions = [
  "编程开发",
  "商业分析",
  "文艺创作",
  "体育运动",
  "社会公益",
  "视觉设计",
  "演讲辩论",
  "科学研究",
];

const goalOptions = ["专业技能", "人脉社交", "比赛经历", "放松娱乐", "领导力锻炼"];
const timeOptions: TimeOption[] = ["1~2h", "3~5h", "5~8h", "8h以上"];
const collaborationOptions = ["独立完成任务为主", "小组讨论协作", "大型团队配合", "都可以"];
const skillOptions = ["编程", "写作", "设计", "视频剪辑", "数据分析", "公众演讲", "运动竞技"];

const clubs: Club[] = [
  {
    id: "acm",
    name: "ACM 编程社",
    category: "学术科技",
    tags: ["项目制", "每周5h", "需面试"],
    shortDescription: "平时会做算法训练、组队做小项目，适合想把编程真正练起来的人。",
    fullDescription: "平时主要是做算法题、听技术分享，也会拉小组做网页、小工具或者比赛项目。不是天天开会，但如果你真想学东西，自己要愿意持续练。",
    firstSemesterTasks: "新生一般先跟训练营、做基础题单，再参加一次校内练习赛或加入一个小项目组。",
    suitableFor: "适合愿意长期学技术、能接受自己找时间练习的人。",
    notSuitableFor: "如果你只是想随便挂个名，或者完全不想碰代码，进去会比较难受。",
    timeCommitment: "5~8h",
    busyNote: "平时每周 5 小时左右，比赛前会更忙。",
    beginnerFriendly: "有基础更适合",
    interviewDifficulty: "有一定难度",
    interviewFormat: "通常会问基础、做过的东西和你想往哪个方向学。",
    growthAreas: ["编程能力", "项目经验", "比赛经历"],
    deadline: "2026-09-15",
    popularity: 90,
    requiredSkills: ["编程"],
    interestTags: ["编程开发", "科学研究"],
    goalTags: ["专业技能", "比赛经历"],
    collaborationFit: ["独立完成任务为主", "小组讨论协作", "都可以"],
    logo: "ACM",
  },
  {
    id: "robot",
    name: "机器人协会",
    category: "学术科技",
    tags: ["动手实践", "每周5h", "需面试"],
    shortDescription: "会做硬件、小车和比赛项目，比较适合喜欢动手和调试的人。",
    fullDescription: "平时会分组做机械、电控、程序相关的内容，新人前期一般先学基础工具和简单模块。社里氛围不错，但项目推进时会比较吃时间。",
    firstSemesterTasks: "大一新生通常先跟学长做基础焊接、接线和简单调试，熟悉后再进正式项目组。",
    suitableFor: "适合愿意动手、愿意查资料和慢慢磨问题的人。",
    notSuitableFor: "如果你不喜欢硬件调试或者没耐心反复试错，可能会觉得比较累。",
    timeCommitment: "5~8h",
    busyNote: "平时每周 5 小时，比赛节点前会明显加班。",
    beginnerFriendly: "有基础更适合",
    interviewDifficulty: "常规面试",
    interviewFormat: "会问兴趣方向、基础情况，以及你能投入的时间。",
    growthAreas: ["工程实践", "团队协作", "比赛项目"],
    deadline: "2026-09-18",
    popularity: 76,
    requiredSkills: ["编程"],
    interestTags: ["编程开发", "科学研究"],
    goalTags: ["专业技能", "比赛经历"],
    collaborationFit: ["小组讨论协作", "大型团队配合", "都可以"],
    logo: "RA",
  },
  {
    id: "choir",
    name: "合唱团",
    category: "文艺表演",
    tags: ["零基础友好", "每周3h", "简单面试"],
    shortDescription: "平时以排练和演出为主，氛围比较温和，适合想稳定参与的人。",
    fullDescription: "社团平时主要是每周排练、节日前加练和参加晚会演出。要求不是特别高，但更看重出勤和配合，适合想在大学里找一个长期待着的文艺社团。",
    firstSemesterTasks: "新生通常先试音分声部，熟悉排练流程，再参加一次校内演出。",
    suitableFor: "适合喜欢唱歌、接受规律排练、想认识一群稳定伙伴的人。",
    notSuitableFor: "如果你完全不想参加固定排练，后面会跟不上。",
    timeCommitment: "3~5h",
    busyNote: "平时每周 3 小时左右，演出前会多排几次。",
    beginnerFriendly: "零基础可",
    interviewDifficulty: "简单面试",
    interviewFormat: "一般是试音和简单聊聊你平时有没有时间参加排练。",
    growthAreas: ["舞台经验", "乐感", "朋友关系"],
    deadline: "2026-09-20",
    popularity: 68,
    requiredSkills: [],
    interestTags: ["文艺创作"],
    goalTags: ["放松娱乐", "人脉社交"],
    collaborationFit: ["大型团队配合", "都可以"],
    logo: "CH",
  },
  {
    id: "drama",
    name: "话剧社",
    category: "文艺表演",
    tags: ["表达训练", "每周5h", "需面试"],
    shortDescription: "会排短剧、做舞台和演出，适合想锻炼表达或喜欢舞台的人。",
    fullDescription: "平时除了排练演员部分，也会有人做道具、舞美和场务。不是每个人都一定上台，但整体比较吃团队配合，排戏前后会比较忙。",
    firstSemesterTasks: "新生前期一般会跟读本、做排练记录，或者去道具和场务组帮忙。",
    suitableFor: "适合喜欢表达、愿意投入排练时间、接受团队磨合的人。",
    notSuitableFor: "如果你很排斥当众表达，也不想参加排练，体验会一般。",
    timeCommitment: "5~8h",
    busyNote: "平时 4~5 小时，临近演出会更忙。",
    beginnerFriendly: "零基础可",
    interviewDifficulty: "常规面试",
    interviewFormat: "一般会有自我介绍、简单即兴和沟通你想做台前还是幕后。",
    growthAreas: ["表达能力", "舞台经验", "团队合作"],
    deadline: "2026-09-17",
    popularity: 72,
    requiredSkills: ["公众演讲"],
    interestTags: ["文艺创作", "演讲辩论"],
    goalTags: ["领导力锻炼", "人脉社交", "放松娱乐"],
    collaborationFit: ["小组讨论协作", "大型团队配合", "都可以"],
    logo: "DR",
  },
  {
    id: "basketball",
    name: "篮球社",
    category: "体育运动",
    tags: ["偏社交", "每周3h", "无需面试"],
    shortDescription: "平时以约球、训练和院赛为主，适合喜欢球场氛围的人。",
    fullDescription: "日常主要是固定时间打球、训练和组织友谊赛。不会像校队那样特别卷，但如果你想打比赛，还是得保证出勤和状态。",
    firstSemesterTasks: "新生一般先参加训练和新生友谊赛，熟悉大家后再看要不要进比赛组。",
    suitableFor: "适合喜欢运动、想靠打球交朋友的人。",
    notSuitableFor: "如果你时间很碎，或者不喜欢高强度运动，可能不太适合。",
    timeCommitment: "3~5h",
    busyNote: "平时 3 小时左右，比赛周会更忙。",
    beginnerFriendly: "零基础可",
    interviewDifficulty: "无需面试",
    interviewFormat: "基本没有正式面试，更多是看你是否愿意稳定参加。",
    growthAreas: ["体能", "团队配合", "社交圈"],
    deadline: "2026-09-22",
    popularity: 88,
    requiredSkills: ["运动竞技"],
    interestTags: ["体育运动"],
    goalTags: ["放松娱乐", "人脉社交"],
    collaborationFit: ["大型团队配合", "都可以"],
    logo: "BK",
  },
  {
    id: "badminton",
    name: "羽毛球协会",
    category: "体育运动",
    tags: ["零基础友好", "每周3h", "简单面试"],
    shortDescription: "平时会打球、做分组练习和组织比赛，门槛比想象中低。",
    fullDescription: "社里平时以约球和简单训练为主，也会组织校内小比赛。整体氛围轻松，不是所有人都冲成绩，比较适合想规律运动的人。",
    firstSemesterTasks: "新生通常先参加活动日和基础练习，再看要不要进提高组。",
    suitableFor: "适合想找一个能长期坚持的运动类社团的人。",
    notSuitableFor: "如果你不愿意出汗运动，或者作息和场地时间总冲突，就不太方便。",
    timeCommitment: "3~5h",
    busyNote: "平时每周 2~3 小时，比赛前会多打一两次。",
    beginnerFriendly: "零基础可",
    interviewDifficulty: "简单面试",
    interviewFormat: "一般是简单登记和看你有没有基础，不太卡人。",
    growthAreas: ["运动习惯", "社交", "比赛体验"],
    deadline: "2026-09-19",
    popularity: 70,
    requiredSkills: ["运动竞技"],
    interestTags: ["体育运动"],
    goalTags: ["放松娱乐", "人脉社交"],
    collaborationFit: ["都可以"],
    logo: "BD",
  },
  {
    id: "volunteer",
    name: "青年志愿者协会",
    category: "志愿公益",
    tags: ["零基础友好", "每周3h", "简单面试"],
    shortDescription: "主要做校园服务和社区活动，适合想做点实际事情的人。",
    fullDescription: "平时会组织志愿活动、社区服务和校内协助工作，节奏不算快，但需要你愿意按时到场、做事靠谱。适合想找稳定、有意义活动的人。",
    firstSemesterTasks: "新生一般先参加迎新志愿、校内活动协助和一次社区服务。",
    suitableFor: "适合愿意长期参与、做事踏实、想认识靠谱朋友的人。",
    notSuitableFor: "如果你只想挂名、不愿意到现场，后面可能留不下来。",
    timeCommitment: "3~5h",
    busyNote: "平时 2~3 小时，活动周会集中一些。",
    beginnerFriendly: "零基础可",
    interviewDifficulty: "简单面试",
    interviewFormat: "一般问你为什么想来、能不能稳定参加活动。",
    growthAreas: ["服务经验", "组织能力", "朋友关系"],
    deadline: "2026-09-16",
    popularity: 85,
    requiredSkills: [],
    interestTags: ["社会公益"],
    goalTags: ["人脉社交", "领导力锻炼"],
    collaborationFit: ["小组讨论协作", "大型团队配合", "都可以"],
    logo: "YG",
  },
  {
    id: "green",
    name: "绿色校园协会",
    category: "志愿公益",
    tags: ["项目活动", "每周1~2h", "无需面试"],
    shortDescription: "会做旧物回收、环保活动和倡议宣传，整体节奏比较轻。",
    fullDescription: "平时主要是做环保主题活动、旧物回收和简单宣传，事情不算多，但适合想参加一点有主题活动、又不想太忙的人。",
    firstSemesterTasks: "新生通常先跟一次活动执行，帮忙现场布置、宣传和登记。",
    suitableFor: "适合时间不多，但想参加一些有意义活动的人。",
    notSuitableFor: "如果你想要非常强的专业技能提升，这里可能没那么明显。",
    timeCommitment: "1~2h",
    busyNote: "平时比较轻，活动周会忙一点。",
    beginnerFriendly: "零基础可",
    interviewDifficulty: "无需面试",
    interviewFormat: "通常登记即可，重点看你有没有意愿参与活动。",
    growthAreas: ["活动参与", "公益体验", "轻社交"],
    deadline: "2026-09-25",
    popularity: 54,
    requiredSkills: [],
    interestTags: ["社会公益"],
    goalTags: ["放松娱乐", "人脉社交"],
    collaborationFit: ["都可以"],
    logo: "GC",
  },
  {
    id: "innovation",
    name: "创新创业协会",
    category: "创业实践",
    tags: ["比赛项目", "每周5h", "需面试"],
    shortDescription: "会做商业计划、路演和校赛项目，适合想练实战的人。",
    fullDescription: "平时会有讲座、项目讨论和比赛组队，如果你想尝试商业计划书、答辩和产品想法，这里会比较对口。但项目一多起来也会明显忙。",
    firstSemesterTasks: "新生一般会先参加训练营、听路演分享，再加入一个小项目组做分工。",
    suitableFor: "适合对商业、产品或比赛有兴趣，愿意主动推进事情的人。",
    notSuitableFor: "如果你不喜欢做展示、也不想参加比赛，会觉得社团节奏不适合。",
    timeCommitment: "5~8h",
    busyNote: "平时 4~5 小时，比赛前会更忙。",
    beginnerFriendly: "零基础可",
    interviewDifficulty: "常规面试",
    interviewFormat: "一般会问你对创业或比赛的看法，以及你能承担什么角色。",
    growthAreas: ["比赛经历", "表达能力", "项目思维"],
    deadline: "2026-09-14",
    popularity: 79,
    requiredSkills: ["公众演讲", "数据分析"],
    interestTags: ["商业分析", "科学研究"],
    goalTags: ["比赛经历", "领导力锻炼", "专业技能"],
    collaborationFit: ["小组讨论协作", "大型团队配合", "都可以"],
    logo: "IN",
  },
  {
    id: "business",
    name: "商赛俱乐部",
    category: "创业实践",
    tags: ["案例分析", "每周5h", "需面试"],
    shortDescription: "偏商赛和案例分析，适合想练分析、答辩和团队分工的人。",
    fullDescription: "平时会一起拆案例、写商业分析、做答辩 PPT，也会组队打一些校内外比赛。比较适合目标明确的人，不太像休闲型社团。",
    firstSemesterTasks: "新生通常先做案例练习，再跟一场校内比赛试试节奏。",
    suitableFor: "适合想拿比赛经历、练分析表达的人。",
    notSuitableFor: "如果你只是想轻松交朋友，可能会觉得它有点偏任务导向。",
    timeCommitment: "5~8h",
    busyNote: "平时 4 小时左右，备赛期会上涨。",
    beginnerFriendly: "有基础更适合",
    interviewDifficulty: "有一定难度",
    interviewFormat: "一般会看表达、逻辑和你过往是否做过类似内容。",
    growthAreas: ["商业分析", "比赛经历", "表达答辩"],
    deadline: "2026-09-13",
    popularity: 73,
    requiredSkills: ["数据分析", "公众演讲"],
    interestTags: ["商业分析", "演讲辩论"],
    goalTags: ["比赛经历", "专业技能", "领导力锻炼"],
    collaborationFit: ["小组讨论协作", "大型团队配合"],
    logo: "BC",
  },
  {
    id: "photo",
    name: "摄影社",
    category: "兴趣生活",
    tags: ["零基础友好", "每周1~2h", "无需面试"],
    shortDescription: "平时外拍、修图、拍活动，适合喜欢记录生活的人。",
    fullDescription: "社团平时会组织外拍、照片分享和活动跟拍，整体节奏轻松，不像媒体部门那样 deadline 很强。适合想找兴趣圈子的人。",
    firstSemesterTasks: "新生一般先参加外拍和看片分享，有相机没相机都能来。",
    suitableFor: "适合喜欢拍照、想认识同好、想轻松参与的人。",
    notSuitableFor: "如果你特别想要很强的履历或高强度训练，这里会偏松。",
    timeCommitment: "1~2h",
    busyNote: "平时不忙，活动时可能会多拍一次。",
    beginnerFriendly: "零基础可",
    interviewDifficulty: "无需面试",
    interviewFormat: "通常不设正式面试。",
    growthAreas: ["审美", "摄影技能", "朋友关系"],
    deadline: "2026-09-21",
    popularity: 83,
    requiredSkills: ["设计", "视频剪辑"],
    interestTags: ["视觉设计", "文艺创作"],
    goalTags: ["放松娱乐", "人脉社交", "专业技能"],
    collaborationFit: ["都可以"],
    logo: "PH",
  },
  {
    id: "media",
    name: "融媒体中心",
    category: "兴趣生活",
    tags: ["作品导向", "每周3h", "需面试"],
    shortDescription: "做推文、采访、拍摄和剪辑，适合想边做边积累作品的人。",
    fullDescription: "平时主要是选题、写稿、拍摄、剪视频和运营账号。事情比较实在，能留下作品，但 deadline 来了会忙，适合对内容表达确实有兴趣的人。",
    firstSemesterTasks: "新生一般会先跟一次采访或活动拍摄，再尝试写稿、排版或剪一条短视频。",
    suitableFor: "适合喜欢表达、愿意改稿、想做作品集的人。",
    notSuitableFor: "如果你不想改来改去，或者很抗拒 deadline，体验可能一般。",
    timeCommitment: "3~5h",
    busyNote: "平时 3 小时左右，活动密集时会更忙。",
    beginnerFriendly: "零基础可",
    interviewDifficulty: "常规面试",
    interviewFormat: "会看你对内容的兴趣、表达能力和能否稳定参加。",
    growthAreas: ["写作采访", "拍摄剪辑", "作品积累"],
    deadline: "2026-09-12",
    popularity: 92,
    requiredSkills: ["写作", "设计", "视频剪辑"],
    interestTags: ["视觉设计", "文艺创作", "演讲辩论"],
    goalTags: ["专业技能", "人脉社交"],
    collaborationFit: ["小组讨论协作", "大型团队配合", "都可以"],
    logo: "MC",
  },
];

const initialApplications: Application[] = [
  {
    id: "a1",
    clubId: "media",
    name: "林知夏",
    major: "数字媒体技术",
    grade: "大一",
    contact: "18812345678",
    strengths: "会基础摄影和剪映，愿意跟活动。",
    time: "3~5h",
    motivation: "我想通过真实校园内容练写作和拍摄，也想认识能一起做作品的同学。",
    status: "待审核",
    matchScore: 89,
    appliedAt: "2026-09-08",
  },
  {
    id: "a2",
    clubId: "acm",
    name: "周一鸣",
    major: "计算机科学与技术",
    grade: "大一",
    contact: "17600001111",
    strengths: "有 C++ 基础，愿意刷题和做项目。",
    time: "5~8h",
    motivation: "我想系统练编程，后面也想参加比赛。",
    status: "已通过",
    matchScore: 93,
    appliedAt: "2026-09-07",
  },
  {
    id: "a3",
    clubId: "volunteer",
    name: "陈雨菲",
    major: "社会学",
    grade: "大一",
    contact: "17700002222",
    strengths: "做事比较细，愿意参加活动。",
    time: "3~5h",
    motivation: "想在大学里参加一些真正能接触人的活动，也想认识靠谱的朋友。",
    status: "未通过",
    matchScore: 81,
    appliedAt: "2026-09-05",
  },
];

const clubImages: Record<string, string> = {
  acm: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  robot: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80",
  choir: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  drama: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80",
  basketball: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80",
  badminton: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
  volunteer: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  green: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
  innovation: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  business: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  photo: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=1200&q=80",
  media: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
};

const boothSpots = [
  { id: "acm", name: "ACM 编程社", category: "学术科技", x: "16%", y: "24%", boothNo: "A01", note: "算法 / 项目" },
  { id: "robot", name: "机器人协会", category: "学术科技", x: "31%", y: "20%", boothNo: "A02", note: "硬件 / 电控" },
  { id: "innovation", name: "创新创业协会", category: "创业实践", x: "47%", y: "24%", boothNo: "E01", note: "路演咨询" },
  { id: "business", name: "商赛俱乐部", category: "创业实践", x: "61%", y: "20%", boothNo: "E02", note: "案例分析" },
  { id: "choir", name: "合唱团", category: "文艺表演", x: "77%", y: "24%", boothNo: "B01", note: "现场试音" },
  { id: "drama", name: "话剧社", category: "文艺表演", x: "87%", y: "34%", boothNo: "B02", note: "台前 / 幕后" },
  { id: "basketball", name: "篮球社", category: "体育运动", x: "18%", y: "63%", boothNo: "C01", note: "训练报名" },
  { id: "badminton", name: "羽毛球协会", category: "体育运动", x: "33%", y: "72%", boothNo: "C02", note: "体验约球" },
  { id: "volunteer", name: "青年志愿者协会", category: "志愿公益", x: "57%", y: "58%", boothNo: "D01", note: "志愿服务" },
  { id: "green", name: "绿色校园协会", category: "志愿公益", x: "72%", y: "70%", boothNo: "D02", note: "环保活动" },
  { id: "photo", name: "摄影社", category: "兴趣生活", x: "48%", y: "74%", boothNo: "F01", note: "外拍招募" },
  { id: "media", name: "融媒体中心", category: "兴趣生活", x: "84%", y: "62%", boothNo: "F02", note: "采编 / 剪辑" },
] as const;

const mapLegend: Record<Category, string> = {
  学术科技: "bg-blue-600",
  文艺表演: "bg-purple-500",
  体育运动: "bg-emerald-500",
  志愿公益: "bg-amber-500",
  创业实践: "bg-rose-500",
  兴趣生活: "bg-slate-500",
};

const mapZoneStyles: Record<Category, string> = {
  学术科技: "border-blue-200 bg-blue-50/80 text-blue-700",
  文艺表演: "border-purple-200 bg-purple-50/80 text-purple-700",
  体育运动: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
  志愿公益: "border-amber-200 bg-amber-50/80 text-amber-700",
  创业实践: "border-rose-200 bg-rose-50/80 text-rose-700",
  兴趣生活: "border-slate-200 bg-slate-100/90 text-slate-700",
};

const getDeadlineText = (deadline: string) => {
  const date = new Date(deadline);
  return `截止 ${date.getMonth() + 1}月${date.getDate()}日`;
};

const getTimeScore = (answer: TimeOption | "", club: TimeOption) => {
  if (!answer) return 0;
  const map: Record<TimeOption, number> = {
    "1~2h": 1,
    "3~5h": 2,
    "5~8h": 3,
    "8h以上": 4,
  };
  const diff = Math.abs(map[answer] - map[club]);
  if (diff === 0) return 25;
  if (diff === 1) return 16;
  return 6;
};

const buildReasons = (club: Club, answer: SurveyAnswer) => {
  const reasons: string[] = [];
  const interestHits = answer.interests.filter((item) => club.interestTags.includes(item));
  const goalHits = answer.goals.filter((item) => club.goalTags.includes(item));
  const skillHits = answer.skills.filter((item) => club.requiredSkills.includes(item));

  if (interestHits.length > 0) {
    reasons.push(`你对${interestHits.join("、")}感兴趣，这个社团平时做的事情和你的方向基本对得上。`);
  }
  if (answer.time) {
    if (answer.time === club.timeCommitment) {
      reasons.push(`你每周能投入 ${answer.time}，和它的常规节奏比较匹配，不太容易中途跟不上。`);
    } else {
      reasons.push(`它大致是 ${club.timeCommitment} 的投入强度，和你现在的时间安排还算接近。`);
    }
  }
  if (goalHits.length > 0) {
    reasons.push(`如果你想要${goalHits.join("、")}这类收获，这个社团给到你的东西会比较直接。`);
  }
  if (skillHits.length > 0) {
    reasons.push(`你已经有${skillHits.join("、")}相关基础，进去之后上手会更快。`);
  } else if (club.beginnerFriendly === "零基础可") {
    reasons.push("它对新手比较友好，就算你现在基础一般，也能边做边学。");
  }
  if (reasons.length < 2) {
    reasons.push(`这个社团更适合${club.suitableFor}`);
  }
  return reasons.slice(0, 3);
};

const calculateMatches = (answer: SurveyAnswer, source: Club[]): MatchResult[] => {
  return source
    .map((club) => {
      const interestHits = answer.interests.filter((item) => club.interestTags.includes(item)).length;
      const goalHits = answer.goals.filter((item) => club.goalTags.includes(item)).length;
      const skillHits = answer.skills.filter((item) => club.requiredSkills.includes(item)).length;
      const collaborationHit =
        answer.collaboration && club.collaborationFit.includes(answer.collaboration) ? 1 : 0;

      const interestScore = Math.min(40, interestHits * 14);
      const timeScore = getTimeScore(answer.time, club.timeCommitment);
      const goalScore = Math.min(20, goalHits * 10);
      const skillScore = Math.min(15, skillHits * 8 + collaborationHit * 3);
      const score = Math.max(42, Math.min(98, interestScore + timeScore + goalScore + skillScore));

      return {
        clubId: club.id,
        score,
        reasons: buildReasons(club, answer),
      };
    })
    .sort((a, b) => b.score - a.score);
};

const App = () => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("mobile");
  const [activeTab, setActiveTab] = useState<TabKey>("square");
  const [activeView, setActiveView] = useState<ViewKey>("tabs");
  const [selectedClubId, setSelectedClubId] = useState<string>(clubs[0].id);
  const [selectedCategory, setSelectedCategory] = useState<"全部" | Category>("全部");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"hot" | "match" | "deadline">("hot");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [survey, setSurvey] = useState<SurveyAnswer>({
    interests: [],
    goals: [],
    time: "",
    collaboration: "",
    skills: [],
  });
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [adminClubId, setAdminClubId] = useState("media");
  const [applyForm, setApplyForm] = useState({
    name: "林知夏",
    major: "数字媒体技术",
    grade: "大一",
    contact: "18812345678",
    strengths: "",
    motivation: "",
    interests: [] as string[],
    time: "3~5h" as TimeOption,
  });

  const hasAssessment = survey.interests.length > 0 || survey.goals.length > 0 || Boolean(survey.time);
  const matches = useMemo(() => calculateMatches(survey, clubs), [survey]);
  const matchMap = useMemo(() => new Map(matches.map((item) => [item.clubId, item])), [matches]);
  const selectedClub = clubs.find((club) => club.id === selectedClubId) ?? clubs[0];
  const selectedMatch = matchMap.get(selectedClubId);
  const selectedClubImage = clubImages[selectedClubId] ?? clubImages.media;

  const filteredClubs = useMemo(() => {
    const keyword = search.trim();
    return clubs
      .filter((club) => {
        const byCategory = selectedCategory === "全部" || club.category === selectedCategory;
        const bySearch =
          !keyword ||
          club.name.includes(keyword) ||
          club.shortDescription.includes(keyword) ||
          club.tags.some((tag) => tag.includes(keyword));
        return byCategory && bySearch;
      })
      .sort((a, b) => {
        if (sortBy === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        if (sortBy === "match" && hasAssessment) {
          return (matchMap.get(b.id)?.score ?? 0) - (matchMap.get(a.id)?.score ?? 0);
        }
        return b.popularity - a.popularity;
      });
  }, [hasAssessment, matchMap, search, selectedCategory, sortBy]);

  const topMatches = matches.slice(0, 3).map((match) => ({
    club: clubs.find((club) => club.id === match.clubId)!,
    match,
  }));

  const adminApplications = applications
    .filter((item) => item.clubId === adminClubId)
    .sort((a, b) => b.matchScore - a.matchScore);

  const favoriteClubs = clubs.filter((club) => favorites.includes(club.id)).slice(0, 3);
  const compareClubs = clubs.filter((club) => favorites.includes(club.id));
  const compareReady = compareClubs.length >= 2;
  useEffect(() => {
    if (!compareReady) {
      setCompareOpen(false);
    }
  }, [compareReady]);

  const openDetail = (clubId: string) => {
    setSelectedClubId(clubId);
    setActiveView("detail");
  };

  const startApply = (clubId: string) => {
    setSelectedClubId(clubId);
    setApplyForm((current) => ({
      ...current,
      interests: survey.interests,
      time: survey.time || current.time,
      motivation: current.motivation,
    }));
    setActiveView("apply");
  };

  const toggleFavorite = (clubId: string) => {
    setFavorites((current) =>
      current.includes(clubId) ? current.filter((item) => item !== clubId) : [...current, clubId],
    );
  };

  const nextAfterAnswer = () => {
    if (questionIndex >= 4) {
      setActiveView("results");
      return;
    }
    setQuestionIndex((current) => current + 1);
  };

  const polishMotivation = () => {
    const text =
      applyForm.motivation ||
      `我想报名${selectedClub.name}，因为我对${(applyForm.interests[0] ?? "这个方向")}比较感兴趣，也希望在大学里通过稳定参与真正学到东西。结合我现在每周大概能投入 ${applyForm.time} 的时间，我想先从基础任务做起，慢慢熟悉社团的节奏。`;
    setApplyForm((current) => ({ ...current, motivation: text }));
  };

  const submitApplication = () => {
    const newItem: Application = {
      id: `new-${Date.now()}`,
      clubId: selectedClub.id,
      name: applyForm.name,
      major: applyForm.major,
      grade: applyForm.grade,
      contact: applyForm.contact,
      strengths: applyForm.strengths || "暂无补充",
      time: applyForm.time,
      motivation: applyForm.motivation,
      status: "待审核",
      matchScore: selectedMatch?.score ?? 76,
      appliedAt: "2026-09-09",
    };
    setApplications((current) => [newItem, ...current]);
    setActiveView("success");
  };

  const renderCampusMap = (expanded: boolean) => (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{expanded ? "校园导览地图" : "摆摊地图"}</h3>
        </div>
        <span className="text-xs text-slate-500">星月广场</span>
      </div>

      <div className={`mt-4 rounded-[28px] border border-slate-200 bg-[#edf4ea] p-3 ${expanded ? "shadow-inner" : ""}`}>
        <div className={`relative overflow-hidden rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#eef6eb_0%,#dbe9d7_100%)] ${expanded ? "h-[34rem]" : "h-[25rem]"}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.28),transparent_24%)]" />
          <div className="absolute left-[4%] top-[7%] h-[16%] w-[26%] rounded-[2rem] bg-[#cfe6bf] opacity-90" />
          <div className="absolute right-[6%] top-[9%] h-[14%] w-[20%] rounded-[2rem] bg-[#c8e3bf] opacity-90" />
          <div className="absolute left-[9%] bottom-[12%] h-[18%] w-[22%] rounded-[2rem] bg-[#cae3c1] opacity-90" />
          <div className="absolute right-[12%] bottom-[10%] h-[20%] w-[24%] rounded-[2rem] bg-[#c7dfb8] opacity-90" />
          <div className="absolute left-[38%] top-[15%] h-[17%] w-[17%] bg-[linear-gradient(180deg,#a8defe_0%,#74bff5_100%)] opacity-95 shadow-[0_0_0_8px_rgba(255,255,255,0.28)] [clip-path:polygon(14%_8%,38%_0%,70%_6%,92%_20%,100%_46%,92%_74%,76%_96%,40%_100%,18%_88%,0%_62%,4%_28%)]" />
          <div className="absolute left-[41.5%] top-[19.8%] h-[5%] w-[6%] rounded-full border border-white/50" />
          <div className="absolute left-[7%] right-[18%] top-[13%] h-5 rounded-full bg-[#d8d2c8] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
          <div className="absolute left-[10%] right-[21%] top-[14.7%] h-[2px] border-t border-dashed border-white/70" />
          <div className="absolute left-[18%] right-[7%] bottom-[14%] h-5 rounded-full bg-[#d8d2c8] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
          <div className="absolute bottom-[15.7%] left-[21%] right-[10%] h-[2px] border-t border-dashed border-white/70" />
          <div className="absolute left-[27%] top-[28%] h-5 w-[12%] rounded-full bg-[#d8d2c8] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
          <div className="absolute left-[30%] top-[29.7%] h-[2px] w-[6%] border-t border-dashed border-white/70" />
          <div className="absolute left-[57%] top-[31%] h-5 w-[16%] rounded-full bg-[#d8d2c8] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
          <div className="absolute left-[60%] top-[32.7%] h-[2px] w-[10%] border-t border-dashed border-white/70" />
          <div className="absolute left-[54%] top-[26.8%] h-8 w-16 rounded-full border-4 border-[#bda78c] bg-[#eadcc9] shadow-sm" />
          <div className="absolute left-[20%] top-[18%] h-[12%] w-[12%] rounded-lg border border-slate-300 bg-[#efe7d9] shadow-sm" />
          <div className="absolute right-[14%] top-[18%] h-[12%] w-[12%] rounded-lg border border-slate-300 bg-[#efe7d9] shadow-sm" />
          <div className="absolute right-[13%] bottom-[18%] h-[12%] w-[12%] rounded-lg border border-slate-300 bg-[#efe7d9] shadow-sm" />
          <div className="absolute left-[14%] bottom-[20%] h-[13%] w-[14%] rounded-xl border border-slate-300 bg-[#f1eadf] shadow-sm" />

          <div className={`absolute left-[10%] top-[21%] rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm ${expanded ? "" : "max-w-[96px]"}`}>北门</div>
          <div className={`absolute left-[23.5%] top-[31%] rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm ${expanded ? "" : "max-w-[96px]"}`}>理工楼</div>
          <div className={`absolute right-[12%] top-[31%] rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm ${expanded ? "" : "max-w-[96px]"}`}>教学楼 A</div>
          <div className={`absolute right-[10%] top-[42%] rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm ${expanded ? "" : "max-w-[110px]"}`}>学生中心</div>
          <div className={`absolute left-[44.5%] top-[36%] -translate-x-1/2 rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm ${expanded ? "" : "max-w-[96px]"}`}>镜心湖</div>
          <div className={`absolute left-[60%] top-[23%] rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm ${expanded ? "" : "max-w-[86px]"}`}>映水桥</div>
          <div className={`absolute left-[17%] bottom-[34%] rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm ${expanded ? "" : "max-w-[96px]"}`}>中心广场</div>
          <div className={`absolute right-[17%] bottom-[31%] rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm ${expanded ? "" : "max-w-[96px]"}`}>教学楼 B</div>
          <div className={`absolute left-1/2 bottom-[6.5%] -translate-x-1/2 rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm ${expanded ? "" : "max-w-[130px]"}`}>星月广场</div>

          {boothSpots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => openDetail(spot.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
              style={{ left: spot.x, top: spot.y }}
              title={spot.name}
            >
              <span className="flex flex-col items-center gap-1.5">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white/55 ${mapLegend[spot.category]}`}>
                  <MapPin className="size-4" />
                </span>
                <span className="rounded-xl bg-white/95 px-2 py-1.5 text-[10px] leading-4 text-slate-600 shadow-md ring-1 ring-slate-200">
                  <span className="block font-semibold text-slate-700">{spot.boothNo}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={`mt-4 ${expanded ? "grid gap-3 md:grid-cols-3" : "space-y-3"}`}>
        <div className={`${expanded ? "md:col-span-2" : ""}`}>
          <div className="flex flex-wrap gap-3">
            {(["学术科技", "文艺表演", "体育运动", "志愿公益", "创业实践", "兴趣生活"] as Category[]).map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                <span className={`h-2.5 w-2.5 rounded-full ${mapLegend[item]}`} />
                {item}
              </span>
            ))}
          </div>
          <div className={`mt-3 grid gap-2 ${expanded ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
            {boothSpots.map((spot) => (
              <button
                key={`${spot.id}-legend`}
                onClick={() => openDetail(spot.id)}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-left text-xs text-slate-600"
              >
                <span className="inline-flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${mapLegend[spot.category]}`} />
                  {spot.boothNo} {spot.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        {expanded ? (
          <div className="rounded-2xl bg-slate-50 p-4">
            <h4 className="text-sm font-semibold text-slate-900">地图说明</h4>
            <div className="mt-3 space-y-2 text-xs leading-6 text-slate-600">
              <p>地图只保留地标、主路和摊位代号，查看起来会更直观。</p>
              <p>点击地图上的代号点位，或下方摊位卡片，都可以直接进入社团详情。</p>
              <p>颜色仅用于区分社团类别，不再使用分区块说明。</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );

  const renderHeader = () => {
    if (activeView === "results") {
      return (
        <SubHeader
          title="为你推荐的社团"
          deviceMode={deviceMode}
          onChangeMode={setDeviceMode}
          onBack={() => {
            setActiveView("tabs");
            setActiveTab("assessment");
          }}
        />
      );
    }
    if (activeView === "detail") {
      return (
        <SubHeader
          title={selectedClub.name}
          deviceMode={deviceMode}
          onChangeMode={setDeviceMode}
          onBack={() => setActiveView("results")}
        />
      );
    }
    if (activeView === "apply") {
      return (
        <SubHeader
          title="提交报名"
          deviceMode={deviceMode}
          onChangeMode={setDeviceMode}
          onBack={() => setActiveView("detail")}
        />
      );
    }
    if (activeView === "success") {
      return (
        <SubHeader
          title="报名完成"
          deviceMode={deviceMode}
          onChangeMode={setDeviceMode}
          onBack={() => setActiveView("tabs")}
        />
      );
    }
    return (
      <header className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-semibold text-slate-900">社团招新智能匹配平台</h1>
          <ModeToggle mode={deviceMode} onChange={setDeviceMode} />
        </div>
      </header>
    );
  };

  const renderSquare = () => (
    <div className="space-y-4 pb-24">
      <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="搜索社团名称或关键词"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                  selectedCategory === item
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {item}
              </button>
              ))}
            </div>
          <button
            onClick={() => {
              setActiveView("tabs");
              setActiveTab("assessment");
            }}
            className="mt-3 inline-flex items-center rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200"
          >
            想查看你和社团的匹配度？点击下方「测评」按钮立即开始
          </button>
          <div className="mt-3 text-right text-xs text-slate-500">
            <button
              onClick={() => setSortBy("hot")}
              className={sortBy === "hot" ? "text-blue-600" : ""}
            >
              按热度
            </button>
            <span className="mx-2">|</span>
            <button
              onClick={() => setSortBy("match")}
              className={sortBy === "match" ? "text-blue-600" : ""}
            >
              按匹配度
            </button>
            <span className="mx-2">|</span>
            <button
              onClick={() => setSortBy("deadline")}
              className={sortBy === "deadline" ? "text-blue-600" : ""}
            >
              按截止时间
            </button>
          </div>
        </div>
      </section>

      {deviceMode === "desktop" ? renderCampusMap(true) : renderCampusMap(false)}

      <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">首页宣传图</h3>
            <p className="mt-1 text-sm text-slate-500">展示所有社团封面图，左右滑动即可快速浏览</p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-600">自动生成</span>
        </div>
        <div className="mt-4 overflow-x-auto pb-2">
          <div className={`flex gap-4 ${deviceMode === "desktop" ? "min-w-max" : "w-max"}`}>
            {filteredClubs.map((club) => (
            <button
              key={`poster-${club.id}`}
              onClick={() => openDetail(club.id)}
              className={`shrink-0 overflow-hidden rounded-2xl text-left shadow-sm ring-1 ring-slate-200 ${
                deviceMode === "desktop" ? "w-[30rem]" : "w-[18rem]"
              }`}
            >
              <div
                className={`relative bg-cover bg-center ${deviceMode === "desktop" ? "h-64" : "h-56"}`}
                style={{ backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.7)), url(${clubImages[club.id]})` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_30%)]" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
                  {club.category}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="text-xl font-semibold">{club.name}</div>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/90">{club.shortDescription}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {club.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
            ))}
          </div>
        </div>
      </section>

      <section className={`space-y-4 ${deviceMode === "desktop" ? "md:grid md:grid-cols-2 md:gap-4 md:space-y-0" : ""}`}>
        {filteredClubs.map((club) => (
          <button
            key={club.id}
            onClick={() => openDetail(club.id)}
            className="w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200"
          >
            <div
              className="relative h-36 rounded-2xl bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.06), rgba(15, 23, 42, 0.62)), url(${clubImages[club.id]})` }}
            >
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  toggleFavorite(club.id);
                }}
                className="absolute right-3 top-3 rounded-full bg-white/85 p-2 text-slate-500 backdrop-blur-sm"
              >
                <Heart
                  className={`size-4 ${favorites.includes(club.id) ? "fill-red-500 text-red-500" : ""}`}
                />
              </button>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="text-lg font-semibold">{club.name}</div>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/90">{club.shortDescription}</p>
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <div className="flex flex-wrap gap-2">
                {club.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                {hasAssessment ? (
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-600">
                    {matchMap.get(club.id)?.score ?? 0}分
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">{club.category}</span>
                )}
                <span className="text-xs text-slate-500">{getDeadlineText(club.deadline)}</span>
              </div>
            </div>
          </button>
        ))}
      </section>
    </div>
  );

  const renderAssessment = () => {
    if (!assessmentStarted) {
      return (
        <div className="px-4 py-6">
          <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <BrainCircuit className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">AI 兴趣测评</h2>
                <p className="mt-1 text-sm text-slate-500">回答 5 个问题，帮你找到最适合的社团</p>
              </div>
            </div>
            <button
              onClick={() => {
                setAssessmentStarted(true);
                setQuestionIndex(0);
              }}
              className="mt-6 w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-medium text-white"
            >
              开始测评
            </button>
          </section>
        </div>
      );
    }

    return (
      <div className="px-4 py-6 pb-24">
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setQuestionIndex(index)}
                className={questionIndex === index ? "text-blue-600" : ""}
              >
                {index + 1}/5
              </button>
            ))}
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-200"
              style={{ width: `${((questionIndex + 1) / 5) * 100}%` }}
            />
          </div>
        </div>

        {questionIndex === 0 && (
          <QuestionCard title="你对哪些方向感兴趣？" subtitle="最多选 3 个">
            <OptionGrid
              options={interestOptions}
              selected={survey.interests}
              onSelect={(value) => {
                const next = toggleList(survey.interests, value, 3);
                setSurvey((current) => ({ ...current, interests: next }));
                if (next.length >= 3) {
                  setTimeout(nextAfterAnswer, 180);
                }
              }}
            />
            <QuestionActions
              canPrev={questionIndex > 0}
              canNext={survey.interests.length > 0}
              onPrev={() => setQuestionIndex((current) => Math.max(0, current - 1))}
              onNext={nextAfterAnswer}
            />
          </QuestionCard>
        )}

        {questionIndex === 1 && (
          <QuestionCard title="你加入社团最想获得什么？" subtitle="最多选 2 个">
            <OptionGrid
              options={goalOptions}
              selected={survey.goals}
              onSelect={(value) => {
                const next = toggleList(survey.goals, value, 2);
                setSurvey((current) => ({ ...current, goals: next }));
                if (next.length >= 2) {
                  setTimeout(nextAfterAnswer, 180);
                }
              }}
            />
            <QuestionActions
              canPrev
              canNext={survey.goals.length > 0}
              onPrev={() => setQuestionIndex((current) => Math.max(0, current - 1))}
              onNext={nextAfterAnswer}
            />
          </QuestionCard>
        )}

        {questionIndex === 2 && (
          <QuestionCard title="每周你能投入多少时间？">
            <OptionGrid
              options={timeOptions}
              selected={survey.time ? [survey.time] : []}
              onSelect={(value) => {
                setSurvey((current) => ({ ...current, time: value as TimeOption }));
                setTimeout(nextAfterAnswer, 180);
              }}
            />
            <QuestionActions
              canPrev
              canNext={Boolean(survey.time)}
              onPrev={() => setQuestionIndex((current) => Math.max(0, current - 1))}
              onNext={nextAfterAnswer}
            />
          </QuestionCard>
        )}

        {questionIndex === 3 && (
          <QuestionCard title="你更喜欢哪种协作方式？">
            <OptionGrid
              options={collaborationOptions}
              selected={survey.collaboration ? [survey.collaboration] : []}
              onSelect={(value) => {
                setSurvey((current) => ({ ...current, collaboration: value }));
                setTimeout(nextAfterAnswer, 180);
              }}
            />
            <QuestionActions
              canPrev
              canNext={Boolean(survey.collaboration)}
              onPrev={() => setQuestionIndex((current) => Math.max(0, current - 1))}
              onNext={nextAfterAnswer}
            />
          </QuestionCard>
        )}

        {questionIndex === 4 && (
          <QuestionCard title="你在以下方面有基础吗？" subtitle="可不选">
            <OptionGrid
              options={skillOptions}
              selected={survey.skills}
              onSelect={(value) => {
                const next = toggleList(survey.skills, value, 7);
                setSurvey((current) => ({ ...current, skills: next }));
              }}
            />
            <QuestionActions
              canPrev
              canNext
              onPrev={() => setQuestionIndex((current) => Math.max(0, current - 1))}
              onNext={nextAfterAnswer}
            />
          </QuestionCard>
        )}
      </div>
    );
  };

  const renderResults = () => (
    <div className="px-4 py-6 pb-24">
      <div className="space-y-4">
        {topMatches.map(({ club, match }) => (
          <section key={club.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-amber-100 text-lg font-semibold text-amber-600">
                {match.score}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900">{club.name}</h3>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-600">
                    {club.category}
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {match.reasons.map((reason) => (
                    <p key={reason}>{reason}</p>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
                  <span>⏱ {club.timeCommitment}</span>
                  <span>✅ {club.beginnerFriendly}</span>
                  <span>📋 {club.interviewDifficulty}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => openDetail(club.id)}
              className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-medium text-white"
            >
              查看详情
            </button>
          </section>
        ))}
      </div>
      <button
        onClick={() => {
          setAssessmentStarted(false);
          setQuestionIndex(0);
          setActiveView("tabs");
          setActiveTab("assessment");
        }}
        className="mt-5 text-sm text-blue-600"
      >
        不满意？重新测评
      </button>
    </div>
  );

  const renderDetail = () => (
    <div className="pb-28">
      <div className="bg-white shadow-sm ring-1 ring-slate-200">
        <div
          className="h-44 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${selectedClubImage})` }}
        />
        <div className="px-4 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{selectedClub.name}</h2>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span>{selectedClub.category}</span>
                <span>·</span>
                <span>{selectedMatch?.score ?? 0} 分匹配</span>
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
              {selectedClub.logo}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        <DetailBlock question="这个社团平时做什么？" answer={selectedClub.fullDescription} />
        <DetailBlock question="新生第一学期一般负责什么？" answer={selectedClub.firstSemesterTasks} />
        <DetailBlock
          question="需要什么基础吗？"
          answer={
            selectedClub.beginnerFriendly === "零基础可"
              ? "不需要硬性基础，愿意学、愿意做事就能进。"
              : `建议有一点${selectedClub.requiredSkills.join("、")}基础，上手会更顺。`
          }
        />
        <DetailBlock
          question="忙不忙？每周大概花多少时间？"
          answer={`${selectedClub.busyNote}`}
        />
        <DetailBlock
          question="什么样的人更适合？"
          answer={`${selectedClub.suitableFor}${selectedClub.notSuitableFor ? ` 不太适合：${selectedClub.notSuitableFor}` : ""}`}
        />
        <DetailBlock
          question="面试是什么形式？难吗？"
          answer={`${selectedClub.interviewFormat} 难度大致是：${selectedClub.interviewDifficulty}。`}
        />
        <DetailBlock question="能收获什么？" answer={selectedClub.growthAreas.join("、")} />
      </div>

      <div className="fixed inset-x-0 bottom-16 border-t border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            onClick={() => toggleFavorite(selectedClub.id)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200"
          >
            <Heart
              className={`size-5 ${favorites.includes(selectedClub.id) ? "fill-red-500 text-red-500" : "text-slate-500"}`}
            />
          </button>
          <button
            onClick={() => startApply(selectedClub.id)}
            disabled={new Date(selectedClub.deadline).getTime() < new Date("2026-09-09").getTime()}
            className="flex-1 rounded-lg bg-amber-500 px-4 py-3 text-sm font-medium text-white disabled:bg-slate-300"
          >
            {new Date(selectedClub.deadline).getTime() < new Date("2026-09-09").getTime()
              ? "报名已截止"
              : "立即报名"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderApply = () => (
    <div className="px-4 py-6 pb-24">
      <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <Field label="姓名" required>
          <input
            value={applyForm.name}
            onChange={(event) => setApplyForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
          />
        </Field>
        <Field label="学院 / 专业" required>
          <input
            value={applyForm.major}
            onChange={(event) => setApplyForm((current) => ({ ...current, major: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
          />
        </Field>
        <Field label="年级" required>
          <select
            value={applyForm.grade}
            onChange={(event) => setApplyForm((current) => ({ ...current, grade: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
          >
            {["大一", "大二", "大三", "研一"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="联系方式" required>
          <input
            value={applyForm.contact}
            onChange={(event) => setApplyForm((current) => ({ ...current, contact: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
          />
        </Field>
        <Field label="你的兴趣方向">
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((item) => (
              <button
                key={item}
                onClick={() =>
                  setApplyForm((current) => ({
                    ...current,
                    interests: toggleList(current.interests, item, 3),
                  }))
                }
                className={`rounded-full px-3 py-1.5 text-xs ${
                  applyForm.interests.includes(item)
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </Field>
        <Field label="个人优势">
          <textarea
            value={applyForm.strengths}
            onChange={(event) => setApplyForm((current) => ({ ...current, strengths: event.target.value }))}
            placeholder="简单描述你的特长或相关经历"
            className="h-24 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
          />
        </Field>
        <Field label="每周可投入时间">
          <div className="grid grid-cols-2 gap-2">
            {timeOptions.map((item) => (
              <button
                key={item}
                onClick={() => setApplyForm((current) => ({ ...current, time: item }))}
                className={`rounded-lg px-3 py-2 text-sm ${
                  applyForm.time === item
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </Field>
        <Field label="想加入的原因" required>
          <div className="space-y-2">
            <div className="flex justify-end">
              <button onClick={polishMotivation} className="text-xs text-blue-600">
                AI 帮我润色
              </button>
            </div>
            <textarea
              value={applyForm.motivation}
              onChange={(event) => setApplyForm((current) => ({ ...current, motivation: event.target.value }))}
              className="h-28 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </Field>
        <button
          onClick={submitApplication}
          className="w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-medium text-white"
        >
          提交报名
        </button>
      </section>
    </div>
  );

  const renderSuccess = () => (
    <div className="px-4 py-10">
      <section className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Check className="size-6" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-slate-900">报名已提交！</h2>
        <p className="mt-2 text-sm text-slate-500">可在「我的」页面查看进度</p>
        <button
          onClick={() => {
            setActiveView("tabs");
            setActiveTab("square");
          }}
          className="mt-5 text-sm text-blue-600"
        >
          返回广场
        </button>
      </section>
    </div>
  );

  const renderMine = () => (
    <div className="space-y-4 px-4 py-6 pb-24">
      <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-base font-semibold text-slate-900">报名记录</h2>
        <div className="mt-3 space-y-3">
          {applications.map((item) => {
            const club = clubs.find((clubItem) => clubItem.id === item.clubId);
            return (
              <div key={item.id} className="rounded-lg bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{club?.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.appliedAt}</div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.status === "待审核"
                        ? "bg-slate-200 text-slate-700"
                        : item.status === "已通过"
                          ? "bg-green-100 text-green-600"
                          : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-600">匹配分数 {item.matchScore}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-base font-semibold text-slate-900">我的兴趣画像</h2>
        {hasAssessment ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {[...survey.interests, ...survey.goals, survey.time, survey.collaboration]
              .filter(Boolean)
              .map((item) => (
                <span key={item} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs text-blue-600">
                  {item}
                </span>
              ))}
          </div>
        ) : (
          <button
            onClick={() => {
              setActiveTab("assessment");
              setAssessmentStarted(false);
            }}
            className="mt-3 text-sm text-blue-600"
          >
            还没做测评？去发现适合你的社团 →
          </button>
        )}
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-base font-semibold text-slate-900">收藏列表</h2>
        <div className="mt-3 space-y-3">
          {favoriteClubs.map((club) => (
            <button
              key={club.id}
              onClick={() => openDetail(club.id)}
              className="flex w-full items-center gap-3 rounded-lg bg-slate-50 p-3 text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-200 text-xs font-semibold text-slate-600">
                {club.logo}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-900">{club.name}</div>
                <div className="mt-1 truncate text-xs text-slate-500">{club.shortDescription}</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const renderManage = () => (
    <div className="px-4 py-6 pb-24">
      <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">报名管理</h2>
          <select
            value={adminClubId}
            onChange={(event) => setAdminClubId(event.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
          >
            {["media", "acm", "volunteer"].map((id) => {
              const club = clubs.find((item) => item.id === id);
              return (
                <option key={id} value={id}>
                  {club?.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-3 py-3 font-medium">姓名</th>
                <th className="px-3 py-3 font-medium">专业</th>
                <th className="px-3 py-3 font-medium">匹配分数</th>
                <th className="px-3 py-3 font-medium">个人优势</th>
                <th className="px-3 py-3 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {adminApplications.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-3 py-3 text-slate-900">{item.name}</td>
                  <td className="px-3 py-3 text-slate-600">{item.major}</td>
                  <td className="px-3 py-3 text-slate-900">{item.matchScore}</td>
                  <td className="px-3 py-3 text-slate-600">{item.strengths}</td>
                  <td className="px-3 py-3">
                    <select
                      value={item.status}
                      onChange={(event) =>
                        setApplications((current) =>
                          current.map((row) =>
                            row.id === item.id ? { ...row, status: event.target.value as ApplicationStatus } : row,
                          ),
                        )
                      }
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none"
                    >
                      {["待审核", "已通过", "未通过"].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const renderTabContent = () => {
    if (activeView === "results") return renderResults();
    if (activeView === "detail") return renderDetail();
    if (activeView === "apply") return renderApply();
    if (activeView === "success") return renderSuccess();

    if (activeTab === "square") return renderSquare();
    if (activeTab === "assessment") return renderAssessment();
    if (activeTab === "mine") return renderMine();
    return renderManage();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className={`mx-auto bg-slate-50 ${deviceMode === "desktop" ? "max-w-6xl" : "max-w-md"}`}>
        {renderHeader()}
        <main className="min-h-[calc(100vh-120px)]">{renderTabContent()}</main>

        {activeView === "tabs" && compareReady && activeTab === "square" && (
          <div className={`fixed bottom-16 left-1/2 z-20 w-full -translate-x-1/2 px-4 ${deviceMode === "desktop" ? "max-w-6xl" : "max-w-md"}`}>
            <button
              onClick={() => setCompareOpen(true)}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg"
            >
              已选择{compareClubs.length}个社团，开始对比
            </button>
          </div>
        )}

        <nav className={`fixed bottom-0 left-1/2 z-30 flex w-full -translate-x-1/2 border-t border-slate-200 bg-white ${deviceMode === "desktop" ? "max-w-6xl" : "max-w-md"}`}>
          <TabButton
            active={activeView === "tabs" && activeTab === "square"}
            label="广场"
            icon={<Home className="size-5" />}
            onClick={() => {
              setActiveView("tabs");
              setActiveTab("square");
            }}
          />
          <TabButton
            active={activeView === "tabs" && activeTab === "assessment"}
            label="测评"
            icon={<BrainCircuit className="size-5" />}
            highlight
            onClick={() => {
              setActiveView("tabs");
              setActiveTab("assessment");
            }}
          />
          <TabButton
            active={activeView === "tabs" && activeTab === "mine"}
            label="我的"
            icon={<User className="size-5" />}
            onClick={() => {
              setActiveView("tabs");
              setActiveTab("mine");
            }}
          />
          <TabButton
            active={activeView === "tabs" && activeTab === "manage"}
            label="管理"
            icon={<Settings2 className="size-5" />}
            onClick={() => {
              setActiveView("tabs");
              setActiveTab("manage");
            }}
          />
        </nav>

        {compareOpen && compareReady && (
          <div className="fixed inset-0 z-40 bg-black/30">
            <div className={`absolute bottom-0 left-1/2 w-full -translate-x-1/2 rounded-t-2xl bg-white p-4 ${deviceMode === "desktop" ? "max-w-4xl" : "max-w-md"}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">社团对比</h3>
                <button onClick={() => setCompareOpen(false)} className="text-sm text-slate-500">
                  关闭
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-slate-500">
                    <tr>
                      <th className="px-2 py-2 font-medium">维度</th>
                      {compareClubs.map((club) => (
                        <th key={club.id} className="px-2 py-2 font-medium">
                          {club.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <CompareTableRow label="时间投入" values={compareClubs.map((club) => club.timeCommitment)} />
                    <CompareTableRow label="零基础友好" values={compareClubs.map((club) => club.beginnerFriendly)} />
                    <CompareTableRow label="面试难度" values={compareClubs.map((club) => club.interviewDifficulty)} />
                    <CompareTableRow label="适合人群" values={compareClubs.map((club) => club.suitableFor)} />
                    <CompareTableRow label="成长收获" values={compareClubs.map((club) => club.growthAreas.join("、"))} />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const toggleList = (source: string[], value: string, limit: number) => {
  if (source.includes(value)) return source.filter((item) => item !== value);
  return [...source, value].slice(-limit);
};

const SubHeader = ({
  title,
  onBack,
  deviceMode,
  onChangeMode,
}: {
  title: string;
  onBack: () => void;
  deviceMode: DeviceMode;
  onChangeMode: (mode: DeviceMode) => void;
}) => (
  <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-4">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="rounded-lg p-1 text-slate-600">
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>
      <ModeToggle mode={deviceMode} onChange={onChangeMode} />
    </div>
  </header>
);

const QuestionCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-all duration-200">
    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
    <div className="mt-4">{children}</div>
  </section>
);

const OptionGrid = ({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string[];
  onSelect: (value: string) => void;
}) => (
  <div className="grid grid-cols-2 gap-2">
    {options.map((option) => (
      <button
        key={option}
        onClick={() => onSelect(option)}
        className={`rounded-lg px-3 py-3 text-sm ${
          selected.includes(option)
            ? "bg-blue-600 text-white"
            : "border border-slate-200 bg-white text-slate-700"
        }`}
      >
        {option}
      </button>
    ))}
  </div>
);

const QuestionActions = ({
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <div className="mt-4 flex gap-3">
    <button
      onClick={onPrev}
      disabled={!canPrev}
      className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 disabled:text-slate-300"
    >
      上一题
    </button>
    <button
      onClick={onNext}
      disabled={!canNext}
      className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white disabled:bg-amber-200"
    >
      下一题
    </button>
  </div>
);

const DetailBlock = ({ question, answer }: { question: string; answer: string }) => (
  <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
    <h3 className="text-sm font-semibold text-slate-900">{question}</h3>
    <p className="mt-2 text-sm leading-7 text-slate-600">{answer}</p>
  </section>
);

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="block">
    <div className="mb-2 text-sm font-medium text-slate-900">
      {label}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </div>
    {children}
  </label>
);

const TabButton = ({
  active,
  label,
  icon,
  highlight,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`m-1 flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs transition-all ${
      highlight
        ? "bg-violet-600 text-white shadow-md shadow-violet-200"
        : active
          ? "text-blue-600"
          : "text-slate-500"
    }`}
  >
    {icon}
    {label}
  </button>
);

const CompareTableRow = ({ label, values }: { label: string; values: string[] }) => (
  <tr className="border-t border-slate-200">
    <td className="px-2 py-3 align-top text-xs text-slate-500">{label}</td>
    {values.map((value, index) => (
      <td key={`${label}-${index}`} className="px-2 py-3 text-xs leading-6 text-slate-700">
        {value}
      </td>
    ))}
  </tr>
);

const ModeToggle = ({
  mode,
  onChange,
}: {
  mode: DeviceMode;
  onChange: (mode: DeviceMode) => void;
}) => (
  <div className="flex rounded-lg bg-slate-100 p-1">
    <button
      onClick={() => onChange("mobile")}
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs ${
        mode === "mobile" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
      }`}
    >
      <Smartphone className="size-3.5" />
      手机版
    </button>
    <button
      onClick={() => onChange("desktop")}
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs ${
        mode === "desktop" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
      }`}
    >
      <Monitor className="size-3.5" />
      电脑版
    </button>
  </div>
);

export default App;
