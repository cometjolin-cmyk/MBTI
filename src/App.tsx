import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Brain, 
  Users, 
  Lightbulb, 
  Target, 
  Sparkles, 
  Loader2,
  Share2,
  Download,
  Twitter,
  Facebook,
  Briefcase,
  Link as LinkIcon
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { QUESTIONS } from './data/questions';
import { PERSONALITIES } from './data/personalities';
import { generatePersonalityImage } from './services/gemini';
import { PersonalityType } from './types';

const ITEMS_PER_PAGE = 3;

const getFamilyGradient = (family: string) => {
  switch (family) {
    case 'Analysts': return 'from-[#6236FF] to-[#AC92FF]';
    case 'Diplomats': return 'from-[#38A3A5] to-[#80ED99]';
    case 'Sentinels': return 'from-[#FFB703] to-[#FFD166]';
    case 'Explorers': return 'from-[#EF476F] to-[#FF85A1]';
    default: return 'from-slate-600 to-slate-400';
  }
};

const getFamilyColor = (family: string) => {
  switch (family) {
    case 'Analysts': return 'text-[#6236FF] bg-[#6236FF]/10 border-[#6236FF]/20';
    case 'Diplomats': return 'text-[#38A3A5] bg-[#38A3A5]/10 border-[#38A3A5]/20';
    case 'Sentinels': return 'text-[#FFB703] bg-[#FFB703]/10 border-[#FFB703]/20';
    case 'Explorers': return 'text-[#EF476F] bg-[#EF476F]/10 border-[#EF476F]/20';
    default: return 'text-slate-600 bg-slate-50 border-slate-100';
  }
};

const getFamilyAccent = (family: string) => {
  switch (family) {
    case 'Analysts': return 'bg-[#6236FF]';
    case 'Diplomats': return 'bg-[#38A3A5]';
    case 'Sentinels': return 'bg-[#FFB703]';
    case 'Explorers': return 'bg-[#EF476F]';
    default: return 'bg-slate-600';
  }
};

const PersonalityAvatar = ({ code, family, loading = false, language }: { code: string, family: string, loading?: boolean, language: 'zh' | 'en' }) => {
  const t = {
    zh: "AI 形象生成中",
    en: "AI Generating Image"
  }[language];
  const isAnalysts = family === 'Analysts';
  const isDiplomats = family === 'Diplomats';
  const isSentinels = family === 'Sentinels';
  const isExplorers = family === 'Explorers';

  const baseColor = isAnalysts ? '#6236FF' : isDiplomats ? '#38A3A5' : isSentinels ? '#FFB703' : '#EF476F';
  const lightColor = isAnalysts ? '#AC92FF' : isDiplomats ? '#80ED99' : isSentinels ? '#FFD166' : '#FF85A1';

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-50/50">
      <motion.div
        animate={loading ? {
          scale: [1, 1.05, 1],
          rotate: [0, 1, -1, 0],
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-48 h-48 flex items-center justify-center"
      >
        {/* Stylized SVG representation based on MBTI code */}
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id={`grad-${code}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={baseColor} />
              <stop offset="100%" stopColor={lightColor} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background Shape based on Family */}
          {isAnalysts && (
            <motion.path
              d="M100 20 L180 160 L20 160 Z"
              fill={`url(#grad-${code})`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1 }}
            />
          )}
          {isDiplomats && (
            <motion.circle
              cx="100" cy="100" r="80"
              fill={`url(#grad-${code})`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1 }}
            />
          )}
          {isSentinels && (
            <motion.rect
              x="30" y="30" width="140" height="140" rx="20"
              fill={`url(#grad-${code})`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1 }}
            />
          )}
          {isExplorers && (
            <motion.path
              d="M100 20 L180 60 L180 140 L100 180 L20 140 L20 60 Z"
              fill={`url(#grad-${code})`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1 }}
            />
          )}

          {/* Specific Character Elements */}
          {code === 'INTJ' && (
            <g>
              <path d="M60 40 L140 40 L160 160 L40 160 Z" fill={`url(#grad-${code})`} />
              <motion.rect 
                x="80" y="70" width="40" height="40" fill="white" fillOpacity="0.3"
                animate={{ y: [70, 60, 70], rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </g>
          )}
          {code === 'INTP' && (
            <g>
              <path d="M50 50 L150 40 L160 150 L40 160 Z" fill={`url(#grad-${code})`} />
              <motion.text 
                x="100" y="80" fontSize="40" fill="white" textAnchor="middle" filter="url(#glow)"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >?</motion.text>
            </g>
          )}
          {code === 'ENTJ' && (
            <g>
              <path d="M100 30 L170 170 L30 170 Z" fill={`url(#grad-${code})`} />
              <rect x="95" y="60" width="10" height="80" fill="white" fillOpacity="0.4" />
              <circle cx="100" cy="55" r="8" fill="white" />
            </g>
          )}
          {code === 'ENTP' && (
            <g>
              <motion.path 
                d="M100 60 L120 80 L100 100 L80 80 Z" fill="white" fillOpacity="0.5"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <circle cx="100" cy="100" r="40" fill="none" stroke={`url(#grad-${code})`} strokeWidth="8" strokeDasharray="20 10" />
            </g>
          )}
          {code === 'INFJ' && (
            <g>
              <path d="M100 170 C100 170 30 120 30 70 C30 40 60 30 80 50 C90 60 100 70 100 70 C100 70 110 60 120 50 C140 30 170 40 170 70 C170 120 100 170 100 170" fill={`url(#grad-${code})`} />
              <motion.ellipse 
                cx="100" cy="100" rx="40" ry="15" fill="none" stroke="white" strokeWidth="3"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </g>
          )}
          {code === 'INFP' && (
            <g>
              <path d="M100 40 C60 40 40 80 40 120 C40 160 100 180 100 180 C100 180 160 160 160 120 C160 80 140 40 100 40" fill={`url(#grad-${code})`} opacity="0.6" />
              <motion.circle 
                cx="100" cy="70" r="15" fill="white" fillOpacity="0.3"
                animate={{ y: [70, 60, 70], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </g>
          )}
          {code === 'ENFJ' && (
            <g>
              <path d="M40 100 A60 60 0 0 1 160 100" fill="none" stroke={`url(#grad-${code})`} strokeWidth="20" strokeLinecap="round" />
              <motion.circle 
                cx="100" cy="100" r="30" fill={`url(#grad-${code})`}
                animate={{ r: [30, 35, 30], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </g>
          )}
          {code === 'ENFP' && (
            <g>
              <path d="M100 30 L115 80 L170 80 L125 110 L145 165 L100 130 L55 165 L75 110 L30 80 L85 80 Z" fill={`url(#grad-${code})`} />
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={Math.random() * 200}
                  cy={Math.random() * 200}
                  r="4"
                  fill="white"
                  animate={{ y: [0, 20, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                />
              ))}
            </g>
          )}
          {code === 'ISTJ' && (
            <g>
              <rect x="50" y="50" width="100" height="100" rx="10" fill={`url(#grad-${code})`} />
              <rect x="70" y="70" width="60" height="60" fill="white" fillOpacity="0.2" />
              <line x1="75" y1="85" x2="125" y2="85" stroke="white" strokeWidth="2" />
              <line x1="75" y1="100" x2="125" y2="100" stroke="white" strokeWidth="2" />
              <line x1="75" y1="115" x2="125" y2="115" stroke="white" strokeWidth="2" />
            </g>
          )}
          {code === 'ISFJ' && (
            <g>
              <path d="M100 40 C60 40 40 80 40 160 L160 160 C160 80 140 40 100 40" fill={`url(#grad-${code})`} />
              <motion.circle 
                cx="100" cy="120" r="10" fill="white" filter="url(#glow)"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </g>
          )}
          {code === 'ESTJ' && (
            <g>
              <rect x="60" y="40" width="80" height="120" rx="5" fill={`url(#grad-${code})`} />
              <rect x="75" y="110" width="10" height="30" fill="white" fillOpacity="0.5" />
              <rect x="95" y="90" width="10" height="50" fill="white" fillOpacity="0.5" />
              <rect x="115" y="70" width="10" height="70" fill="white" fillOpacity="0.5" />
            </g>
          )}
          {code === 'ESFJ' && (
            <g>
              <circle cx="100" cy="100" r="60" fill="none" stroke={`url(#grad-${code})`} strokeWidth="15" />
              <path d="M70 70 L130 70 L130 130 L70 130 Z" fill={`url(#grad-${code})`} opacity="0.5" />
              <circle cx="100" cy="100" r="20" fill="white" fillOpacity="0.3" />
            </g>
          )}
          {code === 'ISTP' && (
            <g>
              <path d="M40 160 L100 40 L160 160 Z" fill={`url(#grad-${code})`} />
              <rect x="90" y="80" width="20" height="60" fill="white" fillOpacity="0.3" />
              <circle cx="100" cy="80" r="8" fill="white" />
            </g>
          )}
          {code === 'ISFP' && (
            <g>
              <path d="M100 40 Q160 40 160 100 Q160 160 100 160 Q40 160 40 100 Q40 40 100 40" fill={`url(#grad-${code})`} />
              <motion.path 
                d="M70 100 Q100 70 130 100" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round"
                animate={{ d: ["M70 100 Q100 70 130 100", "M70 100 Q100 130 130 100", "M70 100 Q100 70 130 100"] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </g>
          )}
          {code === 'ESTP' && (
            <g>
              <path d="M40 80 L160 40 L140 160 L20 120 Z" fill={`url(#grad-${code})`} />
              <motion.path 
                d="M60 140 L140 140" stroke="white" strokeWidth="8" strokeLinecap="round"
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </g>
          )}
          {code === 'ESFP' && (
            <g>
              <path d="M100 30 L150 70 L150 130 L100 170 L50 130 L50 70 Z" fill={`url(#grad-${code})`} />
              <motion.circle 
                cx="100" cy="100" r="30" fill="white" fillOpacity="0.2"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <circle cx="100" cy="100" r="5" fill="white" />
            </g>
          )}
        </svg>

        {/* Loading Overlay Text */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-100"
            >
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{t}</span>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [result, setResult] = useState<PersonalityType | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [activeLetterIndices, setActiveLetterIndices] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const t = {
    zh: {
      title: "MBTI人格測試",
      subtitle: "您是誰？",
      start: "開始探索",
      quickTest: "快速測試 (隨機填答)",
      step1: "第 1 步",
      step1Title: "完成作答",
      step1Content: "聽從第一直覺。這不只是測試，而是探尋您看待世界與做決定的獨特方式。",
      step2: "第 2 步",
      step2Title: "解讀內在偏好",
      step2Content: "查看詳細分析，了解您的性格偏好如何影響職業傾向與人際互動，看見您獨一無二的色彩。",
      step3: "第 3 步",
      step3Title: "啟發自我成長",
      step3Content: "運用這份深度洞察，優化溝通、發揮優勢，在生活與職涯中更有自信地成為您想成為的樣子。",
      guidanceTitle: "測驗前置引導",
      guidanceSubtitle: "在開始之前，請先閱讀以下關於 MBTI 的正確觀念",
      natureTitle: "🔍 認識 MBTI 的本質",
      nature1: "是偏好，不是能力：",
      nature1Content: "MBTI 是一份人格偏好工具，旨在揭示你如何看待事物與做決定，並非能力測驗或心理診斷。",
      nature2: "結果無好壞之分：",
      nature2Content: "答案與性格類型皆沒有優劣高低之分。每一種類型都有其獨特的優勢與限制。",
      purposeTitle: "🎯 測驗的目的",
      purpose1: "自我理解與溝通：",
      purpose1Content: "幫助你更清晰地認識自己的天賦與盲點，並理解他人與你的差異，從而改善溝通品質。",
      purpose2: "並非標籤：",
      purpose2Content: "性格是動態發展的。MBTI 提供的是一個觀察自我的框架，而非限制你發展的標籤。",
      howTitle: "📝 如何獲得準確結果",
      how1: "放鬆心情：",
      how1Content: "選擇一個安靜、不被打擾的環境，以最放鬆、最真實的狀態作答。",
      how2: "第一直覺：",
      how2Content: "不要過度思考「正確答案」或「社會期待」。選擇最符合你本能反應的選項。",
      how3: "考慮「平常的你」：",
      how3Content: "想像你在最自然、壓力最小的情況下會如何反應，而非在工作或特定角色中的表現。",
      understand: "我已了解，開始測驗",
      calculating: "正在分析您的性格特質...",
      progress: "測驗進度",
      prev: "上一頁",
      next: "下一頁",
      seeResult: "查看結果",
      resultTitle: "您的性格類型是",
      traits: "性格特質",
      careers: "推薦職業",
      analysis: "深度分析",
      download: "下載報告",
      share: "分享結果",
      retake: "重新測試",
      copied: "連結已複製到剪貼簿",
      generating: "正在生成 PDF...",
      aiDrawing: "AI 形象生成中",
      aiDrawingLong: "AI 正在為您繪製專屬形象，請稍候...",
      completeAll: "請完成所有題目後再查看結果。尚有 {n} 題未回答。",
      pageIncomplete: "本頁還有 {n} 題未回答，請完成後再繼續。",
      overviewTitle: "16 型人格總覽",
      overviewSubtitle: "探索不同性格類型的獨特魅力",
      analysts: "分析家",
      diplomats: "外交官",
      sentinels: "守護者",
      explorers: "探險家",
      exploreAll: "探索 16 型人格全圖譜",
      analysisTitle: "深度人格解析",
      careerPath: "推薦職業路徑",
      andMore: "及更多領域...",
      coreMetrics: "性格核心指標",
      energy: "能量",
      information: "資訊",
      decision: "決策",
      lifestyle: "生活",
      dimensionAnalysis: "性格維度精確分析",
      dimensionSubtitle: "基於您的作答數據，系統構建了以下四個核心維度的心理傾向分佈圖。",
      dataCalibrated: "數據已校準",
      energySource: "能量來源",
      extraversion: "外傾",
      introversion: "內傾",
      infoGathering: "資訊獲取",
      intuition: "直覺",
      sensing: "感覺",
      decisionMaking: "決策方式",
      feeling: "情感",
      thinking: "思考",
      lifeAttitude: "生活態度",
      judging: "判斷",
      perceiving: "知覺",
      careerBlueprint: "職涯發展藍圖",
      careerAdvice: "基於您的性格優勢，此領域能提供理想的發揮空間與成長潛力。",
      shareTitle: "傳遞您的性格光譜",
      shareSubtitle: "每一種人格都是獨一無二的色彩。分享您的測試結果，讓朋友們也發現自己的潛能，或下載完整 PDF 報告永久珍藏。",
      downloadPDF: "下載完整報告",
      generatingPDF: "正在生成報告...",
      footer: "© 2026 MBTI 專業性格測試 · 結合 Gemini AI 技術",
      shareMessage: "我的 MBTI 測試結果是 {code} ({title})！快來測測看你的性格類型吧！ #MBTI #性格測試",
    },
    en: {
      title: "MBTI Personality Test",
      subtitle: "Who are you?",
      start: "Start Exploring",
      quickTest: "Quick Test (Random Answers)",
      step1: "Step 1",
      step1Title: "Complete the Test",
      step1Content: "Follow your first intuition. This is not just a test, but a quest to find your unique way of seeing the world and making decisions.",
      step2: "Step 2",
      step2Title: "Interpret Preferences",
      step2Content: "View detailed analysis to understand how your personality preferences affect career tendencies and interpersonal interactions.",
      step3: "Step 3",
      step3Title: "Inspire Growth",
      step3Content: "Use this deep insight to optimize communication, leverage strengths, and become who you want to be with more confidence.",
      guidanceTitle: "Pre-test Guidance",
      guidanceSubtitle: "Before starting, please read the following correct concepts about MBTI",
      natureTitle: "🔍 Understanding MBTI",
      nature1: "Preference, not Ability:",
      nature1Content: "MBTI is a personality preference tool designed to reveal how you see things and make decisions, not an ability test or psychological diagnosis.",
      nature2: "No Good or Bad Results:",
      nature2Content: "There is no superior or inferior personality type. Each type has its unique strengths and limitations.",
      purposeTitle: "🎯 Purpose of the Test",
      purpose1: "Self-understanding & Communication:",
      purpose1Content: "Help you recognize your talents and blind spots more clearly, and understand the differences between others and yourself.",
      purpose2: "Not a Label:",
      purpose2Content: "Personality is dynamic. MBTI provides a framework for self-observation, not a label that limits your development.",
      howTitle: "📝 How to Get Accurate Results",
      how1: "Relax:",
      how1Content: "Choose a quiet, undisturbed environment and answer in your most relaxed and authentic state.",
      how2: "First Intuition:",
      how2Content: "Don't overthink 'correct answers' or 'social expectations'. Choose the option that best fits your instinctive reaction.",
      how3: "Consider 'Usual You':",
      how3Content: "Imagine how you would react in your most natural, low-stress situations, rather than at work or in specific roles.",
      understand: "I understand, start test",
      calculating: "Analyzing your personality traits...",
      progress: "Progress",
      group: "Group",
      disagree: "Disagree",
      agree: "Agree",
      neutral: "Neutral",
      prev: "Previous",
      next: "Next",
      viewResult: "View Result",
      resultTitle: "Your personality type is",
      traits: "Traits",
      careers: "Recommended Careers",
      analysis: "Deep Analysis",
      download: "Download Report",
      share: "Share Result",
      retake: "Retake Test",
      copied: "Link copied to clipboard",
      generating: "Generating PDF...",
      aiDrawing: "AI Generating Image",
      aiDrawingLong: "AI is drawing your exclusive image, please wait...",
      completeAll: "Please complete all questions before viewing results. {n} questions left.",
      pageIncomplete: "There are {n} unanswered questions on this page. Please complete them before continuing.",
      overviewTitle: "16 Personalities Overview",
      overviewSubtitle: "Explore the unique charm of different personality types",
      analysts: "Analysts",
      diplomats: "Diplomats",
      sentinels: "Sentinels",
      explorers: "Explorers",
      exploreAll: "Explore All 16 Personalities",
      analysisTitle: "Deep Personality Analysis",
      careerPath: "Recommended Career Paths",
      andMore: "And more fields...",
      coreMetrics: "Core Personality Metrics",
      energy: "Energy",
      information: "Information",
      decision: "Decision",
      lifestyle: "Lifestyle",
      dimensionAnalysis: "Precise Dimension Analysis",
      dimensionSubtitle: "Based on your answers, the system has constructed the following distribution of core psychological tendencies.",
      dataCalibrated: "Data Calibrated",
      energySource: "Energy Source",
      extraversion: "Extraversion",
      introversion: "Introversion",
      infoGathering: "Info Gathering",
      intuition: "Intuition",
      sensing: "Sensing",
      decisionMaking: "Decision Making",
      feeling: "Feeling",
      thinking: "Thinking",
      lifeAttitude: "Life Attitude",
      judging: "Judging",
      perceiving: "Perceiving",
      careerBlueprint: "Career Development Blueprint",
      careerAdvice: "Based on your personality strengths, this field provides ideal space for growth and potential.",
      shareTitle: "Pass on Your Personality Spectrum",
      shareSubtitle: "Every personality is a unique color. Share your results to let friends discover their potential, or download the full PDF report.",
      downloadPDF: "Download Full Report",
      generatingPDF: "Generating Report...",
      footer: "© 2026 MBTI Professional Personality Test · Powered by Gemini AI",
      shareMessage: "My MBTI result is {code} ({title})! Come and find out your personality type! #MBTI #PersonalityTest",
    }
  }[language];

  const LanguageToggle = () => (
    <div className="fixed top-6 right-6 z-[110] flex gap-2">
      <button
        onClick={() => setLanguage('zh')}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'zh' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white/80 text-slate-500 hover:bg-white'}`}
      >
        繁中
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white/80 text-slate-500 hover:bg-white'}`}
      >
        EN
      </button>
    </div>
  );

  // Awakening effect: randomly highlight letters when hovering or modal open
  useEffect(() => {
    if (!isHoveringCTA && !showGuidance) {
      setActiveLetterIndices([]);
      return;
    }

    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 4) + 2; // Highlight 2-5 letters
      const indices: number[] = [];
      for (let i = 0; i < count; i++) {
        indices.push(Math.floor(Math.random() * 18));
      }
      setActiveLetterIndices(indices);
    }, 400);

    return () => clearInterval(interval);
  }, [isHoveringCTA, showGuidance]);

  const totalPages = Math.ceil(QUESTIONS.length / ITEMS_PER_PAGE);
  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  const questionRefs = React.useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const pageQuestions = QUESTIONS.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
    const isPageComplete = pageQuestions.every(q => answers[q.id] !== undefined);
    
    if (isPageComplete && currentPage < totalPages - 1) {
      const timer = setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
      return () => clearTimeout(timer);
    } else if (isPageComplete && currentPage === totalPages - 1) {
      // Last page complete, maybe show a hint to click result
    }
  }, [answers, currentPage, totalPages]);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Auto-unlock next question
    if (questionId === activeQuestionId && questionId < QUESTIONS.length) {
      const nextId = questionId + 1;
      setActiveQuestionId(nextId);
      
      // Auto-scroll to next question after a short delay
      setTimeout(() => {
        questionRefs.current[nextId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  };

  const fillRandomAnswers = async () => {
    const randomAnswers: Record<number, number> = {};
    const values = [-3, -2, -1, 0, 1, 2, 3];
    QUESTIONS.forEach(q => {
      randomAnswers[q.id] = values[Math.floor(Math.random() * values.length)];
    });
    setAnswers(randomAnswers);
    // We need to wait for state to update or pass directly to calculate
    // For simplicity, let's just trigger calculation with these values
    await performCalculation(randomAnswers);
  };

  const performCalculation = async (currentAnswers: Record<number, number>) => {
    setIsCalculating(true);
    // Add a small artificial delay for a smoother "calculating" feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 1: J, 2: P, 3: S, 4: N, 5: E, 6: I, 7: F, 8: T
    const scores: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
    
    QUESTIONS.forEach(q => {
      const val = currentAnswers[q.id];
      if (val > 0) {
        scores[q.agreeIndicator] += val;
      } else if (val < 0) {
        scores[q.disagreeIndicator] += Math.abs(val);
      }
    });

    const J = scores[1], P = scores[2];
    const S = scores[3], N = scores[4];
    const E = scores[5], I = scores[6];
    const F = scores[7], T = scores[8];

    const pjIndex = ((P - J) / (22 * 3)) * 10;
    const ieIndex = ((I - E) / (21 * 3)) * 10;
    const snIndex = ((S - N) / (26 * 3)) * 10;
    const tfIndex = ((T - F) / (24 * 3)) * 10;

    const type = [
      ieIndex > 0 ? 'I' : 'E',
      snIndex > 0 ? 'S' : 'N',
      tfIndex > 0 ? 'T' : 'F',
      pjIndex > 0 ? 'P' : 'J'
    ].join('');

    const personality = PERSONALITIES[type];
    setResult(personality);
    setScores({ J, P, S, N, E, I, F, T, pjIndex, snIndex, ieIndex, tfIndex });
    setStep('result');
    setIsCalculating(false);

    setLoadingImage(true);
    const img = await generatePersonalityImage(personality.code);
    setResultImage(img);
    setLoadingImage(false);
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current || !result) return;
    
    setIsGeneratingPDF(true);
    // Small delay to allow UI to settle
    await new Promise(resolve => setTimeout(resolve, 500));

    const element = resultRef.current;
    const opt = {
      margin: 10,
      filename: `MBTI_Report_${result.code}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    } as const;
    
    try {
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'copy') => {
    const shareUrl = window.location.href;
    const shareText = t.shareMessage.replace('{code}', result?.code || '').replace('{title}', (language === 'en' ? result?.enTitle : result?.title) || '');

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const calculateResult = () => {
    const unanswered = QUESTIONS.filter(q => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      const firstUnanswered = unanswered[0];
      const pageOfUnanswered = Math.floor((firstUnanswered.id - 1) / ITEMS_PER_PAGE);
      setCurrentPage(pageOfUnanswered);
      setActiveQuestionId(firstUnanswered.id);
      alert(t.completeAll.replace('{n}', unanswered.length.toString()));
      return;
    }
    performCalculation(answers);
  };

  const nextStep = () => {
    // Check if current page is complete
    const pageQuestions = QUESTIONS.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
    const unansweredOnPage = pageQuestions.filter(q => answers[q.id] === undefined);
    
    if (unansweredOnPage.length > 0) {
      alert(t.pageIncomplete.replace('{n}', unansweredOnPage.length.toString()));
      return;
    }

    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      calculateResult();
    }
  };

  const prevStep = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isPageComplete = QUESTIONS.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).every(q => answers[q.id] !== undefined);

  const chaosLetters = useMemo(() => {
    const letters = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'];
    const colors = {
      E: '#A2D2FF', // Soda Blue
      I: '#A2D2FF', // Soda Blue
      S: '#B9FBC0', // Mint
      N: '#D6BCFA', // Lavender
      T: '#FFADAD', // Coral Pink
      F: '#FFC3A0', // Rose
      J: '#FFD6A5', // Apricot
      P: '#FDFFB6'  // Lemon
    };
    
    // Ensure all 8 letters are present at least once
    const baseLetters = [...letters];
    // Add 10 more random letters for a total of 18
    for (let i = 0; i < 10; i++) {
      baseLetters.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    
    return baseLetters.map((char, i) => {
      let top, left;
      do {
        top = Math.floor(Math.random() * 100);
        left = Math.floor(Math.random() * 100);
      } while (top > 20 && top < 80 && left > 25 && left < 75);

      return {
        id: i,
        char,
        activeColor: colors[char as keyof typeof colors],
        size: Math.floor(Math.random() * (400 - 100 + 1)) + 100,
        rotation: Math.floor(Math.random() * (30 - (-30) + 1)) + (-30),
        top: `${top}%`,
        left: `${left}%`,
        baseOpacity: 0.1 + Math.random() * 0.05,
        floatDuration: 4 + Math.random() * 6,
        floatOffset: 20 + Math.random() * 30
      };
    });
  }, []);

  // Optimized Mouse Tracking with MotionValues to prevent re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * 30);
    mouseY.set((clientY / innerHeight - 0.5) * 30);
  }, [mouseX, mouseY]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);

  return (
    <div 
      className="min-h-screen bg-[#FDFCFB] text-[#2D2D2D] font-sans selection:bg-emerald-100 overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      <LanguageToggle />
      <AnimatePresence>
        {loadingImage && step === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-white/80 backdrop-blur-md border border-emerald-100 px-6 py-3 rounded-full shadow-xl flex items-center gap-3"
          >
            <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
            <span className="text-sm font-bold text-slate-700">{t.aiDrawingLong}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-y-auto bg-[#F3F4F6]"
          >
            {/* Chaos Aesthetic Letter Wall */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {chaosLetters.map((l, idx) => {
                const isActive = activeLetterIndices.includes(idx);
                const isAwakened = isHoveringCTA || showGuidance;
                return (
                  <motion.span
                    key={l.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    style={{
                      position: 'absolute',
                      top: l.top,
                      left: l.left,
                      fontSize: `${l.size}px`,
                      transform: `translate(-50%, -50%)`,
                      fontWeight: 900,
                      lineHeight: 1,
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      filter: isActive ? 'blur(0px)' : 'blur(1px)',
                      x: springX,
                      y: springY,
                      opacity: isAwakened ? (isActive ? 0.7 : 0.25) : l.baseOpacity,
                      scale: isActive ? 1.25 : 1,
                      color: isAwakened ? l.activeColor : '#9CA3AF',
                      rotate: l.rotation
                    }}
                    animate={{ 
                      opacity: isAwakened ? (isActive ? 0.7 : 0.25) : l.baseOpacity, 
                      scale: isActive ? 1.25 : 1,
                      color: isAwakened ? l.activeColor : '#9CA3AF', 
                      rotate: l.rotation + (isAwakened ? (Math.random() - 0.5) * 40 : 0)
                    }}
                    transition={{ 
                      opacity: { duration: isAwakened ? 0.15 : 1 },
                      scale: { duration: isAwakened ? 0.15 : 1 },
                      rotate: { duration: isAwakened ? 0.15 : 1 },
                      delay: isAwakened ? 0 : idx * 0.01,
                    }}
                  >
                    {l.char}
                  </motion.span>
                );
              })}
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 max-w-5xl w-full flex flex-col items-center"
            >
              <div className="text-center mb-16">
                <h1 className="text-7xl md:text-9xl font-black text-slate-900 mb-6 tracking-tighter">
                  {t.title}
                </h1>
                <p className="text-2xl md:text-3xl text-slate-500 font-medium mb-10 leading-relaxed">
                  {t.subtitle}
                </p>
                
                <div className="flex flex-col items-center gap-6">
                  <button
                    onMouseEnter={() => setIsHoveringCTA(true)}
                    onMouseLeave={() => setIsHoveringCTA(false)}
                    onClick={() => setShowGuidance(true)}
                    className="group relative inline-flex items-center justify-center px-20 py-7 font-black text-xl text-white transition-all duration-300 bg-[#FB923C] rounded-full shadow-2xl shadow-orange-200 hover:bg-orange-500 hover:-translate-y-1 active:scale-95"
                  >
                    {t.start}
                    <ChevronRight className="ml-3 w-7 h-7 group-hover:translate-x-2 transition-transform" />
                  </button>
                  
                  <button
                    onClick={fillRandomAnswers}
                    className="text-slate-300 hover:text-slate-400 text-xs font-bold tracking-widest uppercase transition-colors"
                  >
                    {t.quickTest}
                  </button>
                </div>
              </div>

              {/* Core Concept Guidance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
                {[
                  {
                    step: t.step1,
                    title: t.step1Title,
                    content: [
                      t.step1Content
                    ],
                    color: "bg-[#A2D2FF]/10",
                    accent: "bg-[#A2D2FF]"
                  },
                  {
                    step: t.step2,
                    title: t.step2Title,
                    content: [
                      t.step2Content
                    ],
                    color: "bg-[#B9FBC0]/10",
                    accent: "bg-[#B9FBC0]"
                  },
                  {
                    step: t.step3,
                    title: t.step3Title,
                    content: [
                      t.step3Content
                    ],
                    color: "bg-[#D6BCFA]/10",
                    accent: "bg-[#D6BCFA]"
                  }
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`p-8 rounded-[32px] ${card.color} border border-white/50 backdrop-blur-sm text-left flex flex-col h-full`}
                  >
                    <div className={`w-12 h-1.5 ${card.accent} rounded-full mb-6`} />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{card.step}</span>
                    <h3 className="text-xl font-black text-slate-800 mb-4">{card.title}</h3>
                    <ul className="space-y-3 mt-auto">
                      {card.content.map((text, j) => (
                        <li key={j} className="text-sm text-slate-600 leading-relaxed flex gap-2">
                          <span className="text-slate-300">•</span>
                          {text}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Guidance Modal */}
            <AnimatePresence>
              {showGuidance && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-[40px] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-10 shadow-2xl relative"
                  >
                    <button 
                      onClick={() => setShowGuidance(false)}
                      className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <ChevronLeft className="w-8 h-8 rotate-180" />
                    </button>

                    <div className="space-y-10">
                      <header>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">{t.guidanceTitle}</h2>
                        <p className="text-slate-400 font-medium">{t.guidanceSubtitle}</p>
                      </header>

                      <div className="grid gap-8">
                        <section className="space-y-4">
                          <h3 className="flex items-center gap-2 text-lg font-black text-slate-800">
                            <div className="w-2 h-6 bg-blue-400 rounded-full" />
                            {t.natureTitle}
                          </h3>
                          <ul className="space-y-3 text-slate-600 leading-relaxed">
                            <li className="flex flex-col gap-1">
                              <span className="font-bold text-blue-500">{t.nature1}</span>
                              <p className="text-sm">{t.nature1Content}</p>
                            </li>
                            <li className="flex flex-col gap-1">
                              <span className="font-bold text-blue-500">{t.nature2}</span>
                              <p className="text-sm">{t.nature2Content}</p>
                            </li>
                          </ul>
                        </section>

                        <section className="space-y-4">
                          <h3 className="flex items-center gap-2 text-lg font-black text-slate-800">
                            <div className="w-2 h-6 bg-purple-400 rounded-full" />
                            {t.purposeTitle}
                          </h3>
                          <ul className="space-y-3 text-slate-600 leading-relaxed">
                            <li className="flex flex-col gap-1">
                              <span className="font-bold text-purple-500">{t.purpose1}</span>
                              <p className="text-sm">{t.purpose1Content}</p>
                            </li>
                            <li className="flex flex-col gap-1">
                              <span className="font-bold text-purple-500">{t.purpose2}</span>
                              <p className="text-sm">{t.purpose2Content}</p>
                            </li>
                          </ul>
                        </section>

                        <section className="space-y-4">
                          <h3 className="flex items-center gap-2 text-lg font-black text-slate-800">
                            <div className="w-2 h-6 bg-orange-400 rounded-full" />
                            {t.howTitle}
                          </h3>
                          <ul className="space-y-3 text-slate-600 leading-relaxed">
                            <li className="flex flex-col gap-1">
                              <span className="font-bold text-orange-500">{t.how1}</span>
                              <p className="text-sm">{t.how1Content}</p>
                            </li>
                            <li className="flex flex-col gap-1">
                              <span className="font-bold text-orange-500">{t.how2}</span>
                              <p className="text-sm">{t.how2Content}</p>
                            </li>
                            <li className="flex flex-col gap-1">
                              <span className="font-bold text-orange-500">{t.how3}</span>
                              <p className="text-sm">{t.how3Content}</p>
                            </li>
                          </ul>
                        </section>
                      </div>

                      <button
                        onClick={() => {
                          setShowGuidance(false);
                          setStep('quiz');
                        }}
                        className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                      >
                        {t.understand}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 'quiz' && !isCalculating && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-12 px-6 animate-flow-slow gradient-quiz-light"
          >
            <div className="max-w-3xl mx-auto">
              <div className="sticky top-4 z-10 mb-12 bg-white/60 backdrop-blur-xl p-6 rounded-[32px] border border-white/40 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-black text-slate-500 tracking-widest uppercase">{t.progress}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">{t.group} {currentPage + 1} / {totalPages}</span>
                    <span className="text-lg font-black text-emerald-600">{Math.round(progress)}%</span>
                  </div>
                </div>
                <div className="h-3 bg-slate-200/50 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentPage}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    },
                    exit: {
                      opacity: 0,
                      x: -20,
                      transition: { duration: 0.3 }
                    }
                  }}
                  className="space-y-12"
                >
                  {QUESTIONS.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).map((q, idx) => {
                    const isUnlocked = q.id <= activeQuestionId;
                    const isAnswered = answers[q.id] !== undefined;
                    const isActive = q.id === activeQuestionId;

                    return (
                      <motion.div
                        key={q.id}
                        ref={el => questionRefs.current[q.id] = el}
                        variants={{
                          hidden: { opacity: 0, y: 20, scale: 0.95 },
                          visible: { 
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            filter: 'blur(0px)',
                            transition: { type: "spring", stiffness: 100, damping: 20 }
                          }
                        }}
                        className={`p-10 rounded-[40px] border transition-all duration-500 ${
                          isActive 
                            ? 'bg-white border-emerald-200 shadow-[0_20px_50px_rgba(16,185,129,0.1)] ring-1 ring-emerald-100' 
                            : isAnswered 
                              ? 'bg-white/80 border-slate-100 shadow-sm' 
                              : 'bg-white/40 border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-6 mb-10">
                          <span className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all duration-500 ${
                            isAnswered ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {q.id}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight tracking-tight">
                            {language === 'en' ? q.enText : q.text}
                          </h3>
                        </div>
                        
                        <div className="flex flex-col items-center gap-10">
                          <div className="flex items-center justify-between w-full max-w-lg px-4">
                            <span className="text-xs font-black text-[#D9B3B3] uppercase tracking-[0.3em]">{t.disagree}</span>
                            <span className="text-xs font-black text-[#CDCD9A] uppercase tracking-[0.3em]">{t.agree}</span>
                          </div>
                          
                          <div className="flex items-center justify-between w-full max-w-lg">
                            {[-3, -2, -1, 0, 1, 2, 3].map((val) => {
                              const isSelected = answers[q.id] === val;
                              const absVal = Math.abs(val);
                              const size = absVal === 3 ? 'w-16 h-16' : absVal === 2 ? 'w-13 h-13' : absVal === 1 ? 'w-10 h-10' : 'w-8 h-8';
                              
                              const activeColor = val < 0 ? 'bg-[#D9B3B3]' : val > 0 ? 'bg-[#CDCD9A]' : 'bg-slate-400';
                              const borderColor = val < 0 ? 'border-[#D9B3B3]' : val > 0 ? 'border-[#CDCD9A]' : 'border-slate-300';
                              const ringColor = val < 0 ? 'ring-[#D9B3B3]/40' : val > 0 ? 'ring-[#CDCD9A]/40' : 'ring-slate-200';
                              
                              return (
                                <motion.button
                                  key={val}
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleAnswer(q.id, val)}
                                  className={`group relative flex items-center justify-center rounded-full transition-all duration-300 ${size} ${
                                    isSelected 
                                      ? `${activeColor} shadow-[0_10px_25px_rgba(0,0,0,0.1)] scale-110 ring-4 ring-offset-4 ${ringColor}` 
                                      : `bg-white border-2 ${borderColor} hover:bg-slate-50 shadow-sm`
                                  }`}
                                >
                                  {isSelected && (
                                    <motion.div 
                                      layoutId={`check-${q.id}`}
                                      className="text-white"
                                      initial={{ scale: 0, rotate: -45 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    >
                                      <CheckCircle2 className="w-1/2 h-1/2 mx-auto" strokeWidth={3} />
                                    </motion.div>
                                  )}
                                  
                                  <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
                                    <span className="text-[10px] font-black text-slate-400 whitespace-nowrap bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
                                      {val === 0 ? t.neutral : val > 0 ? `${t.agree} (${val})` : `${t.disagree} (${Math.abs(val)})`}
                                    </span>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between items-center mt-20 pt-10 border-t border-slate-200/50">
                <button
                  onClick={prevStep}
                  disabled={currentPage === 0}
                  className="group flex items-center px-8 py-4 text-slate-400 font-black tracking-widest uppercase disabled:opacity-20 hover:text-slate-800 transition-all duration-300"
                >
                  <ChevronLeft className="mr-2 w-6 h-6 group-hover:-translate-x-2 transition-transform" />
                  {t.prev}
                </button>
                
                <div className="text-slate-300 text-xs font-black tracking-[0.3em] uppercase">
                  {t.group} {currentPage + 1} / {totalPages}
                </div>

                <button
                  onClick={nextStep}
                  disabled={!isPageComplete}
                  className={`group flex items-center px-10 py-4 rounded-full font-black tracking-widest uppercase transition-all duration-500 ${
                    isPageComplete
                      ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1'
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {currentPage === totalPages - 1 ? t.viewResult : t.next}
                  <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isCalculating && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center bg-white p-6"
          >
            <div className="relative w-48 h-48 mb-12">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-emerald-200 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-4 border-dashed border-blue-200 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-16 h-16 text-emerald-500 animate-pulse" />
              </div>
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-3xl font-black text-slate-900 mb-4">{t.analyzing}</h2>
              <div className="flex items-center justify-center gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                    className="w-2 h-2 bg-emerald-500 rounded-full"
                  />
                ))}
              </div>
              <p className="mt-8 text-slate-400 font-medium max-w-xs mx-auto">
                {t.analyzingSubtitle}
              </p>
            </motion.div>
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div
            key="result"
            ref={resultRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-6 py-16 space-y-12 min-h-screen"
          >
            {/* 1. Identity Card - Premium Pass Style */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{ 
                x: springX,
                y: springY
              }}
              transition={{ type: "spring", stiffness: 40, damping: 15 }}
              className={`relative overflow-hidden rounded-[48px] p-10 md:p-16 text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-flow-slow bg-gradient-to-br ${getFamilyGradient(result.family)}`}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl" />
              
              {/* Large Background Code */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.07] select-none">
                <span className="text-[280px] md:text-[400px] font-black tracking-tighter leading-none">
                  {result.code}
                </span>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
                {/* AI Avatar Container */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-white/20 rounded-[44px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-[40px] overflow-hidden bg-white shadow-2xl border border-white/30 flex-shrink-0 relative">
                    {loadingImage ? (
                      <PersonalityAvatar code={result.code} family={result.family} loading={true} language={language} />
                    ) : resultImage ? (
                      <motion.img 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={resultImage} 
                        alt={result.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <PersonalityAvatar code={result.code} family={result.family} language={language} />
                    )}
                  </div>
                </div>

                <div className="text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {result.family}
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">
                    {language === 'en' ? result.enTitle : result.title}
                  </h1>
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8">
                    <span className="text-4xl md:text-5xl font-black opacity-90 tracking-widest">{result.code}</span>
                    <div className="hidden md:block h-8 w-px bg-white/20" />
                    <p className="text-lg md:text-xl font-medium opacity-70 italic max-w-md leading-relaxed">
                      "{language === 'en' ? result.enDescription : result.description}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* View All Personalities Button - Refined */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="no-print w-full"
            >
              <button
                onClick={() => setShowOverview(true)}
                className="w-full py-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-black rounded-[28px] transition-all active:scale-[0.99] flex items-center justify-center gap-3 shadow-sm hover:shadow-md group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-sm tracking-[0.2em] uppercase">{t.exploreAll}</span>
              </button>
            </motion.div>

            {/* 1.5 Detailed Analysis - Editorial Split Layout */}
            <motion.section 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-8 bg-white rounded-[48px] p-10 md:p-14 shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-slate-50 rounded-full blur-3xl opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className={`w-3 h-10 rounded-full ${getFamilyAccent(result.family)}`} />
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.analysisTitle}</h2>
                  </div>
                  
                  <div className="prose prose-slate max-w-none">
                    <p className="text-xl md:text-2xl text-slate-600 leading-[1.6] font-medium first-letter:text-7xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-slate-900 first-letter:leading-[0.8] first-letter:mt-2">
                      {language === 'en' ? result.enAnalysis : result.analysis}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-8">
                {/* Career Quick View */}
                <div className={`rounded-[48px] p-10 text-white shadow-xl relative overflow-hidden group bg-gradient-to-br ${getFamilyGradient(result.family)}`}>
                  <div className="absolute bottom-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                    <Briefcase className="w-24 h-24" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-[0.3em] mb-8 opacity-80">{t.careerPath}</h3>
                  <div className="space-y-3">
                    {(language === 'en' ? result.enCareers : result.careers).slice(0, 4).map((career, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                        <span className="text-lg font-bold">{career}</span>
                      </div>
                    ))}
                    <div className="pt-2 text-xs font-black uppercase tracking-widest opacity-60">{t.andMore}</div>
                  </div>
                </div>

                {/* Quick Stats Bento */}
                <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <Target className="w-24 h-24" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-[0.3em] mb-8 opacity-60">{t.coreMetrics}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-xs font-black text-slate-500 uppercase mb-1">{t.energy}</div>
                      <div className="text-xl font-black">{scores.ieIndex > 0 ? 'I' : 'E'}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-xs font-black text-slate-500 uppercase mb-1">{t.information}</div>
                      <div className="text-xl font-black">{scores.snIndex > 0 ? 'S' : 'N'}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-xs font-black text-slate-500 uppercase mb-1">{t.decision}</div>
                      <div className="text-xl font-black">{scores.tfIndex > 0 ? 'T' : 'F'}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-xs font-black text-slate-500 uppercase mb-1">{t.lifestyle}</div>
                      <div className="text-xl font-black">{scores.pjIndex > 0 ? 'P' : 'J'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 2. Personality Dimensions - Technical Dashboard Style */}
            <section className="w-full bg-white rounded-[48px] p-10 md:p-14 shadow-xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-2 h-8 rounded-full ${getFamilyAccent(result.family)}`} />
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.dimensionAnalysis}</h2>
                    </div>
                    <p className="text-slate-400 font-medium max-w-md">{t.dimensionSubtitle}</p>
                  </div>
                  <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.dataCalibrated}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                  {[
                    { 
                      label: t.energySource, 
                      left: { code: 'E', name: t.extraversion, count: scores.E }, 
                      right: { code: 'I', name: t.introversion, count: scores.I },
                      val: scores.ieIndex
                    },
                    { 
                      label: t.infoGathering, 
                      left: { code: 'N', name: t.intuition, count: scores.N }, 
                      right: { code: 'S', name: t.sensing, count: scores.S },
                      val: scores.snIndex
                    },
                    { 
                      label: t.decisionMaking, 
                      left: { code: 'F', name: t.feeling, count: scores.F }, 
                      right: { code: 'T', name: t.thinking, count: scores.T },
                      val: scores.tfIndex
                    },
                    { 
                      label: t.lifeAttitude, 
                      left: { code: 'J', name: t.judging, count: scores.J }, 
                      right: { code: 'P', name: t.perceiving, count: scores.P },
                      val: scores.pjIndex
                    },
                  ].map((dim, i) => {
                    const total = dim.left.count + dim.right.count;
                    const leftPct = total > 0 ? Math.round((dim.left.count / total) * 100) : 50;
                    const rightPct = 100 - leftPct;
                    const isLeftDominant = leftPct > 50;
                    const isRightDominant = rightPct > 50;
                    
                    return (
                      <div key={i} className="group">
                        <div className="flex justify-between items-end mb-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">{dim.label}</span>
                            <div className="flex items-baseline gap-2">
                              <span className={`text-4xl font-black ${isLeftDominant ? 'text-slate-900' : 'text-slate-300'}`}>{dim.left.code}</span>
                              <span className={`text-xs font-bold ${isLeftDominant ? 'text-slate-500' : 'text-slate-300'}`}>{dim.left.name}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-2">
                              <span className={`text-xs font-bold ${isRightDominant ? 'text-slate-500' : 'text-slate-300'}`}>{dim.right.name}</span>
                              <span className={`text-4xl font-black ${isRightDominant ? 'text-slate-900' : 'text-slate-300'}`}>{dim.right.code}</span>
                            </div>
                          </div>
                        </div>

                        {/* Technical Gauge */}
                        <div className="relative h-12 bg-slate-50 rounded-2xl border border-slate-100 p-1.5 flex items-center overflow-hidden">
                          {/* Center Marker */}
                          <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-slate-200 z-10" />
                          
                          {/* Left Fill */}
                          <div className="flex-1 h-full flex justify-end">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${leftPct}%` }}
                              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                              className={`h-full rounded-l-xl ${isLeftDominant ? getFamilyAccent(result.family) : 'bg-slate-200'} relative overflow-hidden`}
                            >
                              {isLeftDominant && (
                                <motion.div 
                                  animate={{ x: ['-100%', '100%'] }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                />
                              )}
                            </motion.div>
                          </div>

                          {/* Right Fill */}
                          <div className="flex-1 h-full flex justify-start">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${rightPct}%` }}
                              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                              className={`h-full rounded-r-xl ${isRightDominant ? getFamilyAccent(result.family) : 'bg-slate-200'} relative overflow-hidden`}
                            >
                              {isRightDominant && (
                                <motion.div 
                                  animate={{ x: ['-100%', '100%'] }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                />
                              )}
                            </motion.div>
                          </div>

                          {/* Percentage Overlays */}
                          <div className="absolute inset-0 flex justify-between items-center px-8 pointer-events-none">
                            <span className={`text-xs font-black ${isLeftDominant ? 'text-white' : 'text-slate-400'}`}>{leftPct}%</span>
                            <span className={`text-xs font-black ${isRightDominant ? 'text-white' : 'text-slate-400'}`}>{rightPct}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 3. Detailed Career Path - Expanded */}
            <section className="w-full bg-white rounded-[48px] p-10 md:p-14 shadow-xl border border-slate-100 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full -ml-48 -mb-48 blur-3xl opacity-50" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-12">
                  <div className={`w-12 h-12 rounded-2xl ${getFamilyAccent(result.family)} flex items-center justify-center shadow-lg shadow-slate-200`}>
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.careerBlueprint}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(language === 'en' ? result.enCareers : result.careers).map((career, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -12, scale: 1.02 }}
                      className="p-8 bg-slate-50 rounded-[40px] border border-transparent hover:border-white hover:bg-white hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <Target className="w-16 h-16" />
                      </div>
                      
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 text-white font-black text-2xl shadow-xl ${getFamilyAccent(result.family)} group-hover:scale-110 transition-transform`}>
                        {i + 1}
                      </div>
                      <h4 className="text-2xl font-black text-slate-800 mb-4 leading-tight">{career}</h4>
                      <p className="text-sm text-slate-400 font-medium mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {t.careerAdvice}
                      </p>
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full group-hover:w-full group-hover:bg-emerald-400 transition-all duration-700" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Share & Download Section - Dark Mode Contrast */}
            <section className="w-full bg-slate-900 rounded-[48px] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
                <Share2 className="w-64 h-64" />
              </div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="text-center lg:text-left max-w-xl">
                  <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">{t.shareTitle}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    {t.shareSubtitle}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex gap-4">
                    {[
                      { icon: Twitter, action: () => handleShare('twitter'), label: 'Twitter' },
                      { icon: Facebook, action: () => handleShare('facebook'), label: 'Facebook' },
                      { icon: LinkIcon, action: () => handleShare('copy'), label: 'Copy' }
                    ].map((item, i) => (
                      <button 
                        key={i}
                        onClick={item.action}
                        className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all active:scale-90 group"
                        title={item.label}
                      >
                        <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                  <div className="hidden sm:block w-px h-14 bg-white/10" />
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className={`px-10 py-5 rounded-[24px] font-black flex items-center gap-3 transition-all active:scale-95 shadow-2xl shadow-emerald-500/20 group ${
                      isGeneratingPDF 
                        ? 'bg-emerald-400 cursor-not-allowed opacity-80' 
                        : 'bg-emerald-500 hover:bg-emerald-600'
                    } text-white`}
                  >
                    {isGeneratingPDF ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                    )}
                    <span className="text-lg">{isGeneratingPDF ? t.generatingPDF : t.downloadPDF}</span>
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-4xl mx-auto px-6 py-12 text-center text-slate-400 text-sm border-t border-slate-100 mt-20">
        <p>{t.footer}</p>
      </footer>

      {/* Personality Overview Modal */}
      <AnimatePresence>
        {showOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowOverview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">{t.overviewTitle}</h2>
                  <p className="text-slate-500 font-medium">{t.overviewSubtitle}</p>
                </div>
                <button 
                  onClick={() => setShowOverview(false)}
                  className="p-3 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8 rotate-180" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(['Analysts', 'Diplomats', 'Sentinels', 'Explorers'] as const).map(family => (
                    <div key={family} className="space-y-6">
                      <div className="flex items-center gap-2 px-2">
                        <div className={`w-2 h-6 rounded-full ${getFamilyAccent(family)}`} />
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">
                          {family === 'Analysts' ? t.analysts : 
                           family === 'Diplomats' ? t.diplomats : 
                           family === 'Sentinels' ? t.sentinels : t.explorers}
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {Object.values(PERSONALITIES).filter(p => p.family === family).map(p => (
                          <div 
                            key={p.code}
                            className="group p-6 rounded-[32px] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl transition-all duration-300"
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg bg-gradient-to-br ${getFamilyGradient(p.family)}`}>
                                {p.code[0]}
                              </div>
                              <div>
                                <h4 className="font-black text-slate-900">
                                  {language === 'en' ? p.enTitle : p.title}
                                </h4>
                                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">{p.code}</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                              {language === 'en' ? p.enAnalysis : p.analysis}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">{t.copied}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
