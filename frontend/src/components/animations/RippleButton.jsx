import { useState, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';

const RippleButton = ({ children, onClick, className = "", variant = "primary", ...props }) => {
  const [ripples, setRipples] = useState([]);

  useLayoutEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples([...ripples, { x, y, id: Date.now() }]);
    if (onClick) onClick(e);
  };

  const variants = {
    primary: "btn-primary",
    accent: "btn-accent",
    danger: "bg-evaccin-danger text-white",
    outline: "border-2 border-evaccin-primary text-evaccin-primary hover:bg-evaccin-primary hover:text-white"
  };

  return (
    <motion.button
      className={`btn-premium relative overflow-hidden ${variants[variant] || variants.primary} ${className}`}
      onPointerDown={addRipple}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </motion.button>
  );
};

export default RippleButton;
