import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Category } from '../../types/quiz';
import type { CategoryProgress } from '../../types/progress';
import { ProgressRing } from './ProgressRing';

interface CategoryCardProps {
  category: Category;
  progress?: CategoryProgress;
  onClick: () => void;
  index: number;
}

export function CategoryCard({ category, progress, onClick, index }: CategoryCardProps) {
  const playCount = progress?.totalPlays ?? 0;
  const highScore = progress?.highScore ?? 0;
  const completed = progress?.completed ?? false;
  const percent = highScore > 0 ? Math.round((highScore / 1000) * 100) : 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 300, damping: 25 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full text-left overflow-hidden rounded-2xl shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 active:shadow-md"
    >
      <div className="flex items-stretch">
        {/* Left: image */}
        <div className={`relative w-20 flex-shrink-0 bg-gradient-to-br ${category.bgGradient} flex items-center justify-center`}>
          <img
            src={category.imageUrl}
            alt={category.label}
            className="w-full h-full object-cover opacity-60 mix-blend-overlay absolute inset-0"
            loading="lazy"
          />
          <span className="relative text-2xl z-10">{category.emoji}</span>
        </div>

        {/* Right: info */}
        <div className="flex-1 flex items-center justify-between px-4 py-3 min-h-[80px]">
          <div className="flex-1 min-w-0 mr-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{category.label}</h3>
              {completed && (
                <span className="text-[10px] font-semibold bg-nigerian-green text-white px-1.5 py-0.5 rounded-full">
                  ✓
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{category.description}</p>
            {playCount > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Best: <span className="font-semibold text-nigerian-green">{highScore.toLocaleString()} pts</span>
                {' · '}{playCount} {playCount === 1 ? 'play' : 'plays'}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {playCount > 0 && (
              <div className="relative">
                <ProgressRing percent={percent} size={36} strokeWidth={3} />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-nigerian-green">
                  {percent}%
                </span>
              </div>
            )}
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
