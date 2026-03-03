import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', lineHeight: '1.8' }}>
      <h1>Privacy Policy</h1>
      <p style={{ fontSize: '12px', color: '#666' }}>Last Updated: March 3, 2026</p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to Red Lotus ("we," "us," "our," or "Company"). Red Lotus is committed to protecting your privacy.
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
        website including any other media form, media channel, mobile website, or mobile application related or
        connected thereto (collectively, the "Site").
      </p>

      <h2>2. Information We Collect</h2>
      <h3>2.1 Automatically Collected Information</h3>
      <p>
        When you visit the Site, we automatically collect certain information about your device, including but not
        limited to:
      </p>
      <ul>
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Pages visited and time spent on pages</li>
        <li>Referring URL and device identifiers</li>
      </ul>

      <h3>2.2 Information from Third Parties</h3>
      <p>
        <strong>Google AdSense:</strong> We use Google AdSense to serve advertisements on our Site. Google may use
        cookies and similar technologies to serve ads based on your prior visits to our Site and other websites.
        Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our
        Site and other sites on the Internet.
      </p>

      <h3>2.3 Firebase Analytics</h3>
      <p>
        We use Firebase Analytics to analyze how you use our Site. Firebase may collect information such as page views,
        events, and user properties.
      </p>

      <h2>3. Use of Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Serve and optimize advertisements through Google AdSense</li>
        <li>Analyze Site usage and improve user experience</li>
        <li>Detect, prevent, and address fraud and security issues</li>
        <li>Enforce our Terms of Service and other agreements</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>4. Cookies and Tracking Technologies</h2>
      <p>
        Our Site uses cookies and similar tracking technologies. Google AdSense uses cookies to serve ads based on your
        prior visits to our Site or other websites. You can control cookie settings in your browser preferences.
      </p>

      <h2>5. Third-Party Services</h2>
      <h3>5.1 Google AdSense</h3>
      <p>
        Google AdSense, operated by Google LLC, may use cookies to serve personalized ads. For more information about
        Google's privacy practices, visit:{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          https://policies.google.com/privacy
        </a>
      </p>

      <h3>5.2 Firebase</h3>
      <p>
        Firebase Analytics collects information to help us understand how users interact with our Site. For more
        information, visit:{' '}
        <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">
          https://firebase.google.com/support/privacy
        </a>
      </p>

      <h2>6. Your Rights and Choices</h2>
      <p>
        <strong>Ad Personalization:</strong> You can opt out of personalized ads by visiting Google's Ad Settings at{' '}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          https://adssettings.google.com
        </a>
      </p>
      <p>
        <strong>Cookies:</strong> You can disable cookies through your browser settings. Note that this may affect Site
        functionality.
      </p>

      <h2>7. Data Security</h2>
      <p>
        We implement technical and organizational security measures to protect your information. However, no method of
        transmission over the Internet is 100% secure.
      </p>

      <h2>8. Children's Privacy</h2>
      <p>
        The Site is not intended for children under 13. We do not knowingly collect information from children under 13.
        If we become aware of such collection, we will promptly delete it.
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last
        Updated" date.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at: <strong>contact@redlotus.music</strong>
      </p>

      <hr style={{ margin: '40px 0', borderColor: '#ddd' }} />
      <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
        Red Lotus Official Music Collective © 2026. All rights reserved.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
