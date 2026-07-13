import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, PlayCircle, ChevronRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useProgress } from '../hooks/useProgress';
import { CATEGORIES } from '../types/quiz';

import welcomeImg from '../assets/welcome.jpg';
import naijaFlagImg from '../assets/Naija_flag.jpg';
import logoImg from '../assets/logo2.png';

const HERO_IMAGES = [
  { url: welcomeImg, caption: 'Welcome to Showcase Nigeria 🇳🇬' },
  { url: naijaFlagImg, caption: 'Proud to be Naija 🦅' },
  { url: CATEGORIES[0].imageUrl, caption: 'The best food in the world 🍲' },
  { url: CATEGORIES[1].imageUrl, caption: 'Afrobeats conquered the globe 🎵' },
  { url: CATEGORIES[2].imageUrl, caption: 'Rich culture, deep roots 🎭' },
  { url: CATEGORIES[3].imageUrl, caption: '1996 — The Dream Team ⚽' },
  { url: CATEGORIES[4].imageUrl, caption: 'Beautiful lands of Nigeria 🗺️' },
  { url: CATEGORIES[5].imageUrl, caption: 'Nollywood — second largest film industry 🎬' },
];

export function Home() {
  const { dispatch } = useGame();
  const { progress } = useProgress();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length), 4000);
    return () => clearInterval(id);
  }, []);

  const completedCount = Object.values(progress.categories).filter(c => c.completed).length;

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Hero carousel */}
      <div className="relative h-56 overflow-hidden rounded-b-3xl bg-gray-900 flex-shrink-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={heroIndex}
            src={HERO_IMAGES[heroIndex].url}
            alt={HERO_IMAGES[heroIndex].caption}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <motion.p
            key={heroIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-sm font-semibold"
          >
            {HERO_IMAGES[heroIndex].caption}
          </motion.p>
          <div className="flex gap-1.5 mt-2">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${i === heroIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* App title */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-xl px-3 py-1.5">
            <img src={logoImg} alt="Showcase Nigeria logo" className="w-6 h-6 object-contain" />
            <span className="text-white font-black text-sm tracking-wide">SHOWCASE NIGERIA</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 pt-5">
        {/* Greeting + streak */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">
              {progress.username ? `Howdy, ${progress.username}! 👋` : 'Welcome, User!'}
            </h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">
              How much you know about Nigeria?
            </p>
          </div>
          {progress.currentStreak >= 2 && (
            <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/40 rounded-xl px-3 py-2">
              <Flame size={16} className="text-orange-500" />
              <span className="text-sm font-bold text-orange-600">{progress.currentStreak}</span>
            </div>
          )}
        </div>

        {/* Quick play button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => dispatch({ type: 'SET_TAB', tab: 'categories' })}
          className="w-full bg-nigerian-green text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-nigerian-green/30"
        >
          <div className="flex items-center gap-3">
            <PlayCircle size={28} />
            <div className="text-left">
              <p className="font-black text-base">Start Quiz</p>
              <p className="text-xs text-white/70">Pick a category and test yourself</p>
            </div>
          </div>
          <ChevronRight size={20} className="opacity-70" />
        </motion.button>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Score', value: progress.totalScore.toLocaleString(), emoji: '⭐' },
            { label: 'Categories', value: `${completedCount}/6`, emoji: '🎯' },
            { label: 'Games', value: progress.totalGamesPlayed.toString(), emoji: '🎮' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="text-xl">{stat.emoji}</div>
              <div className="font-black text-gray-900 dark:text-white text-sm mt-0.5">{stat.value}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Category quick links */}
        <div>
          <h2 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-3">Categories</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {CATEGORIES.map(cat => {
              const catProgress = progress.categories[cat.id];
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch({ type: 'SET_TAB', tab: 'categories' })}
                  className={`bg-gradient-to-br ${cat.bgGradient} rounded-2xl p-3 text-center relative overflow-hidden`}
                >
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <p className="text-white font-bold text-[11px] leading-tight">{cat.label}</p>
                  {catProgress?.completed && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white/30 rounded-full flex items-center justify-center">
                      <span className="text-[8px]">✓</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Fun fact */}
        <div className="bg-festive-gold/10 dark:bg-festive-gold/5 border border-festive-gold/20 rounded-2xl p-4">
          <p className="text-xs font-bold text-festive-gold-dark mb-1">🇳🇬 Did You Know?</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Nigeria has over 250 ethnic groups and is Africa's most populous nation with over 220 million people!
          </p>
        </div>
      </div>
    </div>
  );
}
