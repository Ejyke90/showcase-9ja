import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { QuizSession, Question, CategoryId, QuizResult } from '../types/quiz';

export type TabId = 'home' | 'categories' | 'leaderboard' | 'profile';

interface GameState {
  activeTab: TabId;
  session: QuizSession | null;
  lastResult: QuizResult | null;
}

type GameAction =
  | { type: 'SET_TAB'; tab: TabId }
  | { type: 'START_SOLO'; categoryId: CategoryId; questions: Question[] }
  | { type: 'ANSWER'; questionId: string; optionId: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE'; finishedAt: number }
  | { type: 'SET_RESULT'; result: QuizResult }
  | { type: 'RESET_SESSION' };

const initialState: GameState = {
  activeTab: 'home',
  session: null,
  lastResult: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };

    case 'START_SOLO':
      return {
        ...state,
        activeTab: 'categories',
        session: {
          mode: 'solo',
          categoryId: action.categoryId,
          questions: action.questions,
          currentIndex: 0,
          answers: {},
          startedAt: Date.now(),
          finishedAt: null,
        },
        lastResult: null,
      };

    case 'ANSWER': {
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          answers: { ...state.session.answers, [action.questionId]: action.optionId },
        },
      };
    }

    case 'NEXT_QUESTION': {
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, currentIndex: state.session.currentIndex + 1 },
      };
    }

    case 'COMPLETE': {
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, finishedAt: action.finishedAt },
      };
    }

    case 'SET_RESULT':
      return { ...state, lastResult: action.result };

    case 'RESET_SESSION':
      return { ...state, session: null, lastResult: null };

    default:
      return state;
  }
}

const GameContext = createContext<{ state: GameState; dispatch: Dispatch<GameAction> } | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
