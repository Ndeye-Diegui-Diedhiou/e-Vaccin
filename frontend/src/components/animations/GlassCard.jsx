import { motion } from 'framer-motion';
import { hoverLift, buttonTap } from '../../motion.config';

const GlassCard = ({ children, className = "", noHover = false }) => {
  return (
    <motion.div
      className={`glass-card p-6 ${className}`}
      {...(!noHover ? hoverLift : {})}
      {...buttonTap}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
