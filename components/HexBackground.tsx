import React from 'react';

const HexBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#010a13]">
      {/* Deep Blue Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#091428] via-[#0A1428] to-[#010a13]" />

      {/* Hexagon Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0.4' fill='%230AC8B9' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}
      />

      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0AC8B9] rounded-full blur-[150px] opacity-10 animate-pulse" />

      {/* Fog Layers */}
      <div className="absolute inset-0 hex-fog bg-[url('https://raw.githubusercontent.com/yomotsu/camera-controls/master/examples/textures/smoke.png')] bg-cover blend-overlay opacity-20" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#010a13_90%)]" />
      
      {/* Floating Particles (CSS only for simplicity) */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#C89B3C] rounded-full blur-[1px] opacity-60 animate-bounce duration-[3000ms]" />
      <div className="absolute top-3/4 left-3/4 w-3 h-3 bg-[#0AC8B9] rounded-full blur-[2px] opacity-40 animate-bounce duration-[5000ms]" />
      <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-white rounded-full blur-[0px] opacity-80 animate-ping duration-[2000ms]" />
    </div>
  );
};

export default HexBackground;
