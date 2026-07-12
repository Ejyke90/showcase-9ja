import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, LogIn, ArrowLeft, X } from 'lucide-react';
import { useRoom } from '../hooks/useRoom';
import { useSocket } from '../context/SocketContext';
import { RoomCodeDisplay } from '../components/multiplayer/RoomCodeDisplay';
import { PlayerList } from '../components/multiplayer/PlayerList';
import { LiveScoreboard } from '../components/multiplayer/LiveScoreboard';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { TimerBar } from '../components/quiz/TimerBar';
import { ConfettiBlast } from '../components/ui/ConfettiBlast';
import { CATEGORIES } from '../types/quiz';
import type { CategoryId } from '../types/quiz';

type MpView = 'menu' | 'create' | 'join' | 'lobby' | 'game' | 'results';

export function MultiplayerHub() {
  const { state, createRoom, joinRoom, startGame, submitAnswer, leaveRoom, clearError } = useRoom();
  const socket = useSocket();
  const [view, setView] = useState<MpView>('menu');
  const [username, setUsername] = useState(localStorage.getItem('snv2_username') ?? '');
  const [roomCode, setRoomCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('food');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const myPlayer = state.room?.players.find(p => p.socketId === socket.id);
  const isHost = myPlayer?.isHost ?? false;

  // Navigate to lobby when room is joined
  const room = state.room;

  if (room && view === 'create') setView('lobby');
  if (room && view === 'join') setView('lobby');
  if (room?.status === 'playing' && view === 'lobby') {
    setView('game');
    setSelectedOption(null);
    setRevealed(false);
  }
  if (room?.status === 'results' && view === 'game') setView('results');
  if (state.gameOver && view !== 'results') setView('results');

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (!state.room || !state.currentQuestion || revealed) return;
      setSelectedOption(optionId);
      setRevealed(true);
      submitAnswer(state.room.code, state.currentQuestion.id, optionId);
    },
    [state.room, state.currentQuestion, revealed, submitAnswer]
  );

  // Reset local state on new question
  if (state.currentQuestion && revealed && selectedOption !== null) {
    // We keep revealed state per question - reset is handled via key prop
  }

  const handleLeave = () => {
    if (state.room) leaveRoom(state.room.code);
    setView('menu');
    setSelectedOption(null);
    setRevealed(false);
  };

  return (
    <div className="flex flex-col min-h-full pb-24">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 pt-10 pb-6 px-4">
        <div className="flex items-center gap-2">
          {view !== 'menu' && (
            <button onClick={() => { handleLeave(); setView('menu'); }} className="p-1.5 bg-white/20 rounded-xl text-white mr-1">
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h1 className="text-white font-black text-xl">Multiplayer</h1>
            <p className="text-white/60 text-xs mt-0.5">Play with friends in real-time</p>
          </div>
        </div>
      </div>

      {/* Error toast */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center justify-between"
          >
            <p className="text-red-700 text-sm font-medium">{state.error}</p>
            <button onClick={clearError}><X size={14} className="text-red-400" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* MENU */}
        {view === 'menu' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 pt-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
              <Users size={40} className="text-purple-500 mx-auto mb-2" />
              <h2 className="font-black text-gray-900 dark:text-white text-lg">Play Together!</h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Create a room or join one with a code</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setView('create')}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Create Room
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setView('join')}
              className="w-full bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-200 dark:border-purple-800 font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <LogIn size={20} /> Join Room
            </motion.button>
          </motion.div>
        )}

        {/* CREATE ROOM */}
        {view === 'create' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 pt-2">
            <h2 className="font-bold text-gray-800 dark:text-gray-200">Create a Room</h2>
            <input
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-purple-400 dark:placeholder-gray-500"
              placeholder="Your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              maxLength={20}
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-700">Choose Category</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-xl border-2 text-left flex items-center gap-2 transition-colors ${
                      selectedCategory === cat.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!username.trim()}
              onClick={() => createRoom(username.trim(), selectedCategory)}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl disabled:opacity-40"
            >
              Create Room
            </motion.button>
          </motion.div>
        )}

        {/* JOIN ROOM */}
        {view === 'join' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 pt-2">
            <h2 className="font-bold text-gray-800 dark:text-gray-200">Join a Room</h2>
            <input
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-purple-400 dark:placeholder-gray-500"
              placeholder="Your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              maxLength={20}
            />
            <input
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 text-gray-900 dark:text-white font-black text-2xl tracking-widest uppercase text-center focus:outline-none focus:border-purple-400 dark:placeholder-gray-500"
              placeholder="ROOM CODE"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
              maxLength={6}
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!username.trim() || roomCode.length < 4}
              onClick={() => joinRoom(roomCode, username.trim())}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl disabled:opacity-40"
            >
              Join Room
            </motion.button>
          </motion.div>
        )}

        {/* LOBBY */}
        {view === 'lobby' && room && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <RoomCodeDisplay code={room.code} />
            <PlayerList players={room.players} />
            {isHost ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={room.players.length < 1}
                onClick={() => startGame(room.code)}
                className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg disabled:opacity-40"
              >
                Start Game ({room.players.length} player{room.players.length !== 1 ? 's' : ''})
              </motion.button>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Waiting for host to start the game…</p>
              </div>
            )}
          </motion.div>
        )}

        {/* GAME */}
        {view === 'game' && room && state.currentQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            {/* Countdown overlay */}
            <AnimatePresence>
              {state.countdown !== null && state.countdown > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                >
                  <span className="text-[120px] font-black text-white">{state.countdown}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <LiveScoreboard players={room.players} mySocketId={socket.id} />

            <div className="text-xs text-gray-400 text-center">
              {state.answeredCount}/{room.players.length} answered
            </div>

            <TimerBar
              key={`mp-timer-${state.questionIndex}`}
              deadline={state.deadline ?? Date.now() + 30_000}
            />

            <QuestionCard
              key={state.currentQuestion.id}
              question={state.currentQuestion}
              questionIndex={state.questionIndex}
              totalQuestions={state.totalQuestions}
              selectedOptionId={selectedOption}
              revealed={revealed}
              onAnswer={handleAnswer}
            />

            {/* Answer result feedback */}
            <AnimatePresence>
              {state.lastAnswerResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-center p-4 rounded-2xl font-bold ${
                    state.lastAnswerResult.correct
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {state.lastAnswerResult.correct
                    ? `+${state.lastAnswerResult.pointsEarned} pts! 🎉`
                    : 'Wrong! Better luck next time 😅'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* RESULTS */}
        {view === 'results' && state.gameOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <ConfettiBlast active={true} />
            <div className="text-center py-4">
              <div className="text-5xl mb-3">🏆</div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Game Over!</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Winner: <span className="font-bold text-nigerian-green">{state.gameOver.winner}</span>
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              {state.gameOver.finalScores.map((s, i) => (
                <div
                  key={s.username}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-700 last:border-0 ${i === 0 ? 'bg-festive-gold/5' : ''}`}
                >
                  <span className="w-6 text-center text-sm">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                  <span className="flex-1 font-semibold text-gray-900 dark:text-white">{s.username}</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{s.score.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleLeave}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl"
            >
              Back to Menu
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
