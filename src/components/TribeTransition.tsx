import React from 'react';

interface TribeTransitionProps {
  tribe: 'red' | 'yellow' | 'blue';
  isActive: boolean;
}

const TribeTransition: React.FC<TribeTransitionProps> = ({ tribe, isActive }) => {
  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)',
        animation: 'smoothTransition 0.6s ease-out forwards'
      }}
    >
      <style>{`
        @keyframes smoothTransition {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TribeTransition;