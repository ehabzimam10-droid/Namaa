import React from 'react';

interface BankSVGProps {
  level: number;
}

export default function BankSVG({ level }: BankSVGProps) {
  const lvl = Math.min(5, Math.max(1, level));

  if (lvl === 1) {
    // Level 1: Tiny 2D foundation / Gold vault door flat on the floor
    return (
      <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-xl animate-pulse">
        <defs>
          <linearGradient id="bankBaseL1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A4365" />
            <stop offset="100%" stopColor="#1A202C" />
          </linearGradient>
          <linearGradient id="vaultGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F6E05E" />
            <stop offset="100%" stopColor="#D69E2E" />
          </linearGradient>
        </defs>
        {/* Foundation */}
        <polygon points="50,10 90,30 50,50 10,30" fill="url(#bankBaseL1)" stroke="#4A5568" strokeWidth="1" />
        {/* Flat Vault Door */}
        <circle cx="50" cy="30" r="10" fill="#171923" stroke="url(#vaultGold)" strokeWidth="1.5" />
        <circle cx="50" cy="30" r="4" fill="url(#vaultGold)" />
        {/* Wheel Spokes */}
        <line x1="50" y1="20" x2="50" y2="40" stroke="url(#vaultGold)" strokeWidth="1" />
        <line x1="40" y1="30" x2="60" y2="30" stroke="url(#vaultGold)" strokeWidth="1" />
      </svg>
    );
  }

  if (lvl === 2) {
    // Level 2: Small safe box/chest base
    return (
      <svg viewBox="0 0 110 100" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="ironL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="100%" stopColor="#2D3748" />
          </linearGradient>
          <linearGradient id="ironR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D3748" />
            <stop offset="100%" stopColor="#1A202C" />
          </linearGradient>
        </defs>
        {/* Base */}
        <polygon points="55,35 90,50 55,65 20,50" fill="#1A202C" />
        <polygon points="20,50 55,65 55,75 20,60" fill="url(#ironL)" />
        <polygon points="55,65 90,50 90,60 55,75" fill="url(#ironR)" />

        {/* Small chest */}
        <polygon points="35,42 55,50 55,65 35,57" fill="url(#ironL)" stroke="#718096" strokeWidth="0.5" />
        <polygon points="55,50 75,42 75,57 55,65" fill="url(#ironR)" stroke="#4A5568" strokeWidth="0.5" />
        {/* Golden Lock */}
        <polygon points="52,48 58,45 58,55 52,58" fill="#D4AF37" />
      </svg>
    );
  }

  if (lvl === 3) {
    // Level 3: Standard 3D neoclassical style bank building
    return (
      <svg viewBox="0 0 130 120" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="bankWallL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2B6CB0" />
            <stop offset="100%" stopColor="#2A4365" />
          </linearGradient>
          <linearGradient id="bankWallR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A4365" />
            <stop offset="100%" stopColor="#1A202C" />
          </linearGradient>
          <linearGradient id="goldRoof" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ECC94B" />
            <stop offset="100%" stopColor="#B7791F" />
          </linearGradient>
        </defs>

        {/* Base */}
        <polygon points="65,55 110,75 65,95 20,75" fill="#1A202C" />

        {/* Main Bank House */}
        <polygon points="30,70 65,85 65,110 30,95" fill="url(#bankWallL)" />
        <polygon points="65,85 100,70 100,95 65,110" fill="url(#bankWallR)" />

        {/* Roof structure (Neoclassical triangle front) */}
        <polygon points="65,45 105,65 65,85 25,65" fill="url(#goldRoof)" stroke="#975A16" strokeWidth="0.5" />
        <polygon points="65,30 65,45 25,65 65,30" fill="#ECC94B" stroke="#B7791F" strokeWidth="0.5" />
        <polygon points="65,30 105,65 65,45 65,30" fill="#B7791F" />

        {/* Golden columns */}
        <line x1="38" y1="78" x2="38" y2="92" stroke="#ECC94B" strokeWidth="2.5" />
        <line x1="52" y1="84" x2="52" y2="98" stroke="#ECC94B" strokeWidth="2.5" />
        <line x1="78" y1="84" x2="78" y2="98" stroke="#ECC94B" strokeWidth="2.5" />
        <line x1="92" y1="78" x2="92" y2="92" stroke="#ECC94B" strokeWidth="2.5" />

        {/* Arched Gate */}
        <path d="M 60,94 Q 65,88 70,94 L 70,107 L 60,105 Z" fill="#D4AF37" />
      </svg>
    );
  }

  if (lvl === 4) {
    // Level 4: Vault fortress with gear detailing
    return (
      <svg viewBox="0 0 150 140" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="vaultL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="100%" stopColor="#2D3748" />
          </linearGradient>
          <linearGradient id="vaultR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D3748" />
            <stop offset="100%" stopColor="#1A202C" />
          </linearGradient>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ECC94B" />
            <stop offset="100%" stopColor="#D69E2E" />
          </linearGradient>
        </defs>

        {/* Base */}
        <polygon points="75,65 125,85 75,105 25,85" fill="#1A202C" />

        {/* Vault body */}
        <polygon points="35,75 75,90 75,115 35,100" fill="url(#vaultL)" />
        <polygon points="75,90 115,75 115,100 75,115" fill="url(#vaultR)" />

        {/* Flat top roof */}
        <polygon points="75,55 118,73 75,91 32,73" fill="url(#vaultL)" stroke="#718096" strokeWidth="0.5" />
        
        {/* Upper mini safe */}
        <polygon points="50,60 75,70 75,85 50,75" fill="url(#vaultL)" />
        <polygon points="75,70 100,60 100,75 75,85" fill="url(#vaultR)" />
        <polygon points="75,45 102,57 75,69 48,57" fill="url(#brassGrad)" />

        {/* Giant Vault Lock Gear (Center-Right wall) */}
        <circle cx="95" cy="85" r="10" fill="#1A202C" stroke="url(#brassGrad)" strokeWidth="2.5" className="animate-spin" style={{ transformOrigin: '95px 85px', animationDuration: '8s' }} />
        <circle cx="95" cy="85" r="4" fill="url(#brassGrad)" />
      </svg>
    );
  }

  // Level 5: A massive, glowing skyscraper vault with mechanical gears and floating coins
  return (
    <svg viewBox="0 0 180 200" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,180,216,0.35)] overflow-visible">
      <defs>
        <linearGradient id="sciFiL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="40%" stopColor="#3182CE" />
          <stop offset="100%" stopColor="#1A365D" />
        </linearGradient>
        <linearGradient id="sciFiR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2B6CB0" />
          <stop offset="60%" stopColor="#1A365D" />
          <stop offset="100%" stopColor="#0A1128" />
        </linearGradient>
        <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F7FA" />
          <stop offset="50%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#006064" />
        </linearGradient>
        <linearGradient id="goldBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFF" />
          <stop offset="40%" stopColor="#ECC94B" />
          <stop offset="100%" stopColor="#B7791F" />
        </linearGradient>
        <filter id="cyanGlowF">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Floating Shiny Coins (Animated) */}
      <g className="animate-pulse">
        <circle cx="30" cy="80" r="3" fill="#D4AF37" filter="url(#cyanGlowF)" />
        <circle cx="45" cy="50" r="4.5" fill="#D4AF37" filter="url(#cyanGlowF)" />
        <circle cx="150" cy="60" r="3.5" fill="#D4AF37" filter="url(#cyanGlowF)" />
        <circle cx="140" cy="110" r="2.5" fill="#D4AF37" />
        <circle cx="60" cy="30" r="3" fill="#E2E8F0" filter="url(#cyanGlowF)" />
      </g>

      {/* Stepped Base Plate */}
      <polygon points="90,110 160,140 90,170 20,140" fill="#0F172A" stroke="#00E5FF" strokeWidth="0.5" />
      <polygon points="20,140 90,170 90,178 20,148" fill="#090D16" />
      <polygon points="90,170 160,140 160,148 90,178" fill="#131C2E" />

      {/* Left Skyscraper Column */}
      <polygon points="40,85 70,95 70,145 40,135" fill="url(#sciFiL)" />
      <polygon points="70,95 90,85 90,135 70,145" fill="url(#sciFiR)" />
      <polygon points="70,55 92,67 70,79 48,67" fill="url(#cyanGlow)" stroke="#FFF" strokeWidth="0.5" />

      {/* Right Skyscraper Column */}
      <polygon points="90,85 110,95 110,145 90,135" fill="url(#sciFiL)" />
      <polygon points="110,95 140,85 140,135 110,145" fill="url(#sciFiR)" />
      <polygon points="110,55 132,67 110,79 88,67" fill="url(#cyanGlow)" stroke="#FFF" strokeWidth="0.5" />

      {/* High-Tech Main Vault Center Tower */}
      <polygon points="65,95 90,105 90,150 65,140" fill="url(#sciFiL)" />
      <polygon points="90,105 115,95 115,150 90,150" fill="url(#sciFiR)" />
      <polygon points="90,70 118,82 90,94 62,82" fill="url(#cyanGlow)" stroke="#FFF" strokeWidth="0.5" />

      {/* Giant Mechanical Cog on Central Tower (Spinning) */}
      <g style={{ transform: 'translate(90px, 125px)' }}>
        <circle cx="0" cy="0" r="16" fill="#1E293B" stroke="#00E5FF" strokeWidth="2.5" className="animate-spin" style={{ animationDuration: '10s', transformOrigin: '0 0' }} />
        {/* Teeth */}
        <rect x="-3" y="-20" width="6" height="40" fill="#00E5FF" transform="rotate(0)" />
        <rect x="-3" y="-20" width="6" height="40" fill="#00E5FF" transform="rotate(45)" />
        <rect x="-3" y="-20" width="6" height="40" fill="#00E5FF" transform="rotate(90)" />
        <rect x="-3" y="-20" width="6" height="40" fill="#00E5FF" transform="rotate(135)" />
        <circle cx="0" cy="0" r="8" fill="#00E5FF" />
        <circle cx="0" cy="0" r="3" fill="#1E293B" />
      </g>

      {/* Stacked Gold Bars in Front */}
      <g transform="translate(68, 142)">
        {/* Bar 1 */}
        <polygon points="5,-5 20,-10 30,-5 15,0" fill="url(#goldBarGrad)" />
        <polygon points="5,-5 15,0 15,4 5,-1" fill="#B7791F" />
        {/* Bar 2 */}
        <polygon points="20,-2 35,-7 45,-2 30,3" fill="url(#goldBarGrad)" />
        <polygon points="20,-2 30,3 30,7 20,2" fill="#B7791F" />
        {/* Bar 3 (Top) */}
        <polygon points="12,-10 27,-15 37,-10 22,-5" fill="url(#goldBarGrad)" />
        <polygon points="12,-10 22,-5 22,-1 12,-6" fill="#975A16" />
      </g>

      {/* Glowing Neon Lines (Sci-Fi Steampunk Vibe) */}
      <line x1="50" y1="90" x2="50" y2="130" stroke="#00E5FF" strokeWidth="1" filter="url(#cyanGlowF)" />
      <line x1="130" y1="90" x2="130" y2="130" stroke="#00E5FF" strokeWidth="1" filter="url(#cyanGlowF)" />
    </svg>
  );
}
