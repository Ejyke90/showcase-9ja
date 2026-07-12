import { motion } from 'framer-motion';
import { Home, BookOpen, Users, Trophy, User } from 'lucide-react';
import { useGame, type TabId } from '../../context/GameContext';

const TABS: { id: TabId; icon: React.ComponentType<{ size: number; strokeWidth: number }>; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'categories', icon: BookOpen, label: 'Play' },
  { id: 'multiplayer', icon: Users, label: 'Multiplayer' },
  { id: 'leaderboard', icon: Trophy, label: 'Scores' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const { state, dispatch } = useGame();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-bottom">
      <div className="max-w-md mx-auto flex">
        {TABS.map(tab => {
          const active = state.activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: 'SET_TAB', tab: tab.id })}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1 relative"
              aria-label={tab.label}
            >
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-nigerian-green"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: active ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={active ? 'text-nigerian-green' : 'text-gray-400 dark:text-gray-500'}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </motion.div>
              <span
                className={`text-[10px] font-medium leading-none ${
                  active ? 'text-nigerian-green' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
