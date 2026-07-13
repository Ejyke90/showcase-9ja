import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';
import type { RoomPlayer } from '../../types/multiplayer';

export function PlayerList({ players }: { players: RoomPlayer[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
        Players ({players.length})
      </p>
      <AnimatePresence>
        {players.map((player, i) => (
          <motion.div
            key={player.socketId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-nigerian-green to-nigerian-green-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {player.username[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">{player.username}</span>
                {player.isHost && <Crown size={12} className="text-festive-gold flex-shrink-0" />}
              </div>
              {player.score > 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">{player.score.toLocaleString()} pts</span>
              )}
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
