import { motion, AnimatePresence } from 'framer-motion';

const Digit = ({ value }) => {
  return (
    <div className="relative h-10 w-6 flex items-center justify-center overflow-hidden font-mono font-bold text-2xl">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0, rotateX: -90 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -20, opacity: 0, rotateX: 90 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const AnimatedNumber = ({ value }) => {
  const digits = value.toString().split('');

  return (
    <div className="flex items-center">
      {digits.map((digit, i) => (
        <Digit key={i} value={digit} />
      ))}
    </div>
  );
};

export default AnimatedNumber;
