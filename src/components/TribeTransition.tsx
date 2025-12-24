import React from 'react';

interface TribeTransitionProps {
  tribe: 'red' | 'yellow' | 'blue';
  isActive: boolean;
}

const TribeTransition: React.FC<TribeTransitionProps> = ({ tribe, isActive }) => {
  const tribeEffects = {
    red: {
      particles: '❄️',
      gradient: 'from-red-900 via-red-600 to-red-300',
      glow: 'shadow-red-500/50',
      animation: 'animate-pulse'
    },
    yellow: {
      particles: '☀️',
      gradient: 'from-yellow-900 via-yellow-500 to-yellow-200',
      glow: 'shadow-yellow-500/50',
      animation: 'animate-bounce'
    },
    blue: {
      particles: '🌸',
      gradient: 'from-blue-900 via-blue-600 to-blue-300',
      glow: 'shadow-blue-500/50',
      animation: 'animate-pulse'
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-radial ${tribeEffects[tribe].gradient} opacity-20 animate-pulse`} />
      
      {/* Floating Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`absolute text-4xl ${tribeEffects[tribe].animation}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        >
          {tribeEffects[tribe].particles}
        </div>
      ))}
      
      {/* Ripple Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-96 h-96 rounded-full border-4 border-${tribe}-lotus opacity-30 animate-ping`} />
        <div className={`absolute w-64 h-64 rounded-full border-2 border-${tribe}-lotus opacity-50 animate-ping`} style={{ animationDelay: '0.5s' }} />
        <div className={`absolute w-32 h-32 rounded-full border border-${tribe}-lotus opacity-70 animate-ping`} style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default TribeTransition;