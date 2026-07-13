import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useProgress } from '../hooks/useProgress';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { TimerBar } from '../components/quiz/TimerBar';
import { ResultsScreen } from '../components/quiz/ResultsScreen';
import { CATEGORIES } from '../types/quiz';
import type { QuizResult } from '../types/quiz';

export function QuizPlay() {
  const { state, dispatch } = useGame();
  const { progress, recordResult, getNewBadges } = useProgress();
  const { session } = state;

  const [deadline, setDeadline] = useState<number>(() => Date.now() + 30_000);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [badgesBefore] = useState(progress.badges);

  useEffect(() => {
    if (!session) return;
    // Reset timer and revealed state on question change
    setDeadline(Date.now() + 30_000);
    setRevealed(false);
  }, [session?.currentIndex]);

  const question = session?.questions[session.currentIndex ?? 0];
  const selectedOptionId = question ? (session?.answers[question.id] ?? null) : null;

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (!session || !question || revealed) return;
      dispatch({ type: 'ANSWER', questionId: question.id, optionId });
      setRevealed(true);
    },
    [session, question, revealed, dispatch]
  );

  const handleTimerExpire = useCallback(() => {
    if (!revealed) setRevealed(true);
  }, [revealed]);

  const handleNext = useCallback(() => {
    if (!session) return;
    const isLast = session.currentIndex >= session.questions.length - 1;
    if (isLast) {
      const now = Date.now();
      dispatch({ type: 'COMPLETE', finishedAt: now });

      // Calculate result
      let totalScore = 0;
      let correctCount = 0;
      const answers = session.answers;
      session.questions.forEach(q => {
        if (answers[q.id] === q.correctOptionId) {
          totalScore += q.pointValue;
          correctCount++;
        }
      });

      const quizResult: QuizResult = {
        categoryId: session.categoryId,
        score: totalScore,
        totalPossible: session.questions.reduce((s, q) => s + q.pointValue, 0),
        correctCount,
        totalQuestions: session.questions.length,
        timeTaken: now - session.startedAt,
        completedAt: now,
      };
      recordResult(quizResult);
      setResult(quizResult);
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }, [session, dispatch, recordResult]);

  const handleReplay = () => {
    dispatch({ type: 'RESET_SESSION' });
    setResult(null);
  };

  const handleHome = () => {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'SET_TAB', tab: 'categories' });
    setResult(null);
  };

  if (!session && !result) return null;

  if (result) {
    const newBadges = getNewBadges(badgesBefore, progress.badges);
    return (
      <div className="flex flex-col min-h-full p-4 pt-8">
        <ResultsScreen result={result} newBadges={newBadges} onReplay={handleReplay} onHome={handleHome} />
      </div>
    );
  }

  if (!session || !question) return null;

  const category = CATEGORIES.find(c => c.id === session.categoryId);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className={`bg-gradient-to-r ${category?.bgGradient ?? 'from-nigerian-green to-nigerian-green-dark'} pt-10 pb-4 px-4`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-xs font-medium uppercase tracking-wide">
              {category?.label}
            </span>
          </div>
          <button
            onClick={handleHome}
            aria-label="Exit quiz"
            className="p-1.5 rounded-xl bg-white/20 text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <TimerBar
          key={`timer-${session.currentIndex}`}
          deadline={deadline}
          onExpire={handleTimerExpire}
        />
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-28">
        <QuestionCard
          question={question}
          questionIndex={session.currentIndex}
          totalQuestions={session.questions.length}
          selectedOptionId={selectedOptionId}
          revealed={revealed}
          onAnswer={handleAnswer}
        />

        {/* Next button */}
        {revealed && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="w-full bg-nigerian-green text-white font-bold py-4 rounded-2xl shadow-lg shadow-nigerian-green/30"
          >
            {session.currentIndex >= session.questions.length - 1 ? 'See Results 🏆' : 'Next Question →'}
          </motion.button>
        )}
      </div>
    </div>
  );
}
