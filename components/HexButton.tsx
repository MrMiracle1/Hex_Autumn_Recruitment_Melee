import React from 'react';

interface HexButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const HexButton: React.FC<HexButtonProps> = ({ onClick, children, disabled = false, variant = 'primary', className = '' }) => {
  const baseStyles = "relative group px-10 py-3 font-bold uppercase tracking-widest transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Visual Styles
  const primaryStyles = "text-[#010a13] bg-[#C89B3C] hover:bg-[#E0C070] shadow-[0_0_20px_rgba(200,155,60,0.4)] hover:shadow-[0_0_30px_rgba(200,155,60,0.7)]";
  const secondaryStyles = "text-[#C89B3C] border border-[#C89B3C] bg-transparent hover:bg-[#C89B3C]/10 shadow-[0_0_15px_rgba(200,155,60,0.2)]";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variant === 'primary' ? primaryStyles : secondaryStyles} ${className} clip-path-button`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Decorative Corner lines for Hextech feel */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export default HexButton;
