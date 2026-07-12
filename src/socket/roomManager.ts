import type { Room, RoomPlayer } from '../types/room.js';
import type { QuestionPayload } from '../types/events.js';
import type { RoomPublic } from '../types/events.js';

const rooms = new Map<string, Room>();

function generateCode(): string {
  let code: string;
  do {
    code = Math.random().toString(36).slice(2, 8).toUpperCase();
  } while (rooms.has(code));
  return code;
}

export function createRoom(
  hostSocketId: string,
  username: string,
  categoryId: string,
  questions: QuestionPayload[]
): Room {
  const code = generateCode();
  const host: RoomPlayer = {
    socketId: hostSocketId,
    username,
    isHost: true,
    score: 0,
    streak: 0,
    hasAnswered: false,
    answeredAt: null,
  };
  const room: Room = {
    code,
    hostSocketId,
    categoryId,
    status: 'waiting',
    players: [host],
    questions,
    currentQuestionIndex: -1,
    questionDeadline: null,
    questionTimer: null,
  };
  rooms.set(code, room);
  return room;
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code);
}

export function deleteRoom(code: string): void {
  const room = rooms.get(code);
  if (room?.questionTimer) clearTimeout(room.questionTimer);
  rooms.delete(code);
}

export function addPlayer(room: Room, socketId: string, username: string): RoomPlayer {
  const player: RoomPlayer = {
    socketId,
    username,
    isHost: false,
    score: 0,
    streak: 0,
    hasAnswered: false,
    answeredAt: null,
  };
  room.players.push(player);
  return player;
}

export function removePlayer(room: Room, socketId: string): RoomPlayer | undefined {
  const idx = room.players.findIndex(p => p.socketId === socketId);
  if (idx === -1) return undefined;
  const [player] = room.players.splice(idx, 1);
  if (room.players.length > 0 && player.isHost) {
    room.players[0].isHost = true;
    room.hostSocketId = room.players[0].socketId;
  }
  return player;
}

export function toPublic(room: Room): RoomPublic {
  return {
    code: room.code,
    categoryId: room.categoryId,
    status: room.status,
    players: room.players.map(p => ({
      socketId: p.socketId,
      username: p.username,
      isHost: p.isHost,
      score: p.score,
      streak: p.streak,
      hasAnswered: p.hasAnswered,
      answeredAt: p.answeredAt,
    })),
    currentQuestionIndex: room.currentQuestionIndex,
    totalQuestions: room.questions.length,
    questionDeadline: room.questionDeadline,
  };
}

export function resetAnswers(room: Room): void {
  room.players.forEach(p => {
    p.hasAnswered = false;
    p.answeredAt = null;
  });
}

export function allAnswered(room: Room): boolean {
  return room.players.every(p => p.hasAnswered);
}

export function getAllRooms(): Map<string, Room> {
  return rooms;
}
