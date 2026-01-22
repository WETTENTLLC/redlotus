import React from 'react';

interface MinimalHeaderProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const MinimalHeader: React.FC<MinimalHeaderProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">Red Lotus</div>
        <nav className="nav-menu">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default MinimalHeader;
