import type { Question } from './quiz';

export type RoomStatus = 'waiting' | 'countdown' | 'playing' | 'results';

export interface RoomPlayer {
  socketId: string;
  username: string;
  isHost: boolean;
  score: number;
  streak: number;
  hasAnswered: boolean;
  answeredAt: number | null;
}

export interface Room {
  code: string;
  categoryId: string;
  status: RoomStatus;
  players: RoomPlayer[];
  currentQuestionIndex: number;
  totalQuestions: number;
  questionDeadline: number | null;
}

export interface MultiplayerState {
  room: Room | null;
  currentQuestion: Question | null;
  questionIndex: number;
  totalQuestions: number;
  deadline: number | null;
  lastAnswerResult: AnswerResult | null;
  gameOver: GameOverPayload | null;
  countdown: number | null;
  error: string | null;
  answeredCount: number;
}

export interface AnswerResult {
  correct: boolean;
  correctOptionId: string;
  pointsEarned: number;
  newScore: number;
  explanation: string;
}

export interface GameOverPayload {
  finalScores: { username: string; score: number }[];
  winner: string;
}

export const INITIAL_MP_STATE: MultiplayerState = {
  room: null,
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 10,
  deadline: null,
  lastAnswerResult: null,
  gameOver: null,
  countdown: null,
  error: null,
  answeredCount: 0,
};
