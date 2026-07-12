import type { Server, Socket } from 'socket.io';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { QuestionPayload } from '../types/events.js';
import {
  createRoom,
  getRoom,
  getAllRooms,
  deleteRoom,
  addPlayer,
  removePlayer,
  toPublic,
  resetAnswers,
  allAnswered,
} from './roomManager.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATEGORIES = ['food', 'music', 'culture', 'sports', 'geography', 'nollywood'];
const QUESTION_TIME_MS = 30_000;
const NEXT_QUESTION_DELAY_MS = 3_000;
const COUNTDOWN_SEC = 3;

function loadQuestions(categoryId: string): QuestionPayload[] {
  const path = join(__dirname, '../../data', `${categoryId}.json`);
  const all: QuestionPayload[] = JSON.parse(readFileSync(path, 'utf-8'));
  return [...all].sort(() => Math.random() - 0.5).slice(0, 10);
}

function calcPoints(basePoints: number, remainingMs: number): number {
  const multiplier = Math.max(0.1, remainingMs / QUESTION_TIME_MS);
  return Math.max(10, Math.round((basePoints * multiplier) / 10) * 10);
}

function advanceQuestion(io: Server, roomCode: string): void {
  const room = getRoom(roomCode);
  if (!room) return;

  if (room.questionTimer) {
    clearTimeout(room.questionTimer);
    room.questionTimer = null;
  }

  const nextIdx = room.currentQuestionIndex + 1;

  if (nextIdx >= room.questions.length) {
    room.status = 'results';
    const sorted = [...room.players].sort((a, b) => b.score - a.score);
    io.to(roomCode).emit('game_over', {
      finalScores: sorted.map(p => ({ username: p.username, score: p.score })),
      winner: sorted[0]?.username ?? 'No one',
    });
    return;
  }

  room.currentQuestionIndex = nextIdx;
  room.status = 'playing';
  resetAnswers(room);

  const question = room.questions[nextIdx];
  const deadline = Date.now() + QUESTION_TIME_MS;
  room.questionDeadline = deadline;

  // Strip correct answer before sending
  const safeQuestion = {
    id: question.id,
    categoryId: question.categoryId,
    question: question.question,
    options: question.options,
    difficulty: question.difficulty,
    pointValue: question.pointValue,
  };

  io.to(roomCode).emit('new_question', {
    question: safeQuestion,
    index: nextIdx,
    total: room.questions.length,
    deadline,
  });

  room.questionTimer = setTimeout(() => {
    const r = getRoom(roomCode);
    if (!r) return;
    const scores = r.players.map(p => ({ username: p.username, score: p.score }));
    io.to(roomCode).emit('round_end', { scores, nextQuestionIn: NEXT_QUESTION_DELAY_MS });
    room.questionTimer = setTimeout(() => advanceQuestion(io, roomCode), NEXT_QUESTION_DELAY_MS);
  }, QUESTION_TIME_MS);
}

function handleLeave(io: Server, socket: Socket, roomCode: string): void {
  const room = getRoom(roomCode);
  if (!room) return;

  const player = removePlayer(room, socket.id);
  socket.leave(roomCode);
  if (!player) return;

  if (room.players.length === 0) {
    deleteRoom(roomCode);
    return;
  }

  io.to(roomCode).emit('player_left', { username: player.username, room: toPublic(room) });
}

export function registerHandlers(io: Server, socket: Socket): void {
  socket.on('create_room', ({ username, categoryId }: { username: string; categoryId: string }) => {
    if (!username?.trim() || !CATEGORIES.includes(categoryId)) {
      socket.emit('error', { message: 'Invalid username or category.' });
      return;
    }
    const questions = loadQuestions(categoryId);
    const room = createRoom(socket.id, username.trim(), categoryId, questions);
    socket.join(room.code);
    socket.emit('room_joined', { room: toPublic(room) });
  });

  socket.on('join_room', ({ roomCode, username }: { roomCode: string; username: string }) => {
    const room = getRoom(roomCode?.toUpperCase());
    if (!room) {
      socket.emit('error', { message: 'Room not found. Check the code and try again.' });
      return;
    }
    if (room.status !== 'waiting') {
      const existing = room.players.find(p => p.username === username?.trim());
      if (existing) {
        existing.socketId = socket.id;
        socket.join(room.code);
        socket.emit('room_joined', { room: toPublic(room) });
        return;
      }
      socket.emit('error', { message: 'Game already in progress.' });
      return;
    }
    if (!username?.trim()) {
      socket.emit('error', { message: 'Username is required.' });
      return;
    }
    if (room.players.some(p => p.username === username.trim())) {
      socket.emit('error', { message: 'Username already taken in this room.' });
      return;
    }
    addPlayer(room, socket.id, username.trim());
    socket.join(room.code);
    socket.emit('room_joined', { room: toPublic(room) });
    socket.to(room.code).emit('room_updated', { room: toPublic(room) });
  });

  socket.on('start_game', ({ roomCode }: { roomCode: string }) => {
    const room = getRoom(roomCode);
    if (!room || room.hostSocketId !== socket.id) {
      socket.emit('error', { message: 'Only the host can start the game.' });
      return;
    }
    if (room.status !== 'waiting') {
      socket.emit('error', { message: 'Game already started.' });
      return;
    }
    room.status = 'countdown';
    io.to(roomCode).emit('game_countdown', { startsIn: COUNTDOWN_SEC });

    let count = COUNTDOWN_SEC;
    const tick = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(tick);
        advanceQuestion(io, roomCode);
      } else {
        io.to(roomCode).emit('game_countdown', { startsIn: count });
      }
    }, 1_000);
  });

  socket.on(
    'submit_answer',
    ({ roomCode, questionId, optionId }: { roomCode: string; questionId: string; optionId: string }) => {
      const room = getRoom(roomCode);
      if (!room || room.status !== 'playing') return;

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player || player.hasAnswered) return;

      const question = room.questions[room.currentQuestionIndex];
      if (question.id !== questionId) return;

      player.hasAnswered = true;
      player.answeredAt = Date.now();

      const correct = optionId === question.correctOptionId;
      let pointsEarned = 0;

      if (correct) {
        const remainingMs = Math.max(0, (room.questionDeadline ?? Date.now()) - Date.now());
        pointsEarned = calcPoints(question.pointValue, remainingMs);
        player.score += pointsEarned;
        player.streak += 1;
      } else {
        player.streak = 0;
      }

      socket.emit('answer_result', {
        correct,
        correctOptionId: question.correctOptionId,
        pointsEarned,
        newScore: player.score,
        explanation: question.explanation,
      });

      const answeredCount = room.players.filter(p => p.hasAnswered).length;
      io.to(roomCode).emit('player_answered', {
        username: player.username,
        answeredCount,
        totalPlayers: room.players.length,
      });

      if (allAnswered(room)) {
        if (room.questionTimer) {
          clearTimeout(room.questionTimer);
          room.questionTimer = null;
        }
        const scores = room.players.map(p => ({ username: p.username, score: p.score }));
        io.to(roomCode).emit('round_end', { scores, nextQuestionIn: NEXT_QUESTION_DELAY_MS });
        room.questionTimer = setTimeout(() => advanceQuestion(io, roomCode), NEXT_QUESTION_DELAY_MS);
      }
    }
  );

  socket.on('leave_room', ({ roomCode }: { roomCode: string }) => {
    handleLeave(io, socket, roomCode);
  });

  socket.on('disconnect', () => {
    for (const [code, room] of getAllRooms()) {
      if (room.players.some(p => p.socketId === socket.id)) {
        handleLeave(io, socket, code);
        break;
      }
    }
  });
}
