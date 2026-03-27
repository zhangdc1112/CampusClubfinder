export type Category =
  | "文艺类"
  | "体育类"
  | "志愿服务类"
  | "学术科技类"
  | "媒体宣传类"
  | "学生组织类"
  | "创新创业类"
  | "心理成长类";

export type Level = "低" | "中" | "高";
export type ClubStatus = "招新中" | "即将截止" | "已截止";
export type ApplicationStatus = "已提交" | "待筛选" | "待面试" | "已录取" | "未通过";

export type PersonalityProfile = {
  sociability: "外向" | "均衡" | "内向";
  workingStyle: "执行型" | "平衡型" | "创意型";
  collaboration: "团队协作" | "均衡型" | "独立推进";
};

export type SurveyResult = {
  interests: string[];
  personality: PersonalityProfile;
  availableTime: number;
  goals: string[];
  skills: string[];
};

export type Club = {
  id: string;
  name: string;
  category: Category;
  tags: string[];
  shortDescription: string;
  fullDescription: string;
  dailyWork: string[];
  firstSemesterTasks: string[];
  activityHighlights: string[];
  suitableFor: string[];
  notSuitableFor: string[];
  timeCommitment: Level;
  beginnerFriendly: Level;
  interviewDifficulty: Level;
  socialLevel: Level;
  growthAreas: string[];
  deadline: string;
  status: ClubStatus;
  popularity: number;
  requiredSkills: string[];
  desiredInterests: string[];
  desiredGoals: string[];
  personalityFit: {
    sociability: Array<PersonalityProfile["sociability"]>;
    workingStyle: Array<PersonalityProfile["workingStyle"]>;
    collaboration: Array<PersonalityProfile["collaboration"]>;
  };
  image: string;
};

export type MatchResult = {
  clubId: string;
  score: number;
  reasons: string[];
  profileSummary: string;
  breakdown: {
    interest: number;
    time: number;
    goals: number;
    skills: number;
    personality: number;
  };
};

export type Application = {
  id: string;
  clubId: string;
  applicantName: string;
  major: string;
  grade: string;
  contact: string;
  interests: string;
  strengths: string;
  availableTime: string;
  motivation: string;
  applicationStatus: ApplicationStatus;
  matchScore: number;
};
