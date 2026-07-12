import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import type { MultiplayerState, Room, AnswerResult, GameOverPayload } from '../types/multiplayer';
import type { Question } from '../types/quiz';
import { INITIAL_MP_STATE } from '../types/multiplayer';

const PENDING_KEY = 'snv2_pending_room';

export function useRoom() {
  const socket = useSocket();
  const [state, setState] = useState<MultiplayerState>(INITIAL_MP_STATE);

  const update = useCallback((patch: Partial<MultiplayerState>) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    const handlers = {
      room_joined: ({ room }: { room: Room }) => {
        localStorage.setItem(PENDING_KEY, JSON.stringify({ roomCode: room.code }));
        update({ room, error: null, gameOver: null, lastAnswerResult: null, countdown: null });
      },
      room_updated: ({ room }: { room: Room }) => update({ room }),
      game_countdown: ({ startsIn }: { startsIn: number }) => update({ countdown: startsIn }),
      new_question: ({
        question,
        index,
        total,
        deadline,
      }: {
        question: Question;
        index: number;
        total: number;
        deadline: number;
      }) =>
        update({
          currentQuestion: question,
          questionIndex: index,
          totalQuestions: total,
          deadline,
          lastAnswerResult: null,
          countdown: null,
          answeredCount: 0,
        }),
      answer_result: (result: AnswerResult) => update({ lastAnswerResult: result }),
      player_answered: ({ answeredCount }: { answeredCount: number }) =>
        update({ answeredCount }),
      round_end: ({ scores }: { scores: { username: string; score: number }[] }) => {
        setState(prev => ({
          ...prev,
          room: prev.room
            ? {
                ...prev.room,
                players: prev.room.players.map(p => ({
                  ...p,
                  score: scores.find(s => s.username === p.username)?.score ?? p.score,
                })),
              }
            : null,
        }));
      },
      game_over: (payload: GameOverPayload) => {
        localStorage.removeItem(PENDING_KEY);
        update({ gameOver: payload, currentQuestion: null });
      },
      player_left: ({ room }: { room: Room }) => update({ room }),
      error: ({ message }: { message: string }) => update({ error: message }),
    };

    for (const [event, handler] of Object.entries(handlers)) {
      socket.on(event, handler as (...args: unknown[]) => void);
    }

    // Reconnect: restore pending room
    const pending = localStorage.getItem(PENDING_KEY);
    if (pending && socket.connected) {
      try {
        const { roomCode } = JSON.parse(pending) as { roomCode: string };
        const savedUsername = localStorage.getItem('snv2_username');
        if (roomCode && savedUsername) {
          socket.emit('join_room', { roomCode, username: savedUsername });
        }
      } catch {}
    }

    return () => {
      for (const event of Object.keys(handlers)) {
        socket.off(event);
      }
    };
  }, [socket, update]);

  const createRoom = useCallback(
    (username: string, categoryId: string) => {
      localStorage.setItem('snv2_username', username);
      socket.emit('create_room', { username, categoryId });
    },
    [socket]
  );

  const joinRoom = useCallback(
    (roomCode: string, username: string) => {
      localStorage.setItem('snv2_username', username);
      socket.emit('join_room', { roomCode: roomCode.toUpperCase(), username });
    },
    [socket]
  );

  const startGame = useCallback(
    (roomCode: string) => socket.emit('start_game', { roomCode }),
    [socket]
  );

  const submitAnswer = useCallback(
    (roomCode: string, questionId: string, optionId: string) =>
      socket.emit('submit_answer', { roomCode, questionId, optionId }),
    [socket]
  );

  const leaveRoom = useCallback(
    (roomCode: string) => {
      socket.emit('leave_room', { roomCode });
      localStorage.removeItem(PENDING_KEY);
      setState(INITIAL_MP_STATE);
    },
    [socket]
  );

  const clearError = useCallback(() => update({ error: null }), [update]);

  return { state, createRoom, joinRoom, startGame, submitAnswer, leaveRoom, clearError };
}
