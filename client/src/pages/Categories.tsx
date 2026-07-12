import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useProgress } from '../hooks/useProgress';
import { CategoryCard } from '../components/ui/CategoryCard';
import { CATEGORIES, type CategoryId } from '../types/quiz';
import type { Question } from '../types/quiz';

// Import question data
import foodQ from '../data/food.json';
import musicQ from '../data/music.json';
import cultureQ from '../data/culture.json';
import sportsQ from '../data/sports.json';
import geoQ from '../data/geography.json';
import nollyQ from '../data/nollywood.json';

const QUESTION_BANK: Record<CategoryId, Question[]> = {
  food: foodQ as Question[],
  music: musicQ as Question[],
  culture: cultureQ as Question[],
  sports: sportsQ as Question[],
  geography: geoQ as Question[],
  nollywood: nollyQ as Question[],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Categories() {
  const { dispatch, state } = useGame();
  const { progress } = useProgress();
  const [selected, setSelected] = useState<CategoryId | null>(null);

  const confirmStart = (categoryId: CategoryId) => {
    const questions = shuffle(QUESTION_BANK[categoryId]).slice(0, 10);
    dispatch({ type: 'START_SOLO', categoryId, questions });
    dispatch({ type: 'SET_TAB', tab: 'categories' });
    setSelected(null);
  };

  const selectedCat = CATEGORIES.find(c => c.id === selected);

  // If a session is active, QuizPlay is rendered in App.tsx
  if (state.session) return null;

  return (
    <div className="flex flex-col min-h-full pb-24">
      <div className="p-4 pt-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Choose Category</h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">10 questions · 30 seconds each</p>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            progress={progress.categories[cat.id]}
            onClick={() => setSelected(cat.id)}
            index={i}
          />
        ))}
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {selected && selectedCat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl p-6 pb-10 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedCat.bgGradient} flex items-center justify-center text-2xl`}>
                    {selectedCat.emoji}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white">{selectedCat.label}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{selectedCat.description}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-3 text-sm mb-6">
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                  <p className="font-bold text-gray-900 dark:text-white">10</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">Questions</p>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                  <p className="font-bold text-gray-900 dark:text-white">30s</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">Per question</p>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                  <p className="font-bold text-gray-900 dark:text-white">1000</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">Max points</p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => confirmStart(selected)}
                className={`w-full bg-gradient-to-r ${selectedCat.bgGradient} text-white font-black py-4 rounded-2xl text-base shadow-lg`}
              >
                Start Quiz {selectedCat.emoji}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
