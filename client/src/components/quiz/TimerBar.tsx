import { motion } from 'framer-motion';
import { useTimer } from '../../hooks/useTimer';

interface TimerBarProps {
  deadline: number;
  totalMs?: number;
  onExpire?: () => void;
}

export function TimerBar({ deadline, totalMs = 30_000, onExpire }: TimerBarProps) {
  const remaining = useTimer(deadline, onExpire);
  const percent = Math.max(0, (remaining / totalMs) * 100);
  const isUrgent = remaining < 8_000;
  const secs = Math.ceil(remaining / 1000);

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full timer-bar ${
            isUrgent ? 'bg-red-500' : 'bg-nigerian-green'
          }`}
          style={{ width: `${percent}%` }}
          animate={isUrgent ? { opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
        />
      </div>
      <span
        className={`text-sm font-bold w-8 text-right tabular-nums ${
          isUrgent ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        {secs}s
      </span>
    </div>
  );
}
