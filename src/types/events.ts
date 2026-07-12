export interface QuizOption {
  id: string;
  text: string;
}

export interface QuestionPayload {
  id: string;
  categoryId: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  pointValue: number;
}

export interface RoomPlayer {
  socketId: string;
  username: string;
  isHost: boolean;
  score: number;
  streak: number;
  hasAnswered: boolean;
  answeredAt: number | null;
}

export interface RoomPublic {
  code: string;
  categoryId: string;
  status: string;
  players: RoomPlayer[];
  currentQuestionIndex: number;
  totalQuestions: number;
  questionDeadline: number | null;
}

// Client → Server
export interface C2S_CreateRoom { username: string; categoryId: string; }
export interface C2S_JoinRoom { roomCode: string; username: string; }
export interface C2S_StartGame { roomCode: string; }
export interface C2S_SubmitAnswer { roomCode: string; questionId: string; optionId: string; }
export interface C2S_LeaveRoom { roomCode: string; }

// Server → Client
export interface S2C_RoomJoined { room: RoomPublic; }
export interface S2C_RoomUpdated { room: RoomPublic; }
export interface S2C_GameCountdown { startsIn: number; }
export interface S2C_NewQuestion { question: QuestionPayload; index: number; total: number; deadline: number; }
export interface S2C_AnswerResult { correct: boolean; correctOptionId: string; pointsEarned: number; newScore: number; explanation: string; }
export interface S2C_PlayerAnswered { username: string; answeredCount: number; totalPlayers: number; }
export interface S2C_RoundEnd { scores: { username: string; score: number }[]; nextQuestionIn: number; }
export interface S2C_GameOver { finalScores: { username: string; score: number }[]; winner: string; }
export interface S2C_PlayerLeft { username: string; room: RoomPublic; }
export interface S2C_Error { message: string; }
