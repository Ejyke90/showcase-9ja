import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { CATEGORIES } from '../types/quiz';

export function Leaderboard() {
  const { progress } = useProgress();

  const catStats = CATEGORIES.map(cat => ({
    category: cat,
    progress: progress.categories[cat.id],
  })).sort((a, b) => (b.progress?.highScore ?? 0) - (a.progress?.highScore ?? 0));

  return (
    <div className="flex flex-col min-h-full pb-24">
      <div className="bg-gradient-to-br from-nigerian-green to-green-700 pt-10 pb-6 px-4 rounded-b-2xl">
        <h1 className="text-white font-black text-xl">Leaderboard</h1>
        <p className="text-white/70 text-xs mt-1">Your scores & global rankings</p>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Your top scores by category */}
        <div>
          <h2 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-3 flex items-center gap-2">
            <Trophy size={16} className="text-festive-gold" />
            Your Best Scores
          </h2>
          <div className="flex flex-col gap-2">
            {catStats.map(({ category, progress: cp }, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 flex items-center gap-3"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.bgGradient} flex items-center justify-center text-lg flex-shrink-0`}>
                  {category.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{category.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{cp?.totalPlays ?? 0} plays</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-gray-900 dark:text-white">{(cp?.highScore ?? 0).toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">pts</p>
                </div>
                {cp?.completed && (
                  <span className="text-xs bg-nigerian-green text-white px-2 py-0.5 rounded-full font-bold">✓</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
