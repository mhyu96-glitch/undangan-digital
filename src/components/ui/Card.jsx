import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  animate = true,
  hover = false,
  ...props 
}) => {
  const baseClasses = "bg-white/85 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-xl";
  const cardClasses = `${baseClasses} ${className}`;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -2, transition: { duration: 0.2 } }
  };

  if (animate) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover={hover ? "hover" : undefined}
        variants={cardVariants}
        transition={{ duration: 0.4 }}
        className={cardClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;