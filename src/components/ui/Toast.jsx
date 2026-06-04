import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
    default: Sparkles
  };

  const colors = {
    success: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    error: 'text-rose-600 bg-rose-50 border-rose-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    info: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    default: 'text-[#0077b6] bg-white/95 border-cyan-200/50'
  };

  const Icon = icons[type] || icons.default;
  const colorClasses = colors[type] || colors.default;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.3 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
          className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] ${colorClasses} backdrop-blur-md border text-xs py-2.5 px-5 rounded-full shadow-lg flex items-center space-x-2 animate-underwater-float`}
        >
          <Icon size={14} className={type === 'default' ? 'animate-spin text-amber-400' : ''} />
          <span className="font-bold">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
