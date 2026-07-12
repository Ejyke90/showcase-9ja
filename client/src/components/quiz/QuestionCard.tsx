import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../../types/quiz';
import { AnswerButton } from './AnswerButton';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  revealed: boolean;
  onAnswer: (optionId: string) => void;
}

const DIFFICULTY_COLORS = {
  easy: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
  medium: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30',
  hard: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
};

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedOptionId,
  revealed,
  onAnswer,
}: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col gap-4"
      >
        {/* Progress + meta */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-gray-400 font-medium">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${DIFFICULTY_COLORS[question.difficulty]}`}>
            {question.difficulty}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-1">
          <motion.div
            className="h-full bg-nigerian-green rounded-full"
            initial={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Question text */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white font-semibold text-base leading-relaxed">
            {question.question}
          </p>
          <p className="text-xs text-festive-gold font-medium mt-1.5">
            +{question.pointValue} pts
          </p>
        </div>

        {/* Answer options */}
        <div className="flex flex-col gap-2.5">
          {question.options.map((opt, i) => (
            <AnswerButton
              key={opt.id}
              option={opt}
              index={i}
              selected={selectedOptionId === opt.id}
              revealed={revealed}
              isCorrect={opt.id === question.correctOptionId}
              disabled={revealed || selectedOptionId !== null}
              onClick={onAnswer}
            />
          ))}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-nigerian-green/5 dark:bg-nigerian-green/10 border border-nigerian-green/20 rounded-2xl p-4 overflow-hidden"
            >
              <p className="text-xs font-semibold text-nigerian-green mb-1">Did you know?</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{question.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
