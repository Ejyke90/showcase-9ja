import { motion } from 'framer-motion';
import type { RoomPlayer } from '../../types/multiplayer';

interface LiveScoreboardProps {
  players: RoomPlayer[];
  mySocketId?: string;
}

export function LiveScoreboard({ players, mySocketId }: LiveScoreboardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="bg-nigerian-green px-4 py-2">
        <p className="text-white text-xs font-bold uppercase tracking-wide">Live Scoreboard</p>
      </div>
      {sorted.map((player, rank) => {
        const isMe = player.socketId === mySocketId;
        const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`;
        return (
          <motion.div
            key={player.socketId}
            layout
            className={`flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-0 ${isMe ? 'bg-nigerian-green/5 dark:bg-nigerian-green/10' : ''}`}
          >
            <span className="w-6 text-center text-sm">{medal}</span>
            <div className="flex-1 min-w-0">
              <span className={`text-sm font-semibold truncate ${isMe ? 'text-nigerian-green dark:text-nigerian-green-light' : 'text-gray-800 dark:text-gray-200'}`}>
                {player.username}{isMe ? ' (you)' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {player.hasAnswered && (
                <span className="text-xs text-green-500">✓</span>
              )}
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 tabular-nums">
                {player.score.toLocaleString()}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
