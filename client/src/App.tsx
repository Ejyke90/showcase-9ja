import { createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import { BottomNav } from './components/ui/BottomNav';
import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { QuizPlay } from './pages/QuizPlay';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { useDarkMode } from './hooks/useDarkMode';

interface DarkModeCtx { isDark: boolean; toggle: () => void; }
export const DarkModeContext = createContext<DarkModeCtx>({ isDark: false, toggle: () => { } });
export const useDark = () => useContext(DarkModeContext);

function AppContent() {
  const { state } = useGame();
  const { activeTab, session } = state;
  const showQuiz = !!session;

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 relative">
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {showQuiz ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="min-h-full"
            >
              <QuizPlay />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="min-h-full"
            >
              {activeTab === 'home' && <Home />}
              {activeTab === 'categories' && <Categories />}
              {activeTab === 'leaderboard' && <Leaderboard />}
              {activeTab === 'profile' && <Profile />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  const darkMode = useDarkMode();
  return (
    <DarkModeContext.Provider value={darkMode}>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </DarkModeContext.Provider>
  );
}
