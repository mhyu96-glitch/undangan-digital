import React from 'react';

const TextArea = ({ 
  label, 
  error, 
  className = '', 
  rows = 3,
  ...props 
}) => {
  const baseClasses = "w-full bg-white/90 border rounded-xl px-4 py-2 text-xs text-[#003049] placeholder-slate-400 focus:outline-none resize-none transition-all shadow-xs";
  const borderClasses = error 
    ? "border-rose-400 focus:border-rose-500" 
    : "border-cyan-200/60 focus:border-cyan-400";
  
  const textareaClasses = `${baseClasses} ${borderClasses} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-[#0077b6]">
          {label}
        </label>
      )}
      
      <textarea
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      
      {error && (
        <p className="text-xs text-rose-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default TextArea;