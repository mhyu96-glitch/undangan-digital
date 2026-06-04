import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  icon: Icon,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-bold tracking-wider transition-all rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#0096c7] hover:to-[#03045e] text-white shadow-marine focus:ring-cyan-500",
    secondary: "bg-white/90 hover:bg-white text-[#0077b6] border border-cyan-200 hover:border-cyan-300 shadow-sm focus:ring-cyan-500",
    outline: "bg-transparent border-2 border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white focus:ring-cyan-500",
    ghost: "bg-transparent text-[#0077b6] hover:bg-cyan-50 focus:ring-cyan-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed pointer-events-none" 
    : "cursor-pointer";

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={16} className="mr-2" />}
      {children}
    </motion.button>
  );
};

export default Button;