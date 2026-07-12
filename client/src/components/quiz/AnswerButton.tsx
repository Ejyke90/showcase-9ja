import { motion } from 'framer-motion';
import type { QuizOption } from '../../types/quiz';

interface AnswerButtonProps {
  option: QuizOption;
  index: number;
  selected: boolean;
  revealed: boolean;
  isCorrect: boolean;
  disabled: boolean;
  onClick: (id: string) => void;
}

const LABELS = ['A', 'B', 'C', 'D'];

export function AnswerButton({
  option,
  index,
  selected,
  revealed,
  isCorrect,
  disabled,
  onClick,
}: AnswerButtonProps) {
  let bg = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100';
  let labelBg = 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400';

  if (revealed) {
    if (isCorrect) {
      bg = 'bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-300';
      labelBg = 'bg-green-400 text-white';
    } else if (selected && !isCorrect) {
      bg = 'bg-red-50 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-300';
      labelBg = 'bg-red-400 text-white';
    } else {
      bg = 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500';
      labelBg = 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-500';
    }
  } else if (selected) {
    bg = 'bg-nigerian-green/10 dark:bg-nigerian-green/20 border-nigerian-green text-nigerian-green-dark dark:text-nigerian-green-light';
    labelBg = 'bg-nigerian-green text-white';
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={() => !disabled && onClick(option.id)}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-colors duration-200 ${bg}`}
    >
      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 ${labelBg}`}>
        {LABELS[index]}
      </span>
      <span className="text-sm font-medium leading-snug">{option.text}</span>
      {revealed && isCorrect && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto text-green-500"
        >
          ✓
        </motion.span>
      )}
      {revealed && selected && !isCorrect && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto text-red-500"
        >
          ✗
        </motion.span>
      )}
    </motion.button>
  );
}
