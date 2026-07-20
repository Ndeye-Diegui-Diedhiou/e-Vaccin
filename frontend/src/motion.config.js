export const spring = { type: "spring", stiffness: 300, damping: 30 }
export const smooth = { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }
export const entrance = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: smooth }

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const hoverLift = {
  whileHover: { 
    y: -4, 
    boxShadow: "0 20px 25px -5px rgba(10, 61, 98, 0.1), 0 10px 10px -5px rgba(10, 61, 98, 0.04)" 
  }
};

export const buttonTap = {
  whileTap: { scale: 0.97 }
};
