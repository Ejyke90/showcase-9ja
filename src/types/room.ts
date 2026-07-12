export type RoomStatus = 'waiting' | 'countdown' | 'playing' | 'results';

export interface RoomPlayer {
  socketId: string;
  username: string;
  isHost: boolean;
  score: number;
  streak: number;
  answeredAt: number | null;
  hasAnswered: boolean;
}

export interface Room {
  code: string;
  hostSocketId: string;
  categoryId: string;
  status: RoomStatus;
  players: RoomPlayer[];
  questions: import('./events.js').QuestionPayload[];
  currentQuestionIndex: number;
  questionDeadline: number | null;
  questionTimer: ReturnType<typeof setTimeout> | null;
}
