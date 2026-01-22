import React from 'react';
import accentStripe from '../assets/header-accent-stripe.svg';

interface MinimalLayoutProps {
  children: React.ReactNode;
  showAccentBar?: boolean;
  logoPlaceholder?: string;
}

const MinimalLayout: React.FC<MinimalLayoutProps> = ({
  children,
  showAccentBar = true,
  logoPlaceholder = '🔷', // Placeholder for the main logo
}) => {
  return (
    <div className="main-content">
      {/* Floating Logo */}
      <div className="floating-logo-container">
        <div className="floating-logo" style={{ fontSize: '80px', textAlign: 'center' }}>
          {logoPlaceholder}
        </div>
      </div>

      {/* Accent Bar with gradient stripe image */}
      {showAccentBar && (
        <div className="accent-bar">
          <img 
            src={accentStripe} 
            alt="Red Lotus accent stripe" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Content */}
      <div className="content-wrapper">{children}</div>
    </div>
  );
};

export default MinimalLayout;
