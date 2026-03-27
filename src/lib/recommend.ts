import { Club, MatchResult, SurveyResult } from "../types";

const timeValueMap = {
  低: 2,
  中: 5,
  高: 8,
};

const levelLabel = (value: number) => {
  if (value <= 3) return "低投入";
  if (value <= 6) return "中等投入";
  return "高投入";
};

export const calculateMatches = (survey: SurveyResult, clubs: Club[]): MatchResult[] => {
  return clubs
    .map((club) => {
      let score = 18;
      const reasons: string[] = [];
      let interestScore = 0;
      let goalScore = 0;
      let skillScore = 0;
      let personalityScore = 0;

      const interestHits = survey.interests.filter((interest) =>
        club.desiredInterests.includes(interest),
      );
      interestScore = interestHits.length * 18;
      score += interestScore;
      if (interestHits.length > 0) {
        reasons.push(`如果你确实喜欢${interestHits.join("、")}这类事，${club.name}会比纯看名字更适合你。`);
      }

      const timeGap = Math.abs(survey.availableTime - timeValueMap[club.timeCommitment]);
      const timeScore = Math.max(0, 22 - timeGap * 4);
      score += timeScore;
      if (timeGap <= 1) {
        reasons.push(
          `你现在每周能拿出 ${survey.availableTime} 小时，和这个社团的日常节奏基本对得上。`,
        );
      } else if (survey.availableTime < timeValueMap[club.timeCommitment]) {
        reasons.push(`这个社团不算轻松，如果你这学期时间比较紧，报之前最好想清楚能不能稳定参加。`);
      } else {
        reasons.push(`你的时间还算够，用来参加 ${club.name} 会比较从容，不容易半路跟不上。`);
      }

      const goalHits = survey.goals.filter((goal) => club.desiredGoals.includes(goal));
      goalScore = goalHits.length * 6;
      score += goalScore;
      if (goalHits.length > 0) {
        reasons.push(`你现在更想要${goalHits.join("、")}；从结果看，这个社团给你的回报会比较对路。`);
      }

      const skillHits = survey.skills.filter(
        (skill) => club.requiredSkills.includes(skill) || club.growthAreas.includes(skill),
      );
      skillScore = skillHits.length * 5;
      score += skillScore;
      if (skillHits.length > 0) {
        reasons.push(`你已经有${skillHits.join("、")}这类基础，进去以后上手会更快，不容易一开始就掉队。`);
      } else if (club.beginnerFriendly === "高") {
        reasons.push(`它对新手还算友好，就算现在基础一般，也可以边做边学。`);
      }

      if (club.personalityFit.sociability.includes(survey.personality.sociability)) {
        personalityScore += 6;
      }
      if (club.personalityFit.workingStyle.includes(survey.personality.workingStyle)) {
        personalityScore += 6;
      }
      if (club.personalityFit.collaboration.includes(survey.personality.collaboration)) {
        personalityScore += 5;
      }
      score += personalityScore;

      const profileSummary = `你更像一位${levelLabel(survey.availableTime)}、${survey.personality.collaboration === "团队协作" ? "强协作" : survey.personality.collaboration === "独立推进" ? "偏独立" : "平衡型"}、以${survey.goals[0] ?? "探索兴趣"}为导向的新生。`;

      return {
        clubId: club.id,
        score: Math.min(100, Math.round(score)),
        reasons: reasons.slice(0, 4),
        profileSummary,
        breakdown: {
          interest: Math.min(40, interestScore),
          time: Math.min(22, timeScore),
          goals: Math.min(18, goalScore),
          skills: Math.min(15, skillScore),
          personality: Math.min(17, personalityScore),
        },
      };
    })
    .sort((a, b) => b.score - a.score);
};

export const compareClubSimilarity = (source: Club, clubs: Club[]): Club[] => {
  return clubs
    .filter((club) => club.id !== source.id)
    .map((club) => {
      const sharedTags = club.tags.filter((tag) => source.tags.includes(tag)).length;
      const sharedGrowth = club.growthAreas.filter((area) => source.growthAreas.includes(area)).length;
      const score = sharedTags * 3 + sharedGrowth * 4 + (club.category === source.category ? 5 : 0);
      return { club, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.club);
};

export const polishMotivation = (clubName: string, survey: SurveyResult) => {
  const interestText = survey.interests.slice(0, 2).join("和");
  const goalText = survey.goals.slice(0, 2).join("、");
  return `我想加入${clubName}，因为我对${interestText}一直很有兴趣，也希望在大学里通过真实项目持续${goalText}。结合自己目前每周可投入约 ${survey.availableTime} 小时的时间安排，我希望在保证学业节奏的前提下稳定参与，并在团队协作中把自己的${survey.skills.join("、")}逐步用起来。`;
};
