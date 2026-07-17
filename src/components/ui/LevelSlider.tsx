import React from 'react';

interface LevelSliderProps {
  currentLevel: number;
  onLevelChange: (newLevel: number) => void;
  label?: string;
}

export default function LevelSlider({ currentLevel, onLevelChange, label }: LevelSliderProps) {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg space-y-3 font-sans text-right">
      <div className="flex justify-between items-center text-xs">
        <span className="font-extrabold text-orange-400 font-sans text-sm">{currentLevel} / 5</span>
        <span className="text-slate-300 font-bold">{label || 'مستوى الازدهار:'}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={currentLevel}
        onChange={(e) => onLevelChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E57A44]"
        style={{
          background: `linear-gradient(to right, #E57A44 ${((currentLevel - 1) / 4) * 100}%, rgba(255,255,255,0.1) 0%)`
        }}
      />
      <div className="flex justify-between text-[9px] text-slate-500 px-1 font-sans">
        <span>1 (تأسيسي)</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5 (عظيم)</span>
      </div>
    </div>
  );
}
