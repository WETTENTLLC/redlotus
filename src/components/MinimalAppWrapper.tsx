import React from 'react';
import MinimalHeader from './MinimalHeader';
import MinimalLayout from './MinimalLayout';

interface MinimalAppWrapperProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  children: React.ReactNode;
}

const navigationItems = [
  { id: 'hut', label: 'Home' },
  { id: 'music', label: 'Music' },
  { id: 'tribe', label: 'Tribe' },
  { id: 'vibrate', label: 'Vibrate' },
  { id: 'bts', label: 'Behind The Scenes' },
  { id: 'store', label: 'Store' },
  { id: 'live', label: 'Live' },
  { id: 'fanart', label: 'Fan Art' },
  { id: 'booking', label: 'Booking' },
  { id: 'community', label: 'Community' },
];

const MinimalAppWrapper: React.FC<MinimalAppWrapperProps> = ({
  activeSection,
  onSectionChange,
  children,
}) => {
  return (
    <div className="app-container">
      <MinimalHeader
        sections={navigationItems}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
      <MinimalLayout showAccentBar={activeSection !== 'admin'}>
        <div className="section fade-in">{children}</div>
      </MinimalLayout>
    </div>
  );
};

export default MinimalAppWrapper;
