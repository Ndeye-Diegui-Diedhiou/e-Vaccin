import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const configs = {
    success: { icon: <CheckCircle className="text-evaccin-success" />, bg: 'border-evaccin-success' },
    error: { icon: <XCircle className="text-evaccin-danger" />, bg: 'border-evaccin-danger' },
    info: { icon: <Info className="text-evaccin-accent" />, bg: 'border-evaccin-accent' }
  };

  const config = configs[type] || configs.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`glass-card fixed bottom-6 right-6 flex items-center gap-4 p-4 min-w-[300px] border-l-4 ${config.bg} z-[9999]`}
    >
      <div className="text-2xl">{config.icon}</div>
      <div className="flex-1">
        <p className="font-bold text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <X size={18} />
      </button>
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${type === 'success' ? 'bg-evaccin-success' : type === 'error' ? 'bg-evaccin-danger' : 'bg-evaccin-accent'}`}
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
};

export default Toast;
