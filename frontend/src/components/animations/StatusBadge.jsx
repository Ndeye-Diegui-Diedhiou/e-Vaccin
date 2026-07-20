import { motion } from 'framer-motion';
import { Check, ArrowRight, AlertTriangle, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const configs = {
    fait: {
      color: 'bg-evaccin-success/10 text-evaccin-success',
      icon: <Check size={14} />,
      label: 'Fait',
      animate: { pathLength: 1 }
    },
    a_faire: {
      color: 'bg-evaccin-accent/10 text-evaccin-accent',
      icon: <ArrowRight size={14} />,
      label: 'À faire',
      animate: { x: [0, 3, 0] }
    },
    retard: {
      color: 'bg-evaccin-danger/10 text-evaccin-danger',
      icon: <AlertTriangle size={14} />,
      label: 'Retard',
      animate: { scale: [1, 1.1, 1] }
    },
    planifie: {
      color: 'bg-gray-100 text-gray-500',
      icon: <Clock size={14} />,
      label: 'Planifié',
      animate: { rotate: 360 }
    }
  };

  const config = configs[status] || configs.planifie;

  return (
    <motion.div
      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit ${config.color}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.span
        animate={config.animate}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {config.icon}
      </motion.span>
      {config.label}
    </motion.div>
  );
};

export default StatusBadge;
