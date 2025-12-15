
import React, { useState, useEffect } from 'react';
import { GameItem, Tier } from '../types';
import { RefreshCw, MapPin } from 'lucide-react';

interface HexCardProps {
  item: GameItem;
  index: number;
  isSelected: boolean;
  canReroll: boolean;
  onSelect: (item: GameItem) => void;
  onReroll: (index: number) => void;
  disabled: boolean;
  isSmall?: boolean; // For inventory display
}

const getTierStyles = (tier: Tier) => {
  switch (tier) {
    case Tier.PRISMATIC:
      return {
        borderGradient: "bg-gradient-to-b from-teal-300 via-purple-500 to-teal-300",
        glowColor: "rgba(10, 200, 185, 0.8)",
        textColor: "text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-purple-200",
        iconColor: "text-teal-400",
        shadow: "shadow-[0_0_20px_rgba(10,200,185,0.4)]"
      };
    case Tier.GOLD:
      return {
        borderGradient: "bg-gradient-to-b from-[#F0E6D2] via-[#C89B3C] to-[#F0E6D2]",
        glowColor: "rgba(200, 155, 60, 0.6)",
        textColor: "text-[#C89B3C]",
        iconColor: "text-[#C89B3C]",
        shadow: "shadow-[0_0_20px_rgba(200,155,60,0.3)]"
      };
    case Tier.SILVER:
    default:
      return {
        borderGradient: "bg-gradient-to-b from-slate-300 via-slate-500 to-slate-300",
        glowColor: "rgba(148, 163, 184, 0.5)",
        textColor: "text-slate-300",
        iconColor: "text-slate-400",
        shadow: "shadow-[0_0_15px_rgba(148,163,184,0.2)]"
      };
  }
};

const HexCard: React.FC<HexCardProps> = ({ 
  item, 
  index, 
  isSelected, 
  canReroll, 
  onSelect, 
  onReroll, 
  disabled,
  isSmall = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    // Staggered entrance animation
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, index * 150 + 50); 
    return () => clearTimeout(timer);
  }, [index, item.id]); // Re-trigger on item change (reroll)

  const styles = getTierStyles(item.tier);
  
  // Dimensions
  const widthClass = isSmall ? "w-[110px]" : "w-[240px] md:w-[260px]";
  const heightClass = isSmall ? "h-[160px]" : "h-[380px] md:h-[420px]";
  const baseClasses = `relative ${widthClass} ${heightClass} transition-all duration-500 ease-out cursor-pointer select-none perspective-1000`;
  
  const hoverTransform = isHovered && !disabled && !isSmall ? "scale(1.05) -translate-y-4" : "";
  const selectTransform = isSelected ? `scale(1.05) -translate-y-4 ring-2 ring-offset-2 ring-offset-black ${item.tier === Tier.PRISMATIC ? 'ring-teal-400' : item.tier === Tier.GOLD ? 'ring-[#C89B3C]' : 'ring-slate-400'}` : "";
  const fadeOut = disabled && !isSelected && !isSmall ? "opacity-40 grayscale scale-95 blur-[1px]" : "opacity-100";

  const glowStyle = {
    boxShadow: (isHovered || isSelected) && !isSmall ? `0 0 30px 5px ${styles.glowColor}` : 'none',
  };

  const handleRerollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canReroll && !disabled) {
        setHasEntered(false); // Reset animation
        onReroll(index);
    }
  };

  if (!hasEntered && !isSmall) {
      return (
        <div className="flex flex-col items-center gap-4">
             <div className={`${widthClass} ${heightClass} opacity-0`} />
             <div className="h-[30px] w-full opacity-0" />
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center gap-3 group/card">
        <div 
        className={`${baseClasses} ${hoverTransform} ${selectTransform} ${fadeOut} ${!isSmall ? 'animate-card-slam' : ''}`}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => !disabled && onSelect(item)}
        style={{ animationDelay: `${index * 0.1}s` }}
        >
        
        <div className="absolute inset-0 transition-all duration-500 rounded-sm" style={glowStyle} />

        <div className={`relative w-full h-full bg-[#010a13] ${isSmall ? 'clip-path-hextech-sm' : 'clip-path-hextech'} p-[2px]`}>
            
            {/* Animated Border based on Tier */}
            <div className={`absolute inset-0 ${styles.borderGradient} transition-colors duration-300 z-0 ${item.tier === Tier.PRISMATIC ? 'animate-pulse' : ''}`} />
            
            {/* Inner Content */}
            <div className="relative w-full h-full bg-[#091428] z-10 flex flex-col overflow-hidden">
            
            {/* Header Line */}
            <div className={`h-1 w-full ${item.tier === Tier.PRISMATIC ? 'bg-gradient-to-r from-teal-400 via-purple-500 to-teal-400' : item.tier === Tier.GOLD ? 'bg-[#C89B3C]' : 'bg-slate-400'}`} />
            
            {/* Image Area */}
            <div className="relative h-[65%] w-full overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#091428] via-transparent to-transparent z-10 opacity-90" />
                <img 
                src={item.imageUrl} 
                alt={item.name}
                className={`w-full h-full object-cover transition-transform duration-[2s] ease-in-out ${isHovered && !isSmall ? 'scale-110' : 'scale-100'}`} 
                />
                
                {/* Tier Icon Badge */}
                {!isSmall && (
                    <div className={`absolute top-2 left-2 z-20 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/20 flex items-center justify-center rounded text-xs font-bold tracking-widest ${styles.textColor}`}>
                        {item.tier}
                    </div>
                )}
            </div>

            {/* Text Content */}
            <div className={`relative flex-1 flex flex-col items-center justify-start ${isSmall ? 'pt-1 px-1' : 'pt-2 px-3'} bg-[#091428]`}>
                
                {/* Subtitle / Location */}
                {!isSmall && (
                    <div className="flex items-center gap-1 opacity-60 text-[10px] text-[#A09B8C] uppercase tracking-wider mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.subTitle}</span>
                    </div>
                )}

                {/* Name */}
                <h2 className={`${isSmall ? 'text-xs mt-1' : item.name.length > 8 ? 'text-lg' : 'text-xl'} font-bold text-center leading-tight mb-1 ${styles.textColor}`}>
                   {item.name}
                </h2>
                
                {/* Description/Stats */}
                {!isSmall && (
                    <div className="w-full mt-2">
                        <p className="text-gray-400 text-[11px] text-center line-clamp-2 px-2 italic">
                            "{item.description}"
                        </p>
                        
                        {/* Tags or Salary */}
                        <div className="mt-3 flex flex-wrap gap-1 justify-center">
                            {item.salary && (
                                <span className="px-2 py-0.5 bg-green-900/40 border border-green-500/30 text-green-400 text-[10px] rounded">
                                    {item.salary}
                                </span>
                            )}
                            {item.tags?.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-blue-900/40 border border-blue-500/30 text-blue-300 text-[10px] rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Small view simplified */}
                {isSmall && (
                    <div className={`text-[9px] opacity-70 mt-auto mb-1 ${styles.iconColor}`}>
                         {item.subTitle}
                    </div>
                )}

            </div>

            {/* Footer Line */}
            <div className={`h-1 w-full ${item.tier === Tier.PRISMATIC ? 'bg-gradient-to-r from-teal-400 via-purple-500 to-teal-400' : item.tier === Tier.GOLD ? 'bg-[#C89B3C]' : 'bg-slate-500'}`} />
            </div>
        </div>
        </div>

        {/* Reroll Button - Updated for better visibility */}
        {!isSmall && (
            <button
                onClick={handleRerollClick}
                disabled={!canReroll || disabled}
                className={`
                    relative group/btn flex items-center justify-center gap-2 px-4 py-1.5 h-[32px]
                    transition-all duration-300 clip-path-button
                    ${canReroll && !disabled 
                        ? 'bg-[#1a2c42] border border-white/40 hover:bg-[#C89B3C] hover:text-black hover:border-transparent text-white shadow-lg cursor-pointer' 
                        : 'bg-transparent border border-gray-800 text-gray-700 cursor-not-allowed opacity-30'}
                `}
            >
                <RefreshCw className={`w-3 h-3 ${canReroll && !disabled ? 'group-hover/btn:rotate-180 transition-transform duration-500' : ''}`} />
                <span className="text-xs font-bold uppercase tracking-wider">重随</span>
            </button>
        )}
    </div>
  );
};

export default HexCard;
