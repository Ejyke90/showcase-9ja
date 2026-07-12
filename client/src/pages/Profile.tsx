import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Flame, Star, Target, Moon, Sun } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { BADGES } from '../types/progress';
import { useDark } from '../App';

export function Profile() {
  const { progress, setUsername } = useProgress();
  const { isDark, toggle: toggleDark } = useDark();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.username);

  const earnedBadges = BADGES.filter(b => progress.badges.includes(b.id));
  const unearnedBadges = BADGES.filter(b => !progress.badges.includes(b.id));
  const completedCats = Object.values(progress.categories).filter(c => c.completed).length;

  const saveName = () => {
    if (nameInput.trim()) setUsername(nameInput.trim());
    setEditingName(false);
  };

  return (
    <div className="flex flex-col min-h-full pb-24">
      <div className="bg-gradient-to-br from-nigerian-green to-nigerian-green-dark pt-10 pb-8 px-4 relative">
        <button
          onClick={toggleDark}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 text-white"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="flex flex-col items-center gap-3">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-black text-white">
            {progress.username ? progress.username[0].toUpperCase() : '🦅'}
          </div>

          {/* Username */}
          {editingName ? (
            <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-3 py-2">
              <input
                className="bg-transparent text-white font-bold text-lg text-center outline-none placeholder-white/50 w-32"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveName()}
                autoFocus
                maxLength={20}
                placeholder="Enter name"
              />
              <button onClick={saveName} className="text-white/80 text-sm font-bold">Save</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-white font-black text-xl">
                {progress.username || 'Anonymous Naija'}
              </h1>
              <button onClick={() => setEditingName(true)} className="text-white/60">
                <Edit3 size={14} />
              </button>
            </div>
          )}

          {/* Streak */}
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5 text-white/90">
              <Flame size={16} className="text-orange-300" />
              <span className="text-sm font-bold">{progress.currentStreak} day streak</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <span className="text-white/70 text-xs">Best: {progress.longestStreak} days</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Star, value: progress.totalScore.toLocaleString(), label: 'Total Score', color: 'text-festive-gold' },
            { icon: Target, value: `${completedCats}/6`, label: 'Completed', color: 'text-nigerian-green' },
            { icon: Flame, value: progress.totalGamesPlayed.toString(), label: 'Games Played', color: 'text-orange-500' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                <Icon size={20} className={`mx-auto mb-1 ${stat.color}`} />
                <p className="font-black text-gray-900 dark:text-white text-lg leading-none">{stat.value}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Earned badges */}
        {earnedBadges.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-3">
              Badges Earned ({earnedBadges.length}/{BADGES.length})
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {earnedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-festive-gold/30 dark:border-festive-gold/20 shadow-sm"
                >
                  <div className="text-2xl mb-1">{badge.emoji}</div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{badge.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{badge.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Locked badges */}
        {unearnedBadges.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-400 dark:text-gray-500 text-sm mb-3">Locked Badges</h2>
            <div className="grid grid-cols-2 gap-2">
              {unearnedBadges.map(badge => (
                <div
                  key={badge.id}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 opacity-60"
                >
                  <div className="text-2xl mb-1 grayscale">{badge.emoji}</div>
                  <p className="font-bold text-gray-500 dark:text-gray-400 text-sm">{badge.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No badges yet */}
        {earnedBadges.length === 0 && unearnedBadges.length === BADGES.length && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center shadow-sm">
            <p className="text-4xl mb-2">🏅</p>
            <p className="font-bold text-gray-700 dark:text-gray-300">No badges yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Complete quizzes to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  );
}
