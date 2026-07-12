import { motion } from 'framer-motion';

interface NaijaLoaderProps {
  size?: number;
  text?: string;
}

export function NaijaLoader({ size = 48, text }: NaijaLoaderProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer ring - Nigerian green */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-nigerian-green"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        {/* Middle ring - gold */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-festive-gold"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner dot - green */}
        <div className="absolute inset-4 rounded-full bg-nigerian-green opacity-30" />
      </div>
      {text && (
        <motion.p
          className="text-sm text-gray-500 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
