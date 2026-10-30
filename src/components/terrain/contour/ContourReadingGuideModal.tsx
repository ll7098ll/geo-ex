import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Info,
  Compass,
  X,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { TerrainElevationField } from '../../../types/contour';

interface ContourReadingGuideModalProps {
  field: TerrainElevationField;
  onClose: () => void;
  onSelectTerrain?: (terrainName: string) => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  category: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: '등고선 기본 원리',
    question: '등고선 지도에서 V자 모양으로 굽어진 등고선의 뾰족한 끝이 고도가 높은 쪽(상류)을 향하고 있다면 이곳은 어떤 지형일까요?',
    options: ['능선(Ridge)', '계곡(Valley / 하천 수로)', '단애면(Cliff)', '고위 평탄면'],
    correctIndex: 1,
    explanation: '등고선이 높은 고도를 향해 뾰족하게 파고드는 V자 형태는 하천이 침식하여 만든 "계곡(Valley)"입니다. 반대로 낮은 쪽을 향해 볼록하면 능선입니다.',
  },
  {
    id: 2,
    category: '경사도와 단면도 판독',
    question: '2D 등고선도에서 등고선과 등고선 사이의 간격이 매우 좁아 거의 겹칠 듯 밀집해 있다면, 지형 단면도(Elevation Profile)에서는 어떤 형태로 나타날까요?',
    options: ['평탄한 충적 평야', '완만한 오르막길 (경사 5도 미만)', '가파른 수직 낭떠러지/급경사 (단애면)', '원형의 호수 분지'],
    correctIndex: 2,
    explanation: '등고선 간격과 경사도는 반비례합니다. 같은 수평 거리에서 고도가 급격히 변하므로 간격이 좁을수록 단면도 상에서 가파른 급경사 절벽을 이룹니다.',
  },
  {
    id: 3,
    category: '특수 기호 판독',
    question: '동심원 형태의 닫힌 등고선 안쪽에 내부 중심을 향해 짧은 빗금(Hachure) 표시가 그어져 있다면 무엇을 의미할까요?',
    options: ['정상 봉우리(Peak)', '주변보다 낮은 오목와지/함몰 분지 (분화구, 돌리네)', '숲이 우거진 식생 구역', '채석장 절토 사면'],
    correctIndex: 1,
    explanation: '등고선 안쪽으로 난 빗금은 주변보다 고도가 낮아지는 오목와지(요지) 기호입니다. 백록담 분화구나 석회암 지대의 싱크홀(돌리네)에 사용됩니다.',
  },
  {
    id: 4,
    category: '지형별 등고선 특징',
    question: '골짜기 입구(선정)를 꼭짓점으로 하여 하류 평야를 향해 부채꼴 호형(방사상)으로 완만해지는 등고선 패턴을 보이는 지형은?',
    options: ['선상지(Alluvial Fan)', 'U자곡(Glacial Valley)', '피오르드(Fjord)', '탑 카르스트(Tower Karst)'],
    correctIndex: 0,
    explanation: '하천이 산지에서 평지로 나오며 유속이 급감하여 자갈과 모래를 부채꼴로 퇴적한 "선상지(Alluvial Fan)"의 전형적인 등고선 패턴입니다.',
  },
  {
    id: 5,
    category: '카르스트 및 빙하 지형',
    question: '넓고 평탄한 계곡 바닥(등고선 간격 광활) 양옆으로 수직에 가까운 급절벽(등고선 초밀집)이 평행하게 이어지는 U자형 단면을 가진 지형은?',
    options: ['하천의 V자곡', '빙하 침식에 의한 U자곡(빙식곡)', '해안 사구열', '범람원의 배후습지'],
    correctIndex: 1,
    explanation: '빙하가 계곡 전체를 가득 채워 흐르며 바닥과 측벽을 동시에 깎아낸 빙식곡(U자곡)은 바닥이 평탄하고 양측 벽이 가파른 전형적인 U자 단면을 보입니다.',
  },
];

export const ContourReadingGuideModal: React.FC<ContourReadingGuideModalProps> = ({
  field,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'principles' | 'current' | 'quiz'>('principles');

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQuizIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIdx((idx) => idx + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div
      id="contour-reading-guide-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200"
    >
      <div
        id="contour-reading-guide-dialog"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                지리 독도법(讀圖法) & 등고선 학습 가이드
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  교과서 연계
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                2차원 등고선도를 통해 3차원 지형의 입체 기복과 경사도를 읽어내는 원리를 배웁니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-5">
          <button
            onClick={() => setActiveTab('principles')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'principles'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>등고선 5대 기본 원칙</span>
          </button>

          <button
            onClick={() => setActiveTab('current')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'current'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>현재 지형: {field.terrainKey} 독도 가이드</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>독도 챌린지 퀴즈</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 text-slate-200 space-y-4">
          {/* TAB 1: 5 PRINCIPLES */}
          {activeTab === 'principles' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. 폐곡선의 원리 */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center border border-cyan-500/40">
                      1
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">폐곡선의 원리</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    동일한 고도의 점들을 연결한 선이므로, 지도 도엽 밖으로 나가는 경우를 제외하고는 반드시 시작점과 끝점이 만나 하나의 닫힌 고리(폐곡선)를 이룹니다.
                  </p>
                </div>

                {/* 2. 불비교차의 원리 */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center border border-cyan-500/40">
                      2
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">비교차(불교차)의 원리</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    한 지점의 고도는 오직 하나이므로 등고선끼리 교차하거나 갈라지지 않습니다. (수직 절벽에서는 겹쳐 보이며, 오버행 동굴에서만 극히 예외적으로 교차).
                  </p>
                </div>

                {/* 3. 경사-간격 반비례의 원리 */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center border border-cyan-500/40">
                      3
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">경사-간격 반비례 원리</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    등고선 간격이 좁을수록 단면도 경사가 가파르고(급경사), 간격이 넓을수록 완경사 또는 평탄면을 이룹니다.
                  </p>
                </div>

                {/* 4. 능선과 계곡의 V자 판별 */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center border border-cyan-500/40">
                      4
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">능선 vs 계곡 V자 법칙</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    등고선이 <strong>높은 쪽(상류)을 향해 뾰족</strong>하면 물이 흐르는 <strong>계곡(Valley)</strong>이고, <strong>낮은 쪽을 향해 볼록</strong>하면 바람을 맞는 <strong>능선(Ridge)</strong>입니다.
                  </p>
                </div>
              </div>

              {/* 5. 요지 기호 */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center border border-amber-500/40 shrink-0 mt-0.5">
                  5
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 mb-1">오목와지(요지) 빗금 기호</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    화구, 칼데라, 석회암 싱크홀(돌리네)처럼 주변 지형보다 안쪽이 옴폭하게 낮아지는 분지에는 폐곡선 안쪽에 작은 빗금을 쳐서 오목지임을 표시합니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CURRENT TERRAIN */}
          {activeTab === 'current' && (
            <div className="space-y-4">
              <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-cyan-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    {field.terrainKey} 지형의 핵심 등고선 독도 포인트
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 font-mono">
                    주곡선 {field.contourSettings.indexInterval}m / 계곡선 {field.contourSettings.intermediateInterval}m
                  </span>
                </div>
                <ul className="space-y-2 mt-3">
                  {field.contourReadingTips.map((tip, idx) => (
                    <li key={idx} className="text-xs text-slate-200 flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Presets Info */}
              {field.crossSectionPresets && field.crossSectionPresets.length > 0 && (
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-slate-100 mb-2.5">
                    추천 횡단면도(Cross-Section) 절단선 가이드
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {field.crossSectionPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50"
                      >
                        <div className="text-xs font-bold text-cyan-300 mb-1">{preset.name}</div>
                        <p className="text-[11px] text-slate-300">{preset.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QUIZ CHALLENGE */}
          {activeTab === 'quiz' && (
            <div>
              {!quizFinished ? (
                <div className="space-y-4">
                  {/* Progress bar */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>
                      문제 {currentQuizIdx + 1} / {QUIZ_QUESTIONS.length}
                    </span>
                    <span className="text-amber-400 font-bold">현재 점수: {score}점</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{
                        width: `${((currentQuizIdx + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Question Box */}
                  <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {currentQ.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-100 mt-2 mb-4 leading-snug">
                      {currentQ.question}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2">
                      {currentQ.options.map((opt, idx) => {
                        let btnStyle = 'bg-slate-900/90 border-slate-700 hover:bg-slate-800 text-slate-200';

                        if (selectedOption === idx) {
                          btnStyle = 'bg-cyan-950 border-cyan-500 text-cyan-200 font-semibold';
                        }

                        if (isAnswerSubmitted) {
                          if (idx === currentQ.correctIndex) {
                            btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                          } else if (selectedOption === idx) {
                            btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 font-bold';
                          } else {
                            btnStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-400';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>
                              {idx + 1}. {opt}
                            </span>
                            {isAnswerSubmitted && idx === currentQ.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {isAnswerSubmitted && (
                      <div className="mt-4 p-3 bg-slate-900/90 border border-cyan-800/50 rounded-lg text-xs text-slate-200">
                        <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" />
                          해설
                        </div>
                        <p className="leading-relaxed">{currentQ.explanation}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition-colors"
                      >
                        정답 확인
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                      >
                        <span>
                          {currentQuizIdx < QUIZ_QUESTIONS.length - 1 ? '다음 문제' : '결과 보기'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Result Screen */
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-100">독도 챌린지 완료!</h4>
                  <p className="text-sm text-slate-300">
                    총 {QUIZ_QUESTIONS.length}문제 중{' '}
                    <span className="text-cyan-400 font-bold text-lg">{score}</span>문제를 맞히셨습니다!
                  </p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    3D 지형 뷰어와 2D 등고선도, 단면도 절단선 도구를 자유롭게 활용하며 실제 지형의 기복을 더 깊이 탐구해보세요.
                  </p>
                  <button
                    onClick={handleRestartQuiz}
                    className="mt-4 px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm transition-colors inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    다시 도전하기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>한국지리 & 세계지리 교육과정 표준 사양</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
