import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

export function RoomCodeDisplay({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-2 uppercase tracking-wide">Room Code</p>
      <div className="flex items-center justify-center gap-3">
        <span className="text-4xl font-black tracking-widest text-nigerian-green dark:text-nigerian-green-light font-mono">
          {code}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={copy}
          aria-label="Copy room code"
          className="p-2 rounded-xl bg-nigerian-green/10 dark:bg-nigerian-green/20 text-nigerian-green dark:text-nigerian-green-light"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </motion.button>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Share this code with friends to join</p>
    </div>
  );
}
