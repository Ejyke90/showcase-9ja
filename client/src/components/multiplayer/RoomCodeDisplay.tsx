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
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
      <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Room Code</p>
      <div className="flex items-center justify-center gap-3">
        <span className="text-4xl font-black tracking-widest text-nigerian-green font-mono">
          {code}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={copy}
          className="p-2 rounded-xl bg-nigerian-green/10 text-nigerian-green"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </motion.button>
      </div>
      <p className="text-xs text-gray-400 mt-2">Share this code with friends to join</p>
    </div>
  );
}
