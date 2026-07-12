import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import type { QuizResult } from '../../types/quiz';
import { CATEGORIES } from '../../types/quiz';
import { BADGES } from '../../types/progress';
import { ConfettiBlast } from '../ui/ConfettiBlast';

interface ResultsScreenProps {
  result: QuizResult;
  newBadges: string[];
  onReplay: () => void;
  onHome: () => void;
}

function getRank(pct: number) {
  if (pct >= 90) return { label: 'Naija Legend!', emoji: '🦅', color: 'text-festive-gold' };
  if (pct >= 70) return { label: 'Sharp Sharp!', emoji: '⚡', color: 'text-nigerian-green' };
  if (pct >= 50) return { label: 'E dey try!', emoji: '💪', color: 'text-blue-600' };
  return { label: 'E go better!', emoji: '🌱', color: 'text-gray-500' };
}

export function ResultsScreen({ result, newBadges, onReplay, onHome }: ResultsScreenProps) {
  const pct = result.totalPossible > 0 ? Math.round((result.score / result.totalPossible) * 100) : 0;
  const rank = getRank(pct);
  const isGreat = pct >= 70;
  const category = CATEGORIES.find(c => c.id === result.categoryId);

  return (
    <div className="flex flex-col min-h-full pb-24">
      <ConfettiBlast active={isGreat} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="flex flex-col items-center gap-5 pt-8"
      >
        {/* Score circle */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-nigerian-green/10 dark:bg-nigerian-green/20 border-4 border-nigerian-green flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-nigerian-green">{pct}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{result.score.toLocaleString()} pts</span>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
            className="absolute -top-2 -right-2 text-3xl"
          >
            {rank.emoji}
          </motion.div>
        </div>

        <div className="text-center">
          <h2 className={`text-2xl font-black ${rank.color}`}>{rank.label}</h2>
          {category && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {category.emoji} {category.label}
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { label: 'Correct', value: `${result.correctCount}/${result.totalQuestions}`, icon: '✅' },
            { label: 'Score', value: result.score.toLocaleString(), icon: '⭐' },
            {
              label: 'Time',
              value: `${Math.floor(result.timeTaken / 60000)}:${String(Math.round((result.timeTaken % 60000) / 1000)).padStart(2, '0')}`,
              icon: '⏱️',
            },
          ].map(stat => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-3 text-center shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">{stat.value}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* New badges */}
        {newBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-festive-gold/10 border border-festive-gold/30 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={16} className="text-festive-gold" />
              <span className="text-sm font-bold text-festive-gold-dark">New Badge{newBadges.length > 1 ? 's' : ''} Earned!</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {newBadges.map(id => {
                const badge = BADGES.find(b => b.id === id);
                return badge ? (
                  <div key={id} className="flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-xl px-3 py-1.5 text-sm font-medium shadow-sm dark:text-white">
                    <span>{badge.emoji}</span>
                    <span>{badge.label}</span>
                  </div>
                ) : null;
              })}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onReplay}
            className="w-full bg-nigerian-green text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-nigerian-green/30"
          >
            <RotateCcw size={18} />
            Play Again
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onHome}
            className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold py-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back to Categories
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
