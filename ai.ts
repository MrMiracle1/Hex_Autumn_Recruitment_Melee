
import { GoogleGenAI, Type } from "@google/genai";
import { Tier, GameItem, FinalOutcome } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instructions for tone and style
const SYSTEM_INSTRUCTION = `
You are the "Hextech Destiny Engine", a narrator for a career simulation game.
Your goal is to generate short, dramatic "Destiny Events" that act as the CAUSE for the player's current luck/tier.
Tone: Witty, cynical, internet slang friendly (meme-heavy), sometimes grandiose.
IMPORTANT: ALL OUTPUT MUST BE IN SIMPLIFIED CHINESE.
`;

/**
 * Generate a narrative event based on context
 */
export const generateEventNarrative = async (
  round: number, 
  tier: Tier, 
  inventory: GameItem[]
): Promise<string> => {
  const context = inventory.map(i => `${i.type}: ${i.name}`).join(', ');
  
  let scenario = "";
  if (round === 1) {
    scenario = "场景：高中时期或高考前夕。请描述一个具体事件，该事件直接导致了高考分数的层级（例如：忘带准考证、获得奥赛金牌、发挥失常、超常发挥等）。不要提到具体的学校名字。";
  } else if (round === 2) {
    scenario = "场景：填报志愿或大学分流时期。请描述一个具体事件，解释为什么会进入该层级的专业（例如：被调剂了、发现了冷门宝藏、随波逐流、坚定梦想等）。";
  } else if (round === 3) {
    scenario = "场景：大学期间寻找实习。请描述一个具体事件，解释为什么能获得（或无法获得）好的实习机会（例如：简历被挂、导师内推、面试官是学长、行业寒冬等）。";
  } else if (round === 4) {
    scenario = "场景：秋招/毕业求职季。请描述一个具体事件，解释为什么最终的岗位选择是这样的（例如：大厂锁HC、技术栈过时、并在面试中秒杀全场、因为不想加班所以拒绝了offer等）。";
  }

  const prompt = `
    Round: ${round}. Target Tier: ${tier}.
    Current Resume: [${context}].
    ${scenario}
    
    Task: Write a SINGLE, short, specific event (the CAUSE) that results in the player having ${tier} luck in this round.
    
    Tier Logic:
    - ${Tier.SILVER}: Bad luck, mistakes, tragedy, or "society beating you up". (e.g. "高考前夜发高烧", "投了一百份简历石沉大海", "被调剂到了天坑专业")
    - ${Tier.GOLD}: Standard success, effort paid off, or reliable path. (e.g. "发挥稳定", "绩点名列前茅", "面试对答如流")
    - ${Tier.PRISMATIC}: Miraculous luck, genius moment, or historical windfalls. (e.g. "保送清北", "发布的开源项目爆火", "面试官竟然是失散多年的亲戚")

    Constraint: 
    - STRICTLY describe the EVENT, not the result. 
    - Use Chinese Internet slang if appropriate (e.g. 删库跑路, 天选打工人).
    - Max 30 words.
    
    Output specific sentence in Simplified Chinese.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.1, 
      }
    });
    return response.text || "命运的齿轮开始转动...";
  } catch (e) {
    console.error("AI Event Error:", e);
    return "虚空之中传来一阵波动，命运似乎发生了改变...";
  }
};

/**
 * Generate Final Outcome (AI Generated)
 */
export const generateFinalOutcome = async (inventory: GameItem[]): Promise<FinalOutcome> => {
  const context = inventory.map(i => `[${i.tier}] ${i.type}: ${i.name}`).join('\n');
  const prompt = `
    Analyze this career path and determine the final job offer outcome.
    Resume History:
    ${context}

    CRITICAL INSTRUCTION:
    1. The first 3 items are FACTS (School, Major, Internship) that the user HAS.
    2. The 4th item is the TARGET JOB APPLICATION (The user APPLIED for this). It is **NOT** guaranteed.
    
    Logic to determine Success/Failure:
    - Compare the Resume Strength (School Tier + Internship Tier) vs Target Job Tier.
    - If Resume is WEAK (e.g. Silver School/Internship) but Target Job is PRISMATIC (e.g. Algo Engineer/Fund Manager): The user likely FAILS the application. They should settle for a low-tier job or unemployment.
    - If Resume is STRONG (Prismatic/Gold): The user likely SUCCEEDS or gets an even better offer.
    - Check Major match. If Major is irrelevant to Job (e.g. History Major applying for Algo), failure is highly likely unless Internship is very strong.

    Output Requirements:
    - Company: The actual company they end up at (could be the target, or a random bad company if failed).
    - Position: The final role they actually got.
    - Salary: Annual package in CNY. **MUST USE "万" AS UNIT** (e.g. "35万", "15-20万", "8万").
    - Desc: Narrative explaining the result (e.g. "You aimed for Google but your resume was filtered, so you are now delivering food." or "Your clear goal led to success.").
    - tierClass: 
       - 'text-teal-400' (Success/Prismatic), 
       - 'text-purple-400' (Good/Gold), 
       - 'text-gray-300' (Average/Silver), 
       - 'text-red-500' (Failure/Rejection).
    
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            company: { type: Type.STRING },
            position: { type: Type.STRING },
            salary: { type: Type.STRING },
            desc: { type: Type.STRING },
            tierClass: { type: Type.STRING }
          },
          required: ["company", "position", "salary", "desc", "tierClass"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error(e);
    return {
      company: "系统错误",
      position: "未知命运",
      salary: "???",
      desc: "HR 正在摸鱼，没算出你的结果...",
      tierClass: "text-gray-400"
    };
  }
};
