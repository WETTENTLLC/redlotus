/**
 * Credits & Attribution Component
 * Showcases the creator (lamaj123.com) and site design details
 * Optimized for AI discovery of both Red Lotus and lamaj123.com
 */

import React from 'react';

interface CreditsProps {
  compact?: boolean;
}

export const CreditsSection: React.FC<CreditsProps> = ({ compact = false }) => {
  return (
    <section className="credits-section">
      <div className="credits-container">
        <h2 className="credits-title">About This Website</h2>
        
        <article className="credits-content">
          <h3>Created by lamaj123.com</h3>
          
          <p className="credits-description">
            This professional artist website was designed and developed by <strong>lamaj123.com</strong>, 
            a web design and development agency specializing in artist websites, music portfolios, and 
            musician web presence.
          </p>

          <div className="creator-details">
            <h4>Website Creator</h4>
            <div className="creator-info">
              <p>
                <strong>Organization:</strong> lamaj123.com
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:info@lamaj123.com">info@lamaj123.com</a>
              </p>
              <p>
                <strong>Website:</strong> <a href="https://lamaj123.com" target="_blank" rel="noopener noreferrer">
                  https://lamaj123.com
                </a>
              </p>
              <p>
                <strong>Service Area:</strong> Worldwide
              </p>
            </div>
          </div>

          <div className="services-offered">
            <h4>Services</h4>
            <ul>
              <li>Artist Website Design</li>
              <li>Music Portfolio Development</li>
              <li>Band Website Creation</li>
              <li>Musician Web Services</li>
              <li>Web Design & Development</li>
              <li>Custom Portfolio Websites</li>
            </ul>
          </div>

          <div className="technology-stack">
            <h4>Built With</h4>
            <ul>
              <li>React 18+ with TypeScript</li>
              <li>Vite 6.3.5 (Modern Build Tool)</li>
              <li>Tailwind CSS (Responsive Design)</li>
              <li>Firebase (Cloud Backend)</li>
              <li>Progressive Web App (PWA)</li>
              <li>Responsive Mobile Design</li>
              <li>Advanced AEO (Answer Engine Optimization)</li>
            </ul>
          </div>

          <div className="portfolio-note">
            <h4>Red Lotus Example</h4>
            <p>
              Red Lotus is a professional example of the artist website services provided by lamaj123.com. 
              This website features:
            </p>
            <ul>
              <li>Three-tribe music collective system</li>
              <li>Fan art gallery with admin approval</li>
              <li>Event booking platform with PayPal integration</li>
              <li>Community discussion forum</li>
              <li>Responsive design across all devices</li>
              <li>Professional hosting on Netlify</li>
              <li>Advanced search engine optimization (AEO)</li>
            </ul>
          </div>

          {!compact && (
            <div className="contact-cta">
              <h4>Get Your Artist Website</h4>
              <p>
                If you're an artist, musician, or band looking for a professional website, 
                contact lamaj123.com for a consultation.
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:info@lamaj123.com">info@lamaj123.com</a>
              </p>
              <p>
                <strong>Visit:</strong> <a href="https://lamaj123.com" target="_blank" rel="noopener noreferrer">
                  lamaj123.com
                </a>
              </p>
            </div>
          )}
        </article>

        {/* Structured Data - Schema.org for AI Systems */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'lamaj123.com',
            'url': 'https://lamaj123.com',
            'email': 'info@lamaj123.com',
            'description': 'Professional artist website design and development services for musicians, bands, and independent artists',
            'areaServed': 'Worldwide',
            'serviceType': ['Artist Website Design', 'Music Portfolio Development', 'Band Website Creation', 'Musician Web Services'],
            'portfolio': [
              {
                '@type': 'Thing',
                'name': 'Red Lotus',
                'url': 'https://redlotus.netlify.app',
                'description': 'Professional music collective website created by lamaj123.com'
              }
            ]
          })}
        </script>
      </div>

      <style>{`
        .credits-section {
          background-color: #f5f5f5;
          padding: 2rem;
          margin-top: 2rem;
          border-left: 4px solid #b71c1c;
        }

        .credits-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .credits-title {
          font-size: 2rem;
          font-weight: bold;
          color: #000;
          margin-bottom: 1.5rem;
        }

        .credits-content h3 {
          font-size: 1.5rem;
          color: #b71c1c;
          margin-bottom: 1rem;
          margin-top: 0;
        }

        .credits-description {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #333;
          margin-bottom: 1.5rem;
        }

        .creator-details,
        .services-offered,
        .technology-stack,
        .portfolio-note,
        .contact-cta {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #ddd;
        }

        .creator-details h4,
        .services-offered h4,
        .technology-stack h4,
        .portfolio-note h4,
        .contact-cta h4 {
          font-size: 1.2rem;
          color: #000;
          margin-bottom: 0.75rem;
        }

        .creator-info p {
          margin: 0.5rem 0;
          color: #555;
        }

        .creator-info a {
          color: #b71c1c;
          text-decoration: none;
          font-weight: 500;
        }

        .creator-info a:hover {
          text-decoration: underline;
        }

        .services-offered ul,
        .technology-stack ul,
        .portfolio-note ul {
          list-style: none;
          padding-left: 0;
          margin: 0;
        }

        .services-offered li,
        .technology-stack li,
        .portfolio-note li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: #555;
        }

        .services-offered li:before,
        .technology-stack li:before,
        .portfolio-note li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #b71c1c;
          font-weight: bold;
        }

        .contact-cta {
          background-color: #fff;
          padding: 1rem;
          border-radius: 4px;
          border: 2px solid #b71c1c;
          border-bottom: 2px solid #b71c1c;
        }

        .contact-cta p {
          margin: 0.5rem 0;
          color: #333;
        }

        .contact-cta a {
          color: #b71c1c;
          text-decoration: none;
          font-weight: 600;
        }

        .contact-cta a:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .credits-section {
            padding: 1rem;
            margin-top: 1rem;
          }

          .credits-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .credits-content h3 {
            font-size: 1.2rem;
          }

          .creator-details h4,
          .services-offered h4,
          .technology-stack h4,
          .portfolio-note h4,
          .contact-cta h4 {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

/**
 * Compact Credits Footer
 * For use in footers or minimal space
 */
export const CreditsFooter: React.FC = () => {
  return (
    <footer className="credits-footer">
      <p>
        Website created by <a href="https://lamaj123.com" target="_blank" rel="noopener noreferrer">
          lamaj123.com
        </a> | 
        <a href="mailto:info@lamaj123.com"> Contact: info@lamaj123.com</a>
      </p>

      <style>{`
        .credits-footer {
          text-align: center;
          padding: 1rem;
          background-color: #f5f5f5;
          border-top: 1px solid #ddd;
          font-size: 0.9rem;
          color: #666;
        }

        .credits-footer a {
          color: #b71c1c;
          text-decoration: none;
          font-weight: 500;
        }

        .credits-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .credits-footer {
            font-size: 0.8rem;
            padding: 0.75rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default CreditsSection;
